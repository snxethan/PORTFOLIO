"use client"

import { useEffect, useState } from "react"

interface BirthdayCelebrationProps {
  onComplete?: () => void
}

const BirthdayCelebration: React.FC<BirthdayCelebrationProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-hide the celebration after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) {
    return null
  }

  // Generate balloon elements - start after confetti (1.5 second delay + small stagger)
  const balloons = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][i],
    delay: 1.5 + (i * 0.2), // Start after confetti with small stagger
    left: 10 + (i * 15) + Math.random() * 10,
  }))

  // Generate confetti elements - start immediately with small random delays
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][i % 6],
    delay: Math.random() * 0.5, // Much smaller delay range for quicker start
    left: Math.random() * 100,
    size: 4 + Math.random() * 6,
  }))

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 animate-celebration-fade-out"
      style={{ zIndex: 9999 }}
    >
      {/* Balloons */}
      {balloons.map((balloon) => (
        <div
          key={`balloon-${balloon.id}`}
          className="absolute animate-balloon-float"
          style={{
            left: `${balloon.left}%`,
            animationDelay: `${balloon.delay}s`,
            bottom: '0px',
          }}
        >
          <div className="relative">
            {/* Balloon */}
            <div
              className="w-8 h-10 rounded-full shadow-lg"
              style={{
                backgroundColor: balloon.color,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              }}
            />
            {/* String */}
            <div
              className="absolute top-full left-1/2 w-0.5 h-12 opacity-60"
              style={{
                backgroundColor: balloon.color,
                transform: 'translateX(-50%)',
              }}
            />
          </div>
        </div>
      ))}

      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={`confetti-${piece.id}`}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            top: '-10vh',
          }}
        >
          <div
            className="rounded-sm"
            style={{
              backgroundColor: piece.color,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default BirthdayCelebration