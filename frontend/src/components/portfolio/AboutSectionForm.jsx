"use client"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Upload, FileText, Target, User } from "lucide-react"

export function AboutSectionForm({ data, updateData, extractedFields, isReviewMode = false }) {
  const handleInputChange = (field, value) => {
    updateData(field, value)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleInputChange("resumeFile", file)
    }
  }

  const isExtracted = (field) => extractedFields?.has(field)

  return (
    <div className="space-y-6">
      {!isReviewMode && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">About Section</h2>
          <p className="text-gray-600">Tell your story and share your goals</p>
        </div>
      )}

      {/* About Me */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="aboutMe">
            About Me <span className="text-red-500">*</span>
          </Label>
          {isExtracted("aboutMe") && (
            <Badge variant="secondary" className="text-xs">
              <User className="w-3 h-3 mr-1" />
              AI Generated
            </Badge>
          )}
        </div>
        <Textarea
          id="aboutMe"
          placeholder="Write a compelling paragraph about yourself, your background, and what drives you as a professional..."
          value={data.aboutMe || ""}
          onChange={(e) => handleInputChange("aboutMe", e.target.value)}
          className={isExtracted("aboutMe") ? "border-blue-300 bg-blue-50" : ""}
          rows={6}
        />
        <p className="text-sm text-gray-500">
          This is your main about section. Aim for 2-3 paragraphs that showcase your personality and expertise.
        </p>
      </div>

      {/* Career Goals */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="careerGoals">Career Goals</Label>
          {isExtracted("careerGoals") && (
            <Badge variant="secondary" className="text-xs">
              <Target className="w-3 h-3 mr-1" />
              AI Generated
            </Badge>
          )}
        </div>
        <Textarea
          id="careerGoals"
          placeholder="What are your professional aspirations? Where do you see yourself in the next few years?"
          value={data.careerGoals || ""}
          onChange={(e) => handleInputChange("careerGoals", e.target.value)}
          className={isExtracted("careerGoals") ? "border-blue-300 bg-blue-50" : ""}
          rows={3}
        />
        <p className="text-sm text-gray-500">
          Optional: Share your career aspirations and what you're looking to achieve.
        </p>
      </div>

      {/* Resume Upload/Link */}
      <div className="space-y-4">
        <Label>
          Resume <span className="text-red-500">*</span>
        </Label>

        {/* File Upload */}
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium mb-1">Upload Resume File</p>
              <p className="text-xs text-gray-500 mb-3">PDF, DOC, DOCX (Max 10MB)</p>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-file-upload"
              />
              <Label htmlFor="resume-file-upload">
                <Button variant="outline" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </Label>

              {data.resumeFile && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <FileText className="w-4 h-4 inline mr-1 text-green-600" />
                  <span className="text-green-800">{data.resumeFile.name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* OR Divider */}
        <div className="flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500 bg-white">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Resume Link */}
        <div className="space-y-2">
          <Label htmlFor="resumePdfLink">Resume PDF Link</Label>
          <Input
            id="resumePdfLink"
            type="url"
            placeholder="https://drive.google.com/file/d/your-resume-link"
            value={data.resumePdfLink || ""}
            onChange={(e) => handleInputChange("resumePdfLink", e.target.value)}
          />
          <p className="text-sm text-gray-500">Provide a public link to your resume (Google Drive, Dropbox, etc.)</p>
        </div>
      </div>

      {/* Tips Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-medium text-blue-900 mb-2">💡 Writing Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Start with your current role and key expertise</li>
            <li>• Mention your years of experience and main technologies</li>
            <li>• Include what you're passionate about in your field</li>
            <li>• End with what you're looking for or working towards</li>
          </ul>
        </CardContent>
      </Card>

      {isReviewMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Fields highlighted in blue were automatically generated from your resume. You can
              edit any information above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
