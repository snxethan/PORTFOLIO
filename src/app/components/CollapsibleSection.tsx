"use client"

import { useState, useRef, useEffect } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

interface CollapsibleSectionProps {
  id: string
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  title,
  children,
  defaultExpanded = true,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [height, setHeight] = useState<number | undefined>(defaultExpanded ? undefined : 0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        setHeight(contentRef.current.scrollHeight)
        // After transition, remove height constraint to allow dynamic content
        const timer = setTimeout(() => setHeight(undefined), 300)
        return () => clearTimeout(timer)
      } else {
        setHeight(contentRef.current.scrollHeight)
        // Force reflow before setting to 0
        requestAnimationFrame(() => {
          setHeight(0)
        })
      }
    }
  }, [isExpanded])

  return (
    <div id={id} className={`mb-8 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-6 group cursor-pointer"
        aria-expanded={isExpanded}
        aria-controls={`${id}-content`}
      >
        <div className="flex flex-col items-center w-full">
          <h2 className="text-3xl font-bold text-white group-hover:text-red-500 transition-colors duration-300">
            {title}
          </h2>
          <span className="w-64 h-1 mt-2 bg-gradient-to-r from-red-600 to-red-500"></span>
        </div>
        <div className="ml-4 text-red-500 group-hover:text-red-400 transition-colors duration-300">
          {isExpanded ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
        </div>
      </button>
      
      <div
        id={`${id}-content`}
        ref={contentRef}
        style={{ height: height }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        {children}
      </div>
    </div>
  )
}

export default CollapsibleSection
