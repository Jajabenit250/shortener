'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function FixedButtons() {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <>
      {/* Start Now Fixed Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-[#ff5c00] text-white rounded-full p-2 shadow-lg flex items-center">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center mr-2">
            <svg className="w-5 h-5 text-[#ff5c00]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
              <path d="M12 15l1.57-3.43L17 10l-3.43-1.57L12 5l-1.57 3.43L7 10l3.43 1.57z" />
            </svg>
          </div>
          <span className="font-medium mr-2">Start now:</span>
          <div className="flex space-x-2">
            <Link href="/#url-shortener" className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#ff5c00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </Link>
            <Link href="/#qr-code" className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#ff5c00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 3H6a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2z" />
                <path d="M18 3h-4a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2z" />
                <path d="M10 13H6a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2z" />
                <path d="M14 15l2 2m0 0l2 2m-2-2l2-2m-2 2l-2 2" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Accessibility Button */}
      <TooltipProvider>
        <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
          <TooltipTrigger asChild>
            <button 
              className="fixed bottom-8 left-8 z-50 w-10 h-10 bg-[#0066ff] text-white rounded-full flex items-center justify-center shadow-lg focus:outline-none" 
              aria-label="Accessibility Options"
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Accessibility options</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
