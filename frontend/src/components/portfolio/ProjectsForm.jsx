"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useState } from "react"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Plus, X, ExternalLink, Github, Calendar, Users, Trash2 } from "lucide-react"

export function ProjectsForm({ data, updateData, extractedFields, isReviewMode = false }) {
  const [newTechStack, setNewTechStack] = useState("")
  const [activeProjectIndex, setActiveProjectIndex] = useState(null)

  const projects = data.projects || []

  const addProject = () => {
    const newProject = {
      name: "",
      description: "",
      techStack: [],
      liveLink: "",
      githubRepo: "",
      screenshots: [],
      role: "",
      timeline: "",
      isExtracted: false,
    }
    updateData("projects", [...projects, newProject])
    setActiveProjectIndex(projects.length)
  }

  const updateProject = (index, field, value) => {
    const updatedProjects = [...projects]
    updatedProjects[index] = { ...updatedProjects[index], [field]: value }
    updateData("projects", updatedProjects)
  }

  const removeProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index)
    updateData("projects", updatedProjects)
    if (activeProjectIndex === index) {
      setActiveProjectIndex(null)
    }
  }

  const addTechToProject = (projectIndex, tech) => {
    if (!tech.trim()) return

    const project = projects[projectIndex]
    const currentTechStack = project.techStack || []

    if (!currentTechStack.includes(tech.trim())) {
      updateProject(projectIndex, "techStack", [...currentTechStack, tech.trim()])
    }
    setNewTechStack("")
  }

  const removeTechFromProject = (projectIndex, techToRemove) => {
    const project = projects[projectIndex]
    const updatedTechStack = (project.techStack || []).filter((tech) => tech !== techToRemove)
    updateProject(projectIndex, "techStack", updatedTechStack)
  }

  const handleKeyPress = (e, projectIndex) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTechToProject(projectIndex, newTechStack)
    }
  }

  const isExtracted = (field) => extractedFields?.has(field)

  return (
    <div className="space-y-6">
      {!isReviewMode && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Projects</h2>
          <p className="text-gray-600">Showcase your best work and projects</p>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project, index) => (
          <Card key={index} className={project.isExtracted ? "border-blue-300 bg-blue-50" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>Project {index + 1}</span>
                  {project.isExtracted && (
                    <Badge variant="secondary" className="text-xs">
                      AI Extracted
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor={`project-name-${index}`}>
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`project-name-${index}`}
                  placeholder="e.g., E-commerce Platform"
                  value={project.name}
                  onChange={(e) => updateProject(index, "name", e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor={`project-description-${index}`}>
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`project-description-${index}`}
                  placeholder="Describe what the project does, the problem it solves, and your role in it..."
                  value={project.description}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Tech Stack */}
              <div className="space-y-2">
                <Label>
                  Tech Stack <span className="text-red-500">*</span>
                </Label>

                {/* Current Tech Stack */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.techStack.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="flex items-center space-x-1">
                        <span>{tech}</span>
                        <button
                          onClick={() => removeTechFromProject(index, tech)}
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
                    placeholder="e.g., React, Node.js, MongoDB"
                    value={activeProjectIndex === index ? newTechStack : ""}
                    onChange={(e) => {
                      setActiveProjectIndex(index)
                      setNewTechStack(e.target.value)
                    }}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                  <Button
                    type="button"
                    onClick={() => addTechToProject(index, newTechStack)}
                    disabled={!newTechStack.trim() || activeProjectIndex !== index}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Links Row */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Live Link */}
                <div className="space-y-2">
                  <Label htmlFor={`project-live-${index}`}>Live Link</Label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`project-live-${index}`}
                      type="url"
                      placeholder="https://myproject.com"
                      value={project.liveLink}
                      onChange={(e) => updateProject(index, "liveLink", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* GitHub Repo */}
                <div className="space-y-2">
                  <Label htmlFor={`project-github-${index}`}>
                    GitHub Repository <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`project-github-${index}`}
                      type="url"
                      placeholder="https://github.com/username/project"
                      value={project.githubRepo}
                      onChange={(e) => updateProject(index, "githubRepo", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info Row */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor={`project-role-${index}`}>Your Role</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`project-role-${index}`}
                      placeholder="e.g., Full-stack Developer, Team Lead"
                      value={project.role}
                      onChange={(e) => updateProject(index, "role", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <Label htmlFor={`project-timeline-${index}`}>Timeline</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`project-timeline-${index}`}
                      placeholder="e.g., Jan 2023 - Mar 2023"
                      value={project.timeline}
                      onChange={(e) => updateProject(index, "timeline", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Project Button */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-8">
            <Button
              onClick={addProject}
              variant="ghost"
              className="w-full h-full flex flex-col items-center space-y-2 text-gray-600 hover:text-blue-600"
            >
              <Plus className="w-8 h-8" />
              <span>Add New Project</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Minimum Requirement Notice */}
      {projects.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Required:</strong> You need at least one project to create your portfolio. Click "Add New Project"
              to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Projects Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h3 className="font-medium text-green-900 mb-2">💡 Project Tips</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Focus on projects that demonstrate your skills</li>
            <li>• Include both personal and professional projects</li>
            <li>• Explain the problem your project solves</li>
            <li>• Mention your specific contributions in team projects</li>
            <li>• Include live links when possible</li>
          </ul>
        </CardContent>
      </Card>

      {isReviewMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Projects highlighted in blue were automatically extracted from your resume. You can
              edit, add, or remove any projects above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
