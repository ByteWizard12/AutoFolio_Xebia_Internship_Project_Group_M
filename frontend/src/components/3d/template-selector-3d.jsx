"use client"

import { useState } from "react"

export function TemplateSelector3D({ templates, selectedTemplate, onSelect }) {
  const [hoveredTemplate, setHoveredTemplate] = useState(null)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {templates.map((template, index) => (
        <div
          key={template.id}
          className="relative cursor-pointer"
          style={{ perspective: "800px" }}
          onMouseEnter={() => setHoveredTemplate(template.id)}
          onMouseLeave={() => setHoveredTemplate(null)}
          onClick={() => onSelect(template.id)}
        >
          <div
            className={`relative border-2 rounded-lg p-4 transition-all duration-300 ease-out ${
              selectedTemplate === template.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
            style={{
              transform:
                hoveredTemplate === template.id
                  ? "rotateX(5deg) rotateY(5deg) translateZ(20px)"
                  : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* 3D Preview Container */}
            <div
              className="aspect-video rounded mb-3 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${template.color}22, ${template.color}44)`,
                transform: hoveredTemplate === template.id ? "translateZ(10px)" : "translateZ(0px)",
                transition: "transform 0.3s ease-out",
              }}
            >
              {/* Animated preview elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Header bar */}
                  <div
                    className="absolute top-2 left-2 right-2 h-2 rounded-full opacity-60"
                    style={{
                      backgroundColor: template.color,
                      transform: hoveredTemplate === template.id ? "translateZ(5px)" : "translateZ(0px)",
                      transition: "transform 0.3s ease-out",
                    }}
                  />

                  {/* Content blocks */}
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded opacity-40"
                      style={{
                        backgroundColor: template.color,
                        left: "10%",
                        width: "80%",
                        height: "8px",
                        top: `${30 + i * 20}%`,
                        transform:
                          hoveredTemplate === template.id
                            ? `translateZ(${3 + i}px) translateX(${i * 2}px)`
                            : "translateZ(0px) translateX(0px)",
                        transition: "transform 0.3s ease-out",
                      }}
                    />
                  ))}

                  {/* Floating elements */}
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full opacity-50"
                      style={{
                        backgroundColor: template.color,
                        left: `${20 + (i % 2) * 60}%`,
                        top: `${20 + Math.floor(i / 2) * 60}%`,
                        transform:
                          hoveredTemplate === template.id
                            ? `translateZ(${8 + i * 2}px) rotate(${i * 90}deg)`
                            : "translateZ(0px) rotate(0deg)",
                        transition: "transform 0.3s ease-out",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded transition-opacity duration-300 ${
                  hoveredTemplate === template.id ? "opacity-30" : "opacity-0"
                }`}
                style={{
                  background: `radial-gradient(circle at center, ${template.color}44, transparent)`,
                  transform: "translateZ(-5px)",
                }}
              />
            </div>

            {/* Template info */}
            <div
              style={{
                transform: hoveredTemplate === template.id ? "translateZ(5px)" : "translateZ(0px)",
                transition: "transform 0.3s ease-out",
              }}
            >
              <h3 className="font-semibold mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>

            {/* Selection indicator */}
            {selectedTemplate === template.id && (
              <div
                className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                style={{
                  transform: "translateZ(15px)",
                }}
              >
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            )}

            {/* 3D depth layers */}
            <div
              className="absolute inset-0 rounded-lg shadow-lg opacity-20"
              style={{
                transform: "translateZ(-5px)",
                background: `linear-gradient(135deg, ${template.color}11, ${template.color}22)`,
              }}
            />
            <div
              className="absolute inset-0 rounded-lg shadow-md opacity-10"
              style={{
                transform: "translateZ(-10px)",
                background: `linear-gradient(135deg, ${template.color}08, ${template.color}15)`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
