"use client"

import { useState, useRef } from "react"

export function InteractiveCard3D({ children, className = "" }) {
  const [transform, setTransform] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 4
    const rotateY = (centerX - x) / 4

    setTransform(`
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(20px)
    `)
  }

  const handleMouseLeave = () => {
    setTransform("")
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <div
      ref={cardRef}
      className={`relative transition-all duration-200 ease-out ${className}`}
      style={{
        transform,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "translateZ(-10px)" }}
      />

      {/* Card content */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl">
        {children}
      </div>

      {/* 3D depth layers */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg"
        style={{ transform: "translateZ(-5px)" }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg"
        style={{ transform: "translateZ(-10px)" }}
      />
    </div>
  )
}
