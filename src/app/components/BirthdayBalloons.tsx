"use client"

import { useEffect, useState } from "react"

const BirthdayBalloons = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger the animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Array of balloon colors and their hex equivalents for confetti
  const balloonColors = [
    { class: "bg-red-500", hex: "#ef4444" },
    { class: "bg-blue-500", hex: "#3b82f6" }, 
    { class: "bg-yellow-500", hex: "#eab308" },
    { class: "bg-green-500", hex: "#22c55e" },
    { class: "bg-purple-500", hex: "#a855f7" },
    { class: "bg-pink-500", hex: "#ec4899" },
    { class: "bg-orange-500", hex: "#f97316" },
    { class: "bg-indigo-500", hex: "#6366f1" }
  ]

  const createBalloon = (index: number) => {
    const color = balloonColors[index % balloonColors.length]
    const delay = index * 200 // Staggered animation
    const leftPosition = 10 + (index * 10) % 80 // Spread across screen
    
    return (
      <div
        key={index}
        className={`absolute bottom-0 transition-all duration-[3000ms] ease-out ${
          isVisible ? '-translate-y-[100vh]' : 'translate-y-0'
        }`}
        style={{ 
          left: `${leftPosition}%`,
          transitionDelay: `${delay}ms`,
          animationDelay: `${delay}ms`
        }}
      >
        {/* Balloon */}
        <div className={`w-12 h-16 ${color.class} rounded-full relative shadow-lg animate-pulse`}>
          {/* Balloon highlight */}
          <div className="absolute top-2 left-2 w-3 h-4 bg-white opacity-30 rounded-full"></div>
          
          {/* String */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-20 bg-gray-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Birthday message */}
      <div className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}>
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-2xl animate-bounce">
          🎉 Happy Birthday! 🎂
        </div>
      </div>

      {/* Balloons */}
      {Array.from({ length: 8 }, (_, index) => createBalloon(index))}
      
      {/* Confetti effect */}
      <div className={`absolute inset-0 transition-opacity duration-2000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {Array.from({ length: 50 }, (_, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: balloonColors[index % balloonColors.length].hex,
              animationDelay: `${Math.random() * 3000}ms`,
              animationDuration: `${2000 + Math.random() * 2000}ms`
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default BirthdayBalloons