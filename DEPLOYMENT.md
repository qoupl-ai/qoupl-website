# Deployment Guide for qoupl

This guide will help you deploy the qoupl landing page to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"

3. **Import Repository**
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Find and import your repository

4. **Configure Project**
   - Vercel will automatically detect Next.js
   - Project name: `couple` (or your preferred name)
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)
   - Your site will be live at `https://your-project-name.vercel.app`

## Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Setup and deploy: `Y`
   - Scope: Select your account
   - Link to existing project: `N` (for first deployment)
   - Project name: `couple`
   - Directory: `./`
   - Override settings: `N`

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables

If you need to add environment variables:

1. Go to your project on Vercel
2. Navigate to Settings > Environment Variables
3. Add your variables
4. Redeploy the project

## Custom Domain

To add a custom domain:

1. Go to your project on Vercel
2. Navigate to Settings > Domains
3. Add your domain
4. Update your DNS settings as instructed
5. Wait for DNS propagation (can take up to 48 hours)

## Automatic Deployments

Once connected to Git, Vercel will automatically:
- Deploy every push to the `main` branch
- Create preview deployments for pull requests
- Run builds and tests before deploying

## Troubleshooting

### Build Fails
- Check the build logs in the Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test the build locally with `npm run build`

### Environment Issues
- Verify all required environment variables are set
- Check that variable names match your code

### Performance Issues
- Vercel automatically optimizes your deployment
- Check the Analytics tab for performance metrics
- Consider enabling Vercel Analytics for detailed insights

## Monitoring

After deployment, you can:
- View deployment logs in the Vercel dashboard
- Monitor performance metrics
- Set up custom analytics
- Configure deployment notifications

## Support

For Vercel-specific issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

For project issues:
- Check the main README.md
- Review the codebase documentation
