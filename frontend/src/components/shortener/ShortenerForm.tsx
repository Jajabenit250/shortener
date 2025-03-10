'use client'

import { useState } from 'react'
import { shortenUrl } from '@/lib/api'
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function ShortenerForm() {
  const [url, setUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState('short-link')

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      })
      return
    }

    // URL validation
    try {
      new URL(url)
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const data = await shortenUrl({
        originalUrl: url,
        alias: customAlias || undefined,
      })
      
      setShortenedUrl(data.shortUrl)
      toast({
        title: "URL Shortened",
        description: "Your URL has been shortened successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.toString(),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToClipboard = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl)
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
      })
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList className="grid w-fit grid-cols-2 mx-auto">
          <TabsTrigger value="short-link" className="flex items-center">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke={selectedTab === 'short-link' ? '#FF5C00' : 'currentColor'} strokeWidth="2">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Short link
          </TabsTrigger>
          <TabsTrigger value="qr-code" className="flex items-center">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke={selectedTab === 'qr-code' ? '#FF5C00' : 'currentColor'} strokeWidth="2">
              <path d="M9.5 3h-5a1.5 1.5 0 00-1.5 1.5v5A1.5 1.5 0 004.5 11h5A1.5 1.5 0 0011 9.5v-5A1.5 1.5 0 009.5 3z" />
              <path d="M9.5 13h-5A1.5 1.5 0 003 14.5v5A1.5 1.5 0 004.5 21h5A1.5 1.5 0 0011 19.5v-5A1.5 1.5 0 009.5 13z" />
              <path d="M19.5 3h-5A1.5 1.5 0 0013 4.5v5A1.5 1.5 0 0014.5 11h5A1.5 1.5 0 0021 9.5v-5A1.5 1.5 0 0019.5 3z" />
              <path d="M14 16.5h.01" />
              <path d="M17 16.5h.01" />
              <path d="M14 19.5h.01" />
              <path d="M17 19.5h.01" />
              <path d="M20 16.5h.01" />
              <path d="M20 19.5h.01" />
            </svg>
            QR Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="short-link" className="mt-6">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#001833] mb-4 text-left">
              Shorten a long link
            </h2>
            <p className="text-gray-600 mb-6 text-left">No credit card required.</p>
            
            {shortenedUrl ? (
              <div className="mb-6 bg-blue-50 p-6 rounded-lg">
                <Label className="block text-gray-700 font-medium mb-2 text-left">
                  Your shortened URL
                </Label>
                <div className="flex items-center">
                  <Input 
                    type="text"
                    value={shortenedUrl}
                    readOnly
                    className="flex-1 border-r-0 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button 
                    type="button"
                    className="rounded-l-none" 
                    onClick={handleCopyToClipboard}
                  >
                    Copy
                  </Button>
                </div>
                <div className="mt-4 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShortenedUrl(null)
                      setUrl('')
                      setCustomAlias('')
                      setShowCustom(false)
                    }}
                  >
                    Shorten another URL
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleShorten}>
                <div className="mb-6">
                  <Label htmlFor="url" className="block text-gray-700 font-medium mb-2 text-left">
                    Paste your long link here
                  </Label>
                  <Input
                    type="url"
                    id="url"
                    className="w-full px-4 py-3"
                    placeholder="https://example.com/my-long-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>

                {showCustom && (
                  <div className="mb-6">
                    <Label htmlFor="custom-alias" className="block text-gray-700 font-medium mb-2 text-left">
                      Custom back-half (optional)
                    </Label>
                    <Input
                      type="text"
                      id="custom-alias"
                      className="w-full px-4 py-3"
                      placeholder="e.g., my-brand-name"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowCustom(!showCustom)}
                    className="text-[#0066ff] hover:text-[#0052cc] p-0 h-auto justify-start"
                  >
                    {showCustom ? 'Hide custom back-half' : 'Add custom back-half'} 
                  </Button>
                  
                  <Button
                    type="submit"
                    className="bg-[#0066ff] text-white hover:bg-[#0052cc] px-6 py-3 rounded-md font-medium w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Get your link for free
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </TabsContent>

        <TabsContent value="qr-code" className="mt-6">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#001833] mb-4 text-left">
              Create a QR Code
            </h2>
            <p className="text-gray-600 mb-6 text-left">
              QR Code generation coming soon!
            </p>
            <p className="text-center text-gray-500 my-8">
              QR Code generation functionality will be implemented in future updates.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Free Plan Features */}
      <div className="mt-10 text-center">
        <h3 className="text-xl font-semibold mb-4">Sign up for free. Your free plan includes:</h3>
        <div className="flex flex-wrap justify-center gap-8 mt-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-[#FF5C00] mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>5 short links/month</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-[#FF5C00] mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>3 custom back-halves/month</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-[#FF5C00] mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Unlimited link clicks</span>
          </div>
        </div>
      </div>
    </div>
  )
}
