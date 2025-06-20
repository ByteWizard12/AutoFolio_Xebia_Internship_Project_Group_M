"use client"

import { useEffect, useRef } from "react"

export function FloatingShapes() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 3D-like floating shapes
    const shapes = []

    // Create shapes
    for (let i = 0; i < 15; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 30 + 10,
        color: `hsl(${220 + Math.random() * 60}, 70%, ${60 + Math.random() * 20}%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      shapes.forEach((shape) => {
        // Update position
        shape.x += shape.vx
        shape.y += shape.vy
        shape.z += shape.vz
        shape.rotation += shape.rotationSpeed

        // Wrap around edges
        if (shape.x < -50) shape.x = canvas.width + 50
        if (shape.x > canvas.width + 50) shape.x = -50
        if (shape.y < -50) shape.y = canvas.height + 50
        if (shape.y > canvas.height + 50) shape.y = -50
        if (shape.z < 0) shape.z = 100
        if (shape.z > 100) shape.z = 0

        // 3D perspective effect
        const scale = 1 + shape.z / 100
        const opacity = 0.1 + (shape.z / 100) * 0.3

        ctx.save()
        ctx.translate(shape.x, shape.y)
        ctx.rotate(shape.rotation)
        ctx.scale(scale, scale)

        // Draw 3D-like shape
        ctx.fillStyle = shape.color.replace(")", `, ${opacity})`)
        ctx.strokeStyle = shape.color.replace(")", `, ${opacity * 2})`)
        ctx.lineWidth = 2

        // Draw hexagon
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3
          const x = Math.cos(angle) * shape.size
          const y = Math.sin(angle) * shape.size
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}
