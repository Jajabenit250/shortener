'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/api'
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'
import GithubAuthButton from '@/components/auth/GithubAuthButton'
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{email?: string; password?: string}>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {}
    
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (!password) {
      newErrors.password = "Password is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      await login({
        email,
        password,
      })
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to your account.",
      })
      
      router.push(redirectPath)
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.toString(),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-2 space-y-3 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-gray-500 text-sm">
                Enter your credentials to access your account
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors({...errors, email: undefined})
                      }}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center text-red-500 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link 
                      href="/auth/forgot-password" 
                      className="text-xs text-blue-600 hover:text-blue-500 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      className={`pl-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password) setErrors({...errors, password: undefined})
                      }}
                    />
                  </div>
                  {errors.password && (
                    <div className="flex items-center text-red-500 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.password}
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <GoogleAuthButton />
                  <GithubAuthButton />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center pb-6 px-8">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
