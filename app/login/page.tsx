'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/add-content'
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.push(redirect)
      } else {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push(redirect)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, redirect])

  if (loading) {
    return (
      <div 
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: '#171717' }}
      >
        <div className="text-center">
          <div 
            className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent mx-auto mb-4"
            style={{ 
              borderColor: '#662D91',
              borderTopColor: 'transparent'
            }}
          ></div>
          <p style={{ color: '#898989' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: '#171717' }}
    >
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/quoupl.svg"
              alt="qoupl"
              width={120}
              height={40}
              className="h-10 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
              priority
            />
          </div>
          <p style={{ color: '#898989', fontSize: '14px', fontWeight: '500' }}>
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div 
          className="rounded-lg border p-8 shadow-lg"
          style={{ 
            backgroundColor: '#212121',
            borderColor: '#2a2a2a'
          }}
        >
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#662D91',
                    brandAccent: '#8B3DB8',
                    inputBackground: '#171717',
                    inputBorder: '#2a2a2a',
                    inputText: '#ffffff',
                    inputLabelText: '#898989',
                    messageText: '#898989',
                    messageTextDanger: '#ef4444',
                    anchorTextColor: '#662D91',
                    anchorTextHoverColor: '#8B3DB8',
                  },
                  space: {
                    spaceSmall: '0.5rem',
                    spaceMedium: '1rem',
                    spaceLarge: '1.5rem',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                    baseLabelSize: '13px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    borderRadiusInput: '0.5rem',
                    borderRadiusLabel: '0.5rem',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full',
                input: 'w-full',
              },
            }}
            providers={[]}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}${redirect}`}
            onlyThirdPartyProviders={false}
            magicLink={false}
            view="sign_in"
            showLinks={false}
          />
        </div>

        <p 
          className="mt-6 text-center text-sm"
          style={{ color: '#898989' }}
        >
          Admin access only. Contact support if you need access.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
