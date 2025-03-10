'use client'

import AnnouncementBar from '@/components/common/AnnouncementBar'
import Header from '@/components/common/Header'
import HeroSection from '@/components/home/HeroSection'
import FixedButtons from '@/components/common/FixedButtons'
import StatsSection from '@/components/home/StatsSection'

export default function Home() {
  return (
    <div className="font-sans text-[#0b1736]">
      <AnnouncementBar />
      <Header />
      
      {/* Hero Section with URL Shortener */}
      <HeroSection />
      
      {/* Second Section - The URL Shortener Platform */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 text-gray-600 text-lg">
            GREAT CONNECTIONS START WITH A CLICK OR SCAN
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0b1736] mb-6">
            The URL Shortener Platform
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-10">
            All the products you need to build brand connections, manage links and QR Codes, and connect with audiences everywhere, in a single unified platform.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a 
              href="#url-shortener" 
              className="inline-flex items-center bg-[#0066ff] text-white hover:bg-[#0052cc] px-6 py-3 rounded-md font-medium"
            >
              Get started for free
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            
            <a 
              href="/pricing" 
              className="inline-flex items-center border border-[#0066ff] text-[#0066ff] hover:bg-blue-50 px-6 py-3 rounded-md font-medium"
            >
              Get a quote
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
          
          {/* Three Products */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* URL Shortener */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="aspect-w-4 aspect-h-3 mb-8">
                <div className="flex items-center justify-center h-full">
                  <div className="relative w-full max-w-xs">
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-[#ff5c00] rounded flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <div className="flex-1 font-medium">yourbrnd.co/app</div>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-500">564 Engagements</div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-3 absolute bottom-0 right-0 w-48">
                      <div className="text-sm font-medium mb-1">Clicks by location</div>
                      <div className="flex justify-between items-center text-xs">
                        <div>1. Brooklyn</div>
                        <div>36</div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <div>2. San Francisco</div>
                        <div>18</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-[#ff5c00] rounded-md flex items-center justify-center mr-2">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">URL Shortener</h3>
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              
              <p className="text-gray-700 mb-4">
                A comprehensive solution to help make every point of connection between you, your content, and your audience more powerful.
              </p>
            </div>
            
            {/* QR Codes */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="aspect-w-4 aspect-h-3 mb-8">
                <div className="flex items-center justify-center h-full">
                  <div className="relative w-full max-w-xs">
                    <div className="bg-white p-4 rounded-lg shadow-md flex justify-center">
                      <div className="relative">
                        <div className="bg-white p-2 rounded-lg">
                          <div className="w-32 h-32 bg-white">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                              <path fill="#ff5c00" d="M30,30h10v10h-10zM50,30h10v10h-10zM30,50h10v10h-10zM50,50h10v10h-10zM30,70h10v10h-10zM50,70h10v10h-10zM70,30h10v10h-10zM70,50h10v10h-10zM70,70h10v10h-10z" />
                              <rect x="10" y="10" width="80" height="80" fill="none" stroke="#ff5c00" strokeWidth="4" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="absolute -bottom-4 right-0 flex space-x-1">
                          <div className="w-4 h-4 rounded-full bg-black"></div>
                          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                          <div className="w-4 h-4 rounded-full bg-[#ff5c00]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-[#ff5c00] rounded-md flex items-center justify-center mr-2">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 3H6a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2z" />
                    <path d="M18 3h-4a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2z" />
                    <path d="M10 13H6a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2z" />
                    <path d="M14 15l2 2m0 0l2 2m-2-2l2-2m-2 2l-2 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">QR Codes</h3>
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              
              <p className="text-gray-700 mb-4">
                QR Code solutions for every customer, business, and brand experience.
              </p>
            </div>
            
            {/* Analytics */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="aspect-w-4 aspect-h-3 mb-8">
                <div className="flex items-center justify-center h-full">
                  <div className="relative w-full max-w-xs">
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <div className="h-32 flex items-center justify-center">
                        <svg className="w-32 h-32 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M21 21H3V3" />
                          <path d="M21 16H3" />
                          <path d="M21 11H3" />
                          <path d="M21 6H3" />
                          <path d="M7 21V3" />
                          <path d="M12 21V3" />
                          <path d="M17 21V3" />
                          <path d="M3 3L5 5M5 5L7 9M7 9L9 7M9 7L11 13M11 13L13 9M13 9L15 11M15 11L17 5M17 5L19 7M19 7L21 3" 
                            stroke="#0066ff" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-[#ff5c00] rounded-md flex items-center justify-center mr-2">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Analytics</h3>
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              
              <p className="text-gray-700 mb-4">
                Track performance metrics and gain insights into your audience's behavior.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />
      
      {/* Fixed Buttons */}
      <FixedButtons />
    </div>
  )
}
