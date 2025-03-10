'use client'

import { ReactNode } from 'react'

interface NavDropdownProps {
  title: string
  id: string
  active: boolean
  children: ReactNode
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function NavDropdown({
  title,
  id,
  active,
  children,
  onMouseEnter,
  onMouseLeave
}: NavDropdownProps) {
  return (
    <div
      className="relative group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button className="flex items-center space-x-1 text-[#0b1736] hover:text-[#ff5c00] py-5">
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transition-transform ${active ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {active && (
        <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-md p-4 md:p-6 w-[95vw] max-w-[1200px] z-10 max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  )
}
