"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Plus, X, Code, Users, Wrench } from "lucide-react"

export function SkillsForm({ data, updateData, extractedFields, isReviewMode = false }) {
  const [newTechnicalSkill, setNewTechnicalSkill] = useState("")
  const [newSoftSkill, setNewSoftSkill] = useState("")
  const [newTool, setNewTool] = useState("")

  const handleAddSkill = (type, skill) => {
    if (!skill.trim()) return

    const currentSkills = data[type] || []
    if (!currentSkills.includes(skill.trim())) {
      updateData(type, [...currentSkills, skill.trim()])
    }

    // Clear input
    if (type === "technicalSkills") setNewTechnicalSkill("")
    if (type === "softSkills") setNewSoftSkill("")
    if (type === "toolsAndTech") setNewTool("")
  }

  const handleRemoveSkill = (type, skillToRemove) => {
    const currentSkills = data[type] || []
    updateData(
      type,
      currentSkills.filter((skill) => skill !== skillToRemove),
    )
  }

  const handleKeyPress = (e, type, skill) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSkill(type, skill)
    }
  }

  const isExtracted = (field) => extractedFields?.has(field)

  const skillCategories = [
    {
      key: "technicalSkills",
      title: "Technical Skills",
      icon: Code,
      placeholder: "e.g., JavaScript, React, Python, AWS",
      description: "Programming languages, frameworks, databases, etc.",
      required: true,
      newSkill: newTechnicalSkill,
      setNewSkill: setNewTechnicalSkill,
      suggestions: ["JavaScript", "Python", "React", "Node.js", "SQL", "AWS", "Docker", "Git"],
    },
    {
      key: "softSkills",
      title: "Soft Skills",
      icon: Users,
      placeholder: "e.g., Leadership, Communication, Problem Solving",
      description: "Personal and interpersonal skills",
      required: false,
      newSkill: newSoftSkill,
      setNewSkill: setNewSoftSkill,
      suggestions: ["Leadership", "Communication", "Problem Solving", "Team Work", "Time Management", "Adaptability"],
    },
    {
      key: "toolsAndTech",
      title: "Tools & Technologies",
      icon: Wrench,
      placeholder: "e.g., VS Code, Figma, Jira, Slack",
      description: "Development tools, design software, project management tools",
      required: false,
      newSkill: newTool,
      setNewSkill: setNewTool,
      suggestions: ["VS Code", "Figma", "Jira", "Slack", "Postman", "GitHub", "Notion", "Trello"],
    },
  ]

  return (
    <div className="space-y-6">
      {!isReviewMode && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Skills & Expertise</h2>
          <p className="text-gray-600">Showcase your technical and soft skills</p>
        </div>
      )}

      {skillCategories.map((category) => {
        const IconComponent = category.icon
        const skills = data[category.key] || []

        return (
          <Card key={category.key}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <IconComponent className="w-5 h-5" />
                <span>
                  {category.title}
                  {category.required && <span className="text-red-500 ml-1">*</span>}
                </span>
                {isExtracted(category.key) && (
                  <Badge variant="secondary" className="text-xs">
                    AI Extracted
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600">{category.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Skills */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={`flex items-center space-x-1 ${
                        isExtracted(category.key) ? "bg-blue-100 text-blue-800 border-blue-300" : ""
                      }`}
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(category.key, skill)}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add New Skill */}
              <div className="flex space-x-2">
                <Input
                  placeholder={category.placeholder}
                  value={category.newSkill}
                  onChange={(e) => category.setNewSkill(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, category.key, category.newSkill)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => handleAddSkill(category.key, category.newSkill)}
                  disabled={!category.newSkill.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Skill Suggestions */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {category.suggestions
                    .filter((suggestion) => !skills.includes(suggestion))
                    .map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSkill(category.key, suggestion)}
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Skills Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h3 className="font-medium text-green-900 mb-2">💡 Skills Tips</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Focus on skills relevant to your target role</li>
            <li>• Include both technical skills and soft skills</li>
            <li>• Be honest about your skill levels</li>
            <li>• Keep the list concise and impactful</li>
          </ul>
        </CardContent>
      </Card>

      {isReviewMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Skills highlighted in blue were automatically extracted from your resume. You can
              add, remove, or modify any skills above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
