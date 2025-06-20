"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "../ui/card"

export function PortfolioPreview3D({ portfolioData }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isInteracting, setIsInteracting] = useState(false)
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!containerRef.current || !isInteracting) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height

    setRotation({
      x: y * 20,
      y: x * 20,
    })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setIsInteracting(false)
  }

  const handleMouseEnter = () => {
    setIsInteracting(true)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={{ perspective: "1200px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* 3D Portfolio Container */}
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main Portfolio Surface */}
        <Card
          className="relative w-full h-full bg-white shadow-2xl"
          style={{
            transform: "translateZ(0px)",
            transformStyle: "preserve-3d",
          }}
        >
          <CardContent className="p-6 h-full overflow-auto">
            {/* Portfolio content with 3D layers */}
            <div className="space-y-6">
              {/* Header with 3D effect */}
              <div
                className="text-center border-b pb-6 relative"
                style={{
                  transform: "translateZ(20px)",
                }}
              >
                <div
                  className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                  style={{
                    transform: "translateZ(30px)",
                  }}
                >
                  <span className="text-white text-2xl font-bold">{portfolioData.name?.charAt(0) || "U"}</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{portfolioData.name}</h1>
                <p className="text-xl text-gray-600">{portfolioData.title}</p>
              </div>

              {/* Floating sections */}
              <div
                className="space-y-4"
                style={{
                  transform: "translateZ(10px)",
                }}
              >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-2">About Me</h2>
                  <p className="text-gray-700">{portfolioData.bio}</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {portfolioData.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white rounded-full text-sm shadow-sm"
                        style={{
                          transform: `translateZ(${5 + index * 2}px)`,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3D Depth Layers */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg shadow-xl"
          style={{
            transform: "translateZ(-10px)",
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg shadow-lg"
          style={{
            transform: "translateZ(-20px)",
          }}
        />

        {/* Floating particles around the portfolio */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
            style={{
              left: `${10 + (i % 3) * 30}%`,
              top: `${20 + Math.floor(i / 3) * 60}%`,
              transform: `
                translateZ(${50 + i * 10}px)
                translateX(${Math.sin(Date.now() * 0.001 + i) * 20}px)
                translateY(${Math.cos(Date.now() * 0.001 + i) * 20}px)
              `,
              animation: `float-${i} 3s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Interactive hint */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 opacity-50">Move mouse to interact</div>
    </div>
  )
}
