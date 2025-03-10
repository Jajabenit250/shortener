import Link from 'next/link'

export default function AnnouncementBar() {
  return (
    <div className="bg-[#002240] text-white text-center py-2 px-4 text-sm">
      <span className="inline-flex items-center">
        <span className="bg-blue-900 text-white px-2 py-0.5 text-xs font-bold rounded mr-2">NEW</span>
        Try our new URL shortener with enhanced analytics! 
        <Link href="/features" className="underline mx-1 font-semibold">
          Learn more
        </Link> 
        today.
      </span>
    </div>
  )
}
