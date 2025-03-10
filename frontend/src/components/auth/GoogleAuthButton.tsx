'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { googleAuth } from '@/lib/api'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleAuthButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async (response: any) => {
    try {
      setIsLoading(true)
      
      // Get the ID token from the Google Sign-In response
      const idToken = response.credential
      
      if (!idToken) {
        throw new Error('No ID token received from Google')
      }
      
      // Call the backend API to authenticate with Google
      await googleAuth({ idToken })
      
      toast({
        title: "Success",
        description: "Signed in with Google successfully!",
      })
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Google auth error:', error)
      toast({
        title: "Authentication Failed",
        description: error.toString(),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize Google Sign-In when the component mounts
  useState(() => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
      })
      
      const googleButtonDiv = document.getElementById('google-signin-button')
      if (googleButtonDiv) {
        window.google.accounts.id.renderButton(googleButtonDiv, {
          theme: 'outline',
          size: 'large',
          width: '100%',
        })
      }
    }
  })

  // For environments without Google Sign-In button rendering available
  const handleManualGoogleSignIn = () => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.prompt()
    } else {
      toast({
        title: "Google Sign-In Error",
        description: "Google Sign-In is not available. Please try another method.",
        variant: "destructive",
      })
    }
  }

  return (
    <>      
      {/* Fallback button in case Google's API is not available */}
      {(!window.google || isLoading) && (
        <Button 
          variant="outline" 
          type="button"
          className="w-full"
          onClick={handleManualGoogleSignIn}
          disabled
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
              </svg>
              Sign in with Google
            </>
          )}
        </Button>
      )}
    </>
  )
}
