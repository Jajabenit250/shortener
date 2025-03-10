import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster";
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'URL Shortener - Create short, memorable links',
  description: 'Create and share short links, QR codes, and track clicks with our powerful URL shortening platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
          {children}
          <Toaster />
      </body>
    </html>
  )
}
