'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUrlAnalytics, isAuthenticated } from '@/lib/api'
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, Copy } from "lucide-react"
import Header from '@/components/common/Header'
import { format, subDays } from 'date-fns'

interface AnalyticsData {
  totalClicks: number
  uniqueVisitors: number
  referrers: Record<string, number>
  browsers: Record<string, number>
  devices: Record<string, number>
  timeline: { date: string; clicks: number }[]
}

export default function AnalyticsPage({ params }: { params: any }) {
  const router = useRouter()
  const { alias } = React.use(params as any) as { alias: string }
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    // Check if user is authenticated - no need to check for window in useEffect
    if (!isAuthenticated()) {
      router.push('/auth/login?redirect=analytics')
      return
    }

    fetchAnalytics()
  }, [alias, dateRange, router])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    
    let startDate: Date | undefined
    let endDate = new Date()
    
    // Calculate start date based on selected range
    switch (dateRange) {
      case '7d':
        startDate = subDays(new Date(), 7)
        break
      case '30d':
        startDate = subDays(new Date(), 30)
        break
      case '90d':
        startDate = subDays(new Date(), 90)
        break
      case 'all':
        startDate = undefined
        break
    }
    
    try {
      const data = await getUrlAnalytics(alias, startDate, endDate)
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderPieChart = (data: Record<string, number>, title: string) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0)
    
    return (
      <div>
        <h3 className="font-medium mb-4">{title}</h3>
        <div className="space-y-3">
          {Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .map(([key, value]) => {
              const percentage = total ? (value / total * 100).toFixed(1) : 0
              
              return (
                <div key={key} className="flex items-center">
                  <div className="w-40 truncate">{key}</div>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right pl-2">{percentage}%</div>
                </div>
              )
            })}
        </div>
      </div>
    )
  }

  const renderTimeline = (timeline: { date: string; clicks: number }[]) => {
    if (!timeline.length) return <div className="text-gray-500 text-center p-8">No timeline data available</div>
    
    const maxClicks = Math.max(...timeline.map(item => item.clicks))
    
    return (
      <div className="pt-6">
        <div className="h-[300px] relative">
          <div className="absolute inset-0 flex items-end">
            {timeline.map((item, index) => {
              const height = maxClicks ? (item.clicks / maxClicks * 100) : 0
              
              return (
                <div 
                  key={index} 
                  className="flex-1 flex flex-col items-center group"
                >
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    ></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.clicks} clicks
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="grid grid-cols-7 text-xs text-gray-500 mt-2">
          {timeline.map((item, index) => (
            <div key={index} className="text-center">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">URL Analytics</h1>
            <p className="text-gray-600 mt-1">Statistics for: {alias}</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-20">
            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
          </div>
        ) : !analytics ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-4">No analytics data available</h3>
            <p className="text-gray-500 mb-8">There might not be any clicks on this URL yet.</p>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-medium">Performance Overview</h2>
              </div>
              
              <div className="w-full md:w-auto">
                <Select
                  value={dateRange}
                  onValueChange={setDateRange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.totalClicks}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Unique Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.uniqueVisitors}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analytics.uniqueVisitors 
                      ? Math.min(((analytics.totalClicks / analytics.uniqueVisitors) * 100), 100).toFixed(1) + '%' 
                      : '0%'}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="referrers">Referrers</TabsTrigger>
                <TabsTrigger value="browsers">Browsers</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
              </TabsList>
              
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <TabsContent value="overview" className="mt-0">
                    <h3 className="font-medium mb-4">Clicks Over Time</h3>
                    {renderTimeline(analytics.timeline)}
                  </TabsContent>
                  
                  <TabsContent value="referrers" className="mt-0">
                    {renderPieChart(analytics.referrers, 'Traffic Sources')}
                  </TabsContent>
                  
                  <TabsContent value="browsers" className="mt-0">
                    {renderPieChart(analytics.browsers, 'Browser Distribution')}
                  </TabsContent>
                  
                  <TabsContent value="devices" className="mt-0">
                    {renderPieChart(analytics.devices, 'Device Types')}
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </>
        )}
      </main>
    </div>
  )
}
