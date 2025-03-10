'use client'

import ShortenerForm from '@/components/shortener/ShortenerForm'

export default function HeroSection() {
  return (
    <section className="bg-[#001833] text-white py-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-16 w-8 h-8 text-[#0a2547] opacity-40">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2Z" />
          </svg>
        </div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 text-[#0a2547] opacity-40">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2Z" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-1/5 w-16 h-16 text-[#0a2547] opacity-40">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2Z" />
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Build stronger digital connections
        </h1>
        <p className="text-xl max-w-4xl mx-auto mb-8">
          Use our URL shortener, QR Codes, and landing pages to engage your audience and connect them to the right information. Build, edit, and track everything inside our URL Shortener platform.
        </p>
        
        {/* URL Shortener Form */}
        <ShortenerForm />
      </div>
    </section>
  )
}
