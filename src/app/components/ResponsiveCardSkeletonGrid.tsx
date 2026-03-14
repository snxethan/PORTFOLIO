import React from "react"

interface ResponsiveCardSkeletonGridProps {
  renderCard: (index: number) => React.ReactNode
  className?: string
}

const slotVisibility = ["", "hidden sm:block", "hidden xl:block"]

const ResponsiveCardSkeletonGrid = ({ renderCard, className = "" }: ResponsiveCardSkeletonGridProps) => {
  return (
    <div className={`w-full ${className}`.trim()} aria-hidden="true">
      <div className="grid grid-cols-1 gap-6 px-3 py-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className={slotVisibility[index]}>
            {renderCard(index)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResponsiveCardSkeletonGrid

