"use client"

import { useEffect, useRef, useState } from "react"

export function Hero3D() {
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        setMousePosition({ x, y })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      return () => container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 flex items-center justify-center overflow-hidden"
      style={{
        perspective: "1000px",
      }}
    >
      {/* 3D Floating Cards */}
      <div className="relative w-full h-full">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl"
            style={{
              left: `${20 + (i % 4) * 20}%`,
              top: `${30 + Math.floor(i / 4) * 40}%`,
              transform: `
                rotateX(${mousePosition.y * 20 + Math.sin(Date.now() * 0.001 + i) * 10}deg)
                rotateY(${mousePosition.x * 20 + Math.cos(Date.now() * 0.001 + i) * 10}deg)
                translateZ(${Math.sin(Date.now() * 0.002 + i) * 50}px)
              `,
              transformStyle: "preserve-3d",
              transition: "transform 0.1s ease-out",
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg opacity-60" />
            </div>
          </div>
        ))}

        {/* Central 3D Logo */}
        <div
          className="absolute left-1/2 top-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: `
              translate(-50%, -50%)
              rotateX(${mousePosition.y * 30}deg)
              rotateY(${mousePosition.x * 30}deg)
              translateZ(100px)
            `,
            transformStyle: "preserve-3d",
            transition: "transform 0.2s ease-out",
          }}
        >
          <div className="relative w-full h-full">
            {/* 3D Cube faces */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform translateZ-16 shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotateY-90 translateZ-16 shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl transform rotateY-180 translateZ-16 shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotateY-270 translateZ-16 shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-800 rounded-2xl transform rotateX-90 translateZ-16 shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl transform rotateX-270 translateZ-16 shadow-2xl" />

            {/* Logo content */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold z-10">
              ⚡
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
