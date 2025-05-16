// components/TooltipWrapper.tsx
"use client"
import React, { useState } from "react"

interface TooltipWrapperProps {
  label: string
  children: React.ReactNode
}

const TooltipWrapper = ({ label, children }: TooltipWrapperProps) => {
  const [visible, setVisible] = useState(false)
  let timeout: NodeJS.Timeout

  const handleMouseEnter = () => {
    timeout = setTimeout(() => setVisible(true), 500)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeout)
    setVisible(false)
  }

  return (
    <div
      className="relative group inline"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-red-600 text-white rounded-md shadow-md opacity-0 animate-elastic-in whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  )
}

export default TooltipWrapper
