"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { Plus, X, GraduationCap, Calendar, Trash2, BookOpen } from "lucide-react"
import { useState } from "react"

export function EducationForm({ data, updateData, extractedFields, isReviewMode = false }) {
  const [newCourse, setNewCourse] = useState("")
  const [activeEducationIndex, setActiveEducationIndex] = useState(null)

  const education = data.education || []

  const addEducation = () => {
    const newEducation = {
      degree: "",
      institution: "",
      duration: "",
      cgpa: "",
      relevantCourses: [],
      isExtracted: false,
    }
    updateData("education", [...education, newEducation])
    setActiveEducationIndex(education.length)
  }

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    updateData("education", updatedEducation)
  }

  const removeEducation = (index) => {
    const updatedEducation = education.filter((_, i) => i !== index)
    updateData("education", updatedEducation)
    if (activeEducationIndex === index) {
      setActiveEducationIndex(null)
    }
  }

  const addCourseToEducation = (educationIndex, course) => {
    if (!course.trim()) return

    const edu = education[educationIndex]
    const currentCourses = edu.relevantCourses || []

    if (!currentCourses.includes(course.trim())) {
      updateEducation(educationIndex, "relevantCourses", [...currentCourses, course.trim()])
    }
    setNewCourse("")
  }

  const removeCourseFromEducation = (educationIndex, courseToRemove) => {
    const edu = education[educationIndex]
    const updatedCourses = (edu.relevantCourses || []).filter((course) => course !== courseToRemove)
    updateEducation(educationIndex, "relevantCourses", updatedCourses)
  }

  const handleKeyPress = (e, educationIndex) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addCourseToEducation(educationIndex, newCourse)
    }
  }

  const isExtracted = (field) => extractedFields?.has(field)

  return (
    <div className="space-y-6">
      {!isReviewMode && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Education</h2>
          <p className="text-gray-600">Share your educational background</p>
        </div>
      )}

      {/* Education List */}
      <div className="space-y-4">
        {education.map((edu, index) => (
          <Card key={index} className={edu.isExtracted ? "border-blue-300 bg-blue-50" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Education {index + 1}</span>
                  {edu.isExtracted && (
                    <Badge variant="secondary" className="text-xs">
                      AI Extracted
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Degree and Institution */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`degree-${index}`}>
                    Degree/Program <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`degree-${index}`}
                    placeholder="e.g., Bachelor of Science in Computer Science"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`institution-${index}`}>
                    Institution Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`institution-${index}`}
                    placeholder="e.g., University of California, Berkeley"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                  />
                </div>
              </div>

              {/* Duration and CGPA */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`edu-duration-${index}`}>
                    Duration <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`edu-duration-${index}`}
                      placeholder="e.g., 2016 - 2020 or Sep 2016 - May 2020"
                      value={edu.duration}
                      onChange={(e) => updateEducation(index, "duration", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`cgpa-${index}`}>CGPA/Percentage</Label>
                  <Input
                    id={`cgpa-${index}`}
                    placeholder="e.g., 3.8/4.0 or 85%"
                    value={edu.cgpa}
                    onChange={(e) => updateEducation(index, "cgpa", e.target.value)}
                  />
                </div>
              </div>

              {/* Relevant Courses */}
              <div className="space-y-2">
                <Label>Relevant Courses</Label>

                {/* Current Courses */}
                {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {edu.relevantCourses.map((course, courseIndex) => (
                      <Badge key={courseIndex} variant="secondary" className="flex items-center space-x-1">
                        <span>{course}</span>
                        <button
                          onClick={() => removeCourseFromEducation(index, course)}
                          className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add Course */}
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="e.g., Data Structures, Machine Learning"
                      value={activeEducationIndex === index ? newCourse : ""}
                      onChange={(e) => {
                        setActiveEducationIndex(index)
                        setNewCourse(e.target.value)
                      }}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => addCourseToEducation(index, newCourse)}
                    disabled={!newCourse.trim() || activeEducationIndex !== index}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Add courses that are relevant to your career goals</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Education Button */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-8">
            <Button
              onClick={addEducation}
              variant="ghost"
              className="w-full h-full flex flex-col items-center space-y-2 text-gray-600 hover:text-blue-600"
            >
              <Plus className="w-8 h-8" />
              <span>Add Education</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Minimum Requirement Notice */}
      {education.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Required:</strong> You need at least one education entry to create your portfolio. Click "Add
              Education" to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Education Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h3 className="font-medium text-green-900 mb-2">💡 Education Tips</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• List your most recent/highest education first</li>
            <li>• Include relevant coursework that relates to your career</li>
            <li>• CGPA/Percentage is optional but can be helpful</li>
            <li>• Include certifications, bootcamps, or online courses</li>
            <li>• Mention any academic achievements or honors</li>
          </ul>
        </CardContent>
      </Card>

      {isReviewMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Education highlighted in blue was automatically extracted from your resume. You can
              edit, add, or remove any education above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
