# Deploy runbook: Google Cloud hosting for qoupl-website

Supabase stays exactly as it is (database, storage, RLS). Only the hosting moves:

```
Browser -> Firebase Hosting (domain + CDN) -> rewrite -> Cloud Run service "qoupl-website" (asia-south1) -> Supabase
```

Run every step yourself, in order. Nothing in the pull request creates infrastructure.
Steps marked **[SECRET]** involve a secret value that only you should ever handle.

Set these shell variables once. Replace the placeholders.

```bash
export PROJECT_ID="your-gcp-project-id"      # decide: new project, or an existing one
export REGION="asia-south1"
export REPO="qoupl-ai/qoupl-website"
export SERVICE="qoupl-website"
export AR_REPO="qoupl"
export RUNTIME_SA="qoupl-web-runtime"
export DEPLOY_SA="qoupl-web-deployer"
export DOMAIN="example.com"                  # your real domain
gcloud auth login
gcloud config set project "$PROJECT_ID"
export PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
```

If the project does not exist yet: `gcloud projects create "$PROJECT_ID"` and link a billing account in the console (Billing > Link a billing account). Cloud Run needs billing enabled even when usage stays inside the free tier.

## 1. Enable the APIs

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com \
  cloudresourcemanager.googleapis.com \
  firebase.googleapis.com \
  firebasehosting.googleapis.com
```

## 2. Create the Artifact Registry repository

```bash
gcloud artifacts repositories create "$AR_REPO" \
  --repository-format=docker \
  --location="$REGION" \
  --description="qoupl-website images"
```

## 3. Create the runtime service account

This is the identity the running site uses. It gets access to the three secrets and nothing else.

```bash
gcloud iam service-accounts create "$RUNTIME_SA" --display-name="qoupl-website runtime"
```

## 4. Secret Manager entries  **[SECRET: values are yours alone]**

The three values come from Supabase Dashboard > Project Settings > API (URL, `anon` key, `service_role` key). Type or paste each one at the prompt; the `read -s` form keeps it out of your shell history and screen.

`SUPABASE_SERVICE_ROLE_KEY` bypasses every row-level-security policy in the project. It is mounted at runtime from Secret Manager and must never reach an image layer, a build argument or the repository. The workflow in this PR never gives it to the build.

```bash
create_secret () {
  # $1 = secret name. Reads the value silently and sends it to Secret Manager over stdin.
  printf 'Value for %s: ' "$1"; read -rs value; echo
  printf '%s' "$value" | gcloud secrets create "$1" --replication-policy=automatic --data-file=-
  unset value
}
create_secret supabase-url
create_secret supabase-anon-key
create_secret supabase-service-role-key
```

Grant the runtime service account read access to each:

```bash
for s in supabase-url supabase-anon-key supabase-service-role-key; do
  gcloud secrets add-iam-policy-binding "$s" \
    --member="serviceAccount:${RUNTIME_SA}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
done
```

The deploy workflow mounts them as `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` (`--set-secrets`, `:latest`). To rotate a key later, add a new version (`printf '%s' "$value" | gcloud secrets versions add NAME --data-file=-`) and redeploy.

Note: `NEXT_PUBLIC_*` values are also inlined into the browser bundle at build time, which is why the workflow supplies the URL and anon key to the build as BuildKit secrets (step 7). Both are public by design.

## 5. Create the Cloud Run service

The Firebase Hosting rewrite needs the service to exist. Create it once from Google's sample image; the first real deploy replaces it.

```bash
gcloud run deploy "$SERVICE" \
  --image=us-docker.pkg.dev/cloudrun/container/hello \
  --region="$REGION" \
  --service-account="${RUNTIME_SA}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --allow-unauthenticated \
  --min-instances=0 \
  --max-instances=3
```

`--allow-unauthenticated` is required: Firebase Hosting calls the service as a public client.

## 6. Workload Identity Federation for GitHub Actions (no key files)

```bash
# Service account the workflow impersonates
gcloud iam service-accounts create "$DEPLOY_SA" --display-name="qoupl-website GitHub deployer"
DEPLOY_SA_EMAIL="${DEPLOY_SA}@${PROJECT_ID}.iam.gserviceaccount.com"

# Roles it needs: push images, deploy Cloud Run, deploy Hosting, act as the runtime account
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:${DEPLOY_SA_EMAIL}" --role="roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:${DEPLOY_SA_EMAIL}" --role="roles/run.admin"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:${DEPLOY_SA_EMAIL}" --role="roles/firebasehosting.admin"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:${DEPLOY_SA_EMAIL}" --role="roles/serviceusage.serviceUsageConsumer"
gcloud iam service-accounts add-iam-policy-binding "${RUNTIME_SA}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --member="serviceAccount:${DEPLOY_SA_EMAIL}" --role="roles/iam.serviceAccountUser"

# Identity pool and GitHub provider, restricted to this one repository
gcloud iam workload-identity-pools create github --location=global --display-name="GitHub Actions"
gcloud iam workload-identity-pools providers create-oidc github-oidc \
  --location=global --workload-identity-pool=github \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository == '${REPO}'"

