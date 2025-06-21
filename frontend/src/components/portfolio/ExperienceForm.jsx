"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Plus, X, Building, Calendar, Trash2, Briefcase } from "lucide-react"
import { useState } from "react"

export function ExperienceForm({ data, updateData, extractedFields, isReviewMode = false }) {
  const [newTechStack, setNewTechStack] = useState("")
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(null)

  const experience = data.experience || []

  const addExperience = () => {
    const newExperience = {
      jobTitle: "",
      companyName: "",
      duration: "",
      responsibilities: "",
      techStack: [],
      isExtracted: false,
    }
    updateData("experience", [...experience, newExperience])
    setActiveExperienceIndex(experience.length)
  }

  const updateExperience = (index, field, value) => {
    const updatedExperience = [...experience]
    updatedExperience[index] = { ...updatedExperience[index], [field]: value }
    updateData("experience", updatedExperience)
  }

  const removeExperience = (index) => {
    const updatedExperience = experience.filter((_, i) => i !== index)
    updateData("experience", updatedExperience)
    if (activeExperienceIndex === index) {
      setActiveExperienceIndex(null)
    }
  }

  const addTechToExperience = (experienceIndex, tech) => {
    if (!tech.trim()) return

    const exp = experience[experienceIndex]
    const currentTechStack = exp.techStack || []

    if (!currentTechStack.includes(tech.trim())) {
      updateExperience(experienceIndex, "techStack", [...currentTechStack, tech.trim()])
    }
    setNewTechStack("")
  }

  const removeTechFromExperience = (experienceIndex, techToRemove) => {
    const exp = experience[experienceIndex]
    const updatedTechStack = (exp.techStack || []).filter((tech) => tech !== techToRemove)
    updateExperience(experienceIndex, "techStack", updatedTechStack)
  }

  const handleKeyPress = (e, experienceIndex) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTechToExperience(experienceIndex, newTechStack)
    }
  }

  const isExtracted = (field) => extractedFields?.has(field)

  return (
    <div className="space-y-6">
      {!isReviewMode && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Work Experience</h2>
          <p className="text-gray-600">Share your professional journey</p>
        </div>
      )}

      {/* Experience List */}
      <div className="space-y-4">
        {experience.map((exp, index) => (
          <Card key={index} className={exp.isExtracted ? "border-blue-300 bg-blue-50" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Experience {index + 1}</span>
                  {exp.isExtracted && (
                    <Badge variant="secondary" className="text-xs">
                      AI Extracted
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Job Title and Company */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`job-title-${index}`}>
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`job-title-${index}`}
                    placeholder="e.g., Senior Software Developer"
                    value={exp.jobTitle}
                    onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`company-name-${index}`}>
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`company-name-${index}`}
                      placeholder="e.g., Tech Corp Inc."
                      value={exp.companyName}
                      onChange={(e) => updateExperience(index, "companyName", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor={`duration-${index}`}>
                  Duration <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={`duration-${index}`}
                    placeholder="e.g., Jan 2021 - Present or Jan 2021 - Dec 2022"
                    value={exp.duration}
                    onChange={(e) => updateExperience(index, "duration", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`responsibilities-${index}`}>Responsibilities</Label>
                  <Badge variant="outline" className="text-xs">
                    Can be AI generated
                  </Badge>
                </div>
                <Textarea
                  id={`responsibilities-${index}`}
                  placeholder="Describe your key responsibilities, achievements, and impact in this role..."
                  value={exp.responsibilities}
                  onChange={(e) => updateExperience(index, "responsibilities", e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  Use bullet points or paragraphs to describe your key achievements and responsibilities.
                </p>
              </div>

              {/* Tech Stack */}
              <div className="space-y-2">
                <Label>Technologies Used</Label>

                {/* Current Tech Stack */}
                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {exp.techStack.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="flex items-center space-x-1">
                        <span>{tech}</span>
                        <button
                          onClick={() => removeTechFromExperience(index, tech)}
                          className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add Tech Stack */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="e.g., React, Python, AWS"
                    value={activeExperienceIndex === index ? newTechStack : ""}
                    onChange={(e) => {
                      setActiveExperienceIndex(index)
                      setNewTechStack(e.target.value)
                    }}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                  <Button
                    type="button"
                    onClick={() => addTechToExperience(index, newTechStack)}
                    disabled={!newTechStack.trim() || activeExperienceIndex !== index}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Experience Button */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-8">
            <Button
              onClick={addExperience}
              variant="ghost"
              className="w-full h-full flex flex-col items-center space-y-2 text-gray-600 hover:text-blue-600"
            >
              <Plus className="w-8 h-8" />
              <span>Add Work Experience</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Experience Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h3 className="font-medium text-green-900 mb-2">💡 Experience Tips</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Start with your most recent experience</li>
            <li>• Focus on achievements and impact, not just duties</li>
            <li>• Use action verbs (Led, Developed, Implemented, etc.)</li>
            <li>• Include relevant technologies and tools</li>
            <li>• Quantify your achievements when possible</li>
          </ul>
        </CardContent>
      </Card>

      {isReviewMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Experience highlighted in blue was automatically extracted from your resume. You
              can edit, add, or remove any experience above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
