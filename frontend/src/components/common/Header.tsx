'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { logout, isAuthenticated, getCurrentUser } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import NavDropdown from '@/components/navigation/NavDropdown'

export default function Header() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    if (typeof window !== 'undefined') {
      const loggedIn = isAuthenticated()
      setIsLoggedIn(loggedIn)
      if (loggedIn) {
        setUser(getCurrentUser())
      }
    }
  }

  const handleMenuEnter = (menu: string) => {
    setActiveMenu(menu)
  }

  const handleMenuLeave = () => {
    setActiveMenu(null)
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsLoggedIn(false)
      setUser(null)
      toast({
        title: "Logged out successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Don't render anything on the server to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#0b1736]">URL Shortener</span>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Platform Menu */}
            <NavDropdown 
              title="Platform"
              id="platform"
              active={activeMenu === "platform"}
              onMouseEnter={() => handleMenuEnter("platform")}
              onMouseLeave={handleMenuLeave}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {/* Products Column */}
                <div>
                  <h3 className="text-gray-500 font-medium mb-3 md:mb-4 text-sm tracking-wider">
                    PRODUCTS
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    <Link href="/url-shortener" className="flex items-start group">
                      <div className="mr-2 md:mr-3 text-gray-400 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium group-hover:text-[#ff5c00] truncate">
                          URL Shortener
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          Customize, share and track links
                        </div>
                      </div>
                    </Link>

                    <Link href="/analytics" className="flex items-start group">
                      <div className="mr-2 md:mr-3 text-gray-400 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium group-hover:text-[#ff5c00] truncate">
                          Analytics
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          A central place to track and analyze performance
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Features Column */}
                <div>
                  <h3 className="text-gray-500 font-medium mb-3 md:mb-4 text-sm tracking-wider">
                    FEATURES
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    <Link href="/features/link-in-bio" className="flex items-start group">
                      <div className="mr-2 md:mr-3 text-gray-400 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium group-hover:text-[#ff5c00] truncate">
                          Link-in-bio
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          Curate and track links and content for social
                          media profiles
                        </div>
                      </div>
                    </Link>

                    <Link href="/features/branded-links" className="flex items-start group">
                      <div className="mr-2 md:mr-3 text-gray-400 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium group-hover:text-[#ff5c00] truncate">
                          Branded Links
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          Customize links with your brand's URL
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </NavDropdown>

            {/* Solutions Menu */}
            <NavDropdown 
              title="Solutions"
              id="solutions"
              active={activeMenu === "solutions"}
              onMouseEnter={() => handleMenuEnter("solutions")}
              onMouseLeave={handleMenuLeave}
            >
              <div className="grid grid-cols-2 gap-8">
                {/* By Industry Column */}
                <div>
                  <h3 className="text-gray-500 font-medium mb-4 text-sm tracking-wider">
                    BY INDUSTRY
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <Link href="/solutions/retail" className="text-sm hover:text-[#ff5c00]">
                      Retail
                    </Link>
                    <Link href="/solutions/tech" className="text-sm hover:text-[#ff5c00]">
                      Technology
                    </Link>
                    <Link href="/solutions/healthcare" className="text-sm hover:text-[#ff5c00]">
                      Healthcare
                    </Link>
                    <Link href="/solutions/education" className="text-sm hover:text-[#ff5c00]">
                      Education
                    </Link>
                  </div>
                </div>

                {/* Use Cases Column */}
                <div>
                  <h3 className="text-gray-500 font-medium mb-4 text-sm tracking-wider">
                    USE CASES
                  </h3>
                  <div className="space-y-5">
                    <Link href="/use-cases/marketing" className="flex items-start group">
                      <div className="mr-3 text-gray-400 mt-0.5">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium group-hover:text-[#ff5c00]">
                          Digital Marketing
                        </div>
                      </div>
                    </Link>

                    <Link href="/use-cases/social-media" className="flex items-start group">
                      <div className="mr-3 text-gray-400 mt-0.5">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium group-hover:text-[#ff5c00]">
                          Social Media
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </NavDropdown>
          </nav>

          {/* Right side Navigation */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user?.userName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-[#0b1736] hover:text-[#ff5c00] hidden lg:block"
                >
                  Log in
                </Link>

                <Link
                  href="/auth/register"
                  className="bg-[#0066ff] text-white hover:bg-[#0052cc] px-4 py-2 rounded-md font-medium whitespace-nowrap"
                >
                  Sign up Free
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button 
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMobileMenuOpen 
                    ? "M6 18L18 6M6 6l12 12" 
                    : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              <Link
                href="/url-shortener"
                className="block py-2 px-4 text-[#0b1736] hover:bg-gray-100"
              >
                URL Shortener
              </Link>
              <Link
                href="/analytics"
                className="block py-2 px-4 text-[#0b1736] hover:bg-gray-100"
              >
                Analytics
              </Link>
              <Link
                href="/pricing"
                className="block py-2 px-4 text-[#0b1736] hover:bg-gray-100"
              >
                Pricing
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/auth/login"
                  className="block py-2 px-4 text-[#0b1736] hover:bg-gray-100"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
