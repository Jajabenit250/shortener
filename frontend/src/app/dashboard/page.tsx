'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUserUrls, isAuthenticated } from '@/lib/api'
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MoreHorizontal, LinkIcon, BarChart2Icon, Copy, ExternalLink } from "lucide-react"
import Header from '@/components/common/Header'
import ShortenerForm from '@/components/shortener/ShortenerForm'

interface UrlData {
  id: string
  originalUrl: string
  alias: string
  shortUrl: string
  createdAt: string
  expiresAt?: string
  clicks: number
  status: string
  isPasswordProtected: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [urls, setUrls] = useState<UrlData[]>([])
  const [totalUrls, setTotalUrls] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [activeTab, setActiveTab] = useState('all-links')

  useEffect(() => {
    // Check if user is authenticated
    // if (typeof window !== 'undefined') {
    //   if (!isAuthenticated()) {
    //     router.push('/auth/login?redirect=dashboard')
    //     return
    //   }
    // }

    // Load user's URLs
    fetchUrls()
  }, [page, limit, searchTerm, statusFilter, activeTab])

  const fetchUrls = async () => {
    setIsLoading(true)
    try {
      const filters: any = {}
      
      if (searchTerm) {
        filters.search = searchTerm
      }
      
      if (statusFilter) {
        filters.status = statusFilter
      }
      
      const data = await getUserUrls(filters, page, limit)
      setUrls(data.urls)
      setTotalUrls(data.total)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your URLs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    })
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'expired':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Expired</Badge>
      case 'disabled':
        return <Badge variant="secondary">Disabled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const totalPages = Math.ceil(totalUrls / limit)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your shortened URLs</p>
          </div>
          
          <Button 
            className="mt-4 md:mt-0 bg-[#0066ff] hover:bg-[#0052cc]"
            onClick={() => document.getElementById('create-new-url')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Create New URL
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Total URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUrls}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {urls.reduce((sum, url) => sum + url.clicks, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Active URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {urls.filter(url => url.status.toLowerCase() === 'active').length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all-links">All Links</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
            <TabsTrigger value="protected">Password Protected</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between my-4 gap-4">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short URL</TableHead>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : urls.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                        No URLs found. Create your first shortened URL below!
                      </TableCell>
                    </TableRow>
                  ) : (
                    urls.map(url => (
                      <TableRow key={url.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <span className="truncate max-w-[180px]">{url.shortUrl}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 ml-1" 
                              onClick={() => handleCopyUrl(url.shortUrl)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="truncate max-w-[180px]">{url.originalUrl}</span>
                            <a 
                              href={url.originalUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-1 text-gray-400 hover:text-gray-600"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(url.createdAt)}</TableCell>
                        <TableCell>{url.clicks}</TableCell>
                        <TableCell>{getStatusBadge(url.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Link href={`/analytics/${url.alias}`} className="flex items-center w-full">
                                  <BarChart2Icon className="mr-2 h-4 w-4" />
                                  <span>Analytics</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopyUrl(url.shortUrl)}>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Copy URL</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {urls.length} of {totalUrls} URLs
              </div>
              
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={page === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardFooter>
          </Card>
        </Tabs>
        
        <div id="create-new-url" className="mb-12 scroll-mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Short URL</CardTitle>
              <CardDescription>
                Enter a long URL to generate a shortened link that's easy to share
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShortenerForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