# Allow only that repository to impersonate the deployer
gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SA_EMAIL" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github/attribute.repository/${REPO}"

# The value for GCP_WORKLOAD_IDENTITY_PROVIDER (step 7)
gcloud iam workload-identity-pools providers describe github-oidc \
  --location=global --workload-identity-pool=github --format='value(name)'
```

If the first Firebase deploy reports a missing permission, grant the role it names to `$DEPLOY_SA_EMAIL`; the list above is the expected minimum, not a tested one.

## 7. Repository secrets and variables

Variables are not secret. The two secrets are the Supabase URL and anon key, used by the build and by the keepalive.

```bash
gh variable set GCP_PROJECT_ID --repo "$REPO" --body "$PROJECT_ID"
gh variable set GCP_WORKLOAD_IDENTITY_PROVIDER --repo "$REPO" \
  --body "projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github/providers/github-oidc"
gh variable set GCP_DEPLOY_SERVICE_ACCOUNT --repo "$REPO" --body "${DEPLOY_SA}@${PROJECT_ID}.iam.gserviceaccount.com"
```

**[SECRET]** `gh secret set` prompts for the value and hides it:

```bash
gh secret set SUPABASE_URL --repo "$REPO"
gh secret set SUPABASE_ANON_KEY --repo "$REPO"
```

Never set the service-role key as a GitHub secret. Optional: `gh variable set KEEPALIVE_TABLE --repo "$REPO" --body blog_posts` (the default) to change the table the keepalive reads.

| Name | Kind | Used by |
|---|---|---|
| `GCP_PROJECT_ID` | variable | deploy (or pass `gcp_project_id` when dispatching) |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | variable | deploy |
| `GCP_DEPLOY_SERVICE_ACCOUNT` | variable | deploy |
| `SUPABASE_URL` | secret | deploy (build), keepalive |
| `SUPABASE_ANON_KEY` | secret | deploy (build), keepalive |
| `KEEPALIVE_TABLE` | variable, optional | keepalive |

## 8. Set up Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase projects:addfirebase "$PROJECT_ID"      # skip if the project is already a Firebase project
firebase hosting:sites:list --project "$PROJECT_ID"
```

The default site (named after the project id) is what `firebase.json` deploys to. The Cloud Run service and the Hosting site must be in the same project.

## 9. First deploy and the keepalive

Merge the PR yourself when you are satisfied, then start the workflows yourself:

```bash
gh workflow run deploy.yml --repo "$REPO"                 # or: -f gcp_project_id=...
gh workflow run supabase-keepalive.yml --repo "$REPO"     # proves the keepalive works before the cron does
gh run list --repo "$REPO" --limit 5
```

The default Hosting URL (`https://PROJECT_ID.web.app`) should now serve the site.

## 10. Connect your custom domain to Firebase Hosting

Source: https://firebase.google.com/docs/hosting/custom-domain (read 2026-11-06). Record values are shown to you in the console; the ones below are the shapes you should expect.

1. Firebase console > your project > Build > Hosting > **Add custom domain**. Enter `example.com` (and add `www` the same way, or tick the redirect option). Continue.
2. **Ownership: TXT record.** The console shows a TXT value. At your DNS provider add a TXT record with host `@` (some providers want the bare domain or a blank host) and that value. Verifying the apex proves ownership of its subdomains. Keep the record permanently. Propagation can take up to 24 hours; click **Verify** when ready.
3. **Point traffic: A records.** Choose Quick Setup. The console lists the A records; Google's documented example is `199.36.158.100` for the apex (`@`) and for `www`. Use the values the console shows you.
4. **Remove conflicts first.** Delete any existing A or CNAME records pointing at the old host (Vercel). In Quick Setup also delete any **AAAA** records, which block certificate issuance. (Advanced Setup, for zero-downtime migration, uses a `hosting-site=SITE_ID` TXT record plus an ACME challenge, and you add the A/AAAA records only after the certificate exists. Use it if the site must not go dark while DNS moves.)
5. **SSL provisioning.** Google mints the certificate after DNS points at Hosting. Allow up to 24 hours. During that window a certificate that does not list your domain is normal. Status in the Hosting page moves through Needs setup, Pending, Minting Certificate, then **Connected**.
6. **Check it went live.**

```bash
dig +short A "$DOMAIN"                 # expect the Hosting IP(s) from step 3
curl -sI "https://$DOMAIN/" | head -5  # expect HTTP/2 200 and a valid certificate
curl -s -o /dev/null -w '%{http_code}\n' "https://$DOMAIN/blog"
```

Each custom domain attaches to one Hosting site; an apex supports about 20 subdomains because of certificate limits. Do not cancel the Vercel project until the domain shows **Connected** and the checks above pass.

## Rolling back

Redeploy a previous image tag (the git SHA of an earlier run): `gcloud run deploy "$SERVICE" --region "$REGION" --image "$REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/$SERVICE:<sha>"`, or shift traffic to a prior revision in the Cloud Run console.
