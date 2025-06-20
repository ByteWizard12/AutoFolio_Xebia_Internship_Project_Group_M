"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export function DashboardStats3D({ stats }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative"
          style={{ perspective: "1000px" }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Card
            className="relative transition-all duration-300 ease-out cursor-pointer overflow-hidden"
            style={{
              transform:
                hoveredIndex === index
                  ? "rotateX(5deg) rotateY(5deg) translateZ(20px)"
                  : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Animated background */}
            <div
              className={`absolute inset-0 opacity-10 transition-opacity duration-300 ${
                hoveredIndex === index ? "opacity-20" : "opacity-10"
              }`}
              style={{
                background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}44)`,
              }}
            />

            {/* 3D floating elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 rounded-full opacity-20"
                  style={{
                    background: stat.color,
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`,
                    transform:
                      hoveredIndex === index
                        ? `translateZ(${10 + i * 5}px) translateY(-${i * 2}px)`
                        : "translateZ(0px) translateY(0px)",
                    transition: "transform 0.3s ease-out",
                  }}
                />
              ))}
            </div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}33, ${stat.color}66)`,
                  transform: hoveredIndex === index ? "translateZ(10px)" : "translateZ(0px)",
                  transition: "transform 0.3s ease-out",
                }}
              >
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: stat.color }} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div
                className="text-2xl font-bold transition-transform duration-300"
                style={{
                  transform: hoveredIndex === index ? "translateZ(5px)" : "translateZ(0px)",
                }}
              >
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>

            {/* 3D depth shadow */}
            <div
              className="absolute inset-0 rounded-lg shadow-lg opacity-30"
              style={{
                transform: "translateZ(-5px)",
                background: `linear-gradient(135deg, ${stat.color}11, ${stat.color}22)`,
              }}
            />
          </Card>
        </div>
      ))}
    </div>
  )
}
