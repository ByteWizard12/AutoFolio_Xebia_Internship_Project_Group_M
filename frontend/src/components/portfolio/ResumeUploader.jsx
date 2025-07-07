"use client"

import { useState, useRef } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { Alert, AlertDescription } from "../ui/alert"
import { Upload, FileText, CheckCircle, Loader2, AlertCircle } from "lucide-react"

export function ResumeUploader({ onDataExtracted, onError }) {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const validateFile = (file) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    const validExtensions = [".pdf", ".doc", ".docx"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    // Check file type
    const isValidType =
      validTypes.includes(file.type) || validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

    if (!isValidType) {
      throw new Error("Please upload a PDF, DOC, or DOCX file")
    }

    // Check file size
    if (file.size > maxSize) {
      throw new Error("File size must be less than 10MB")
    }

    // Check if file is empty
    if (file.size === 0) {
      throw new Error("File appears to be empty")
    }

    return true
  }

  const uploadResume = async (file) => {
    const formData = new FormData()
    formData.append("resume", file)

    try {
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Upload failed")
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Upload error:", error)
      throw error
    }
  }

  const handleFileUpload = async (file) => {
    try {
      // Reset previous states
      setError(null)
      setExtractedData(null)

      // Validate file
      validateFile(file)
      setUploadedFile(file)
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload and process resume
      const result = await uploadResume(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      setTimeout(() => {
        setExtractedData(result.data)
        setIsUploading(false)
      }, 500)
    } catch (error) {
      setIsUploading(false)
      setUploadProgress(0)
      setError(error.message)
      onError?.(error.message)
    }
  }

  const handleConfirmData = () => {
    onDataExtracted(extractedData)
  }

  const handleRetry = () => {
    setError(null)
    setUploadedFile(null)
    setExtractedData(null)
    setUploadProgress(0)
  }

  // Show extracted data preview
  if (extractedData) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span>Resume Processed Successfully!</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              We've extracted the following information from your resume. Review and confirm to proceed.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Personal Information</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Name:</strong> {extractedData.personalInfo?.name || "Not found"}
                  </p>
                  <p>
                    <strong>Email:</strong> {extractedData.personalInfo?.email || "Not found"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {extractedData.personalInfo?.phone || "Not found"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  Skills ({extractedData.skills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-1">
                  {extractedData.skills?.slice(0, 6).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {extractedData.skills?.length > 6 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{extractedData.skills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  Experience ({extractedData.experience?.length || 0})
                </h3>
                <div className="space-y-2">
                  {extractedData.experience?.slice(0, 2).map((exp, index) => (
                    <div key={index} className="text-sm">
                      <p>
                        <strong>{exp.position}</strong> at {exp.company}
                      </p>
                      <p className="text-gray-600">{exp.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  Education ({extractedData.education?.length || 0})
                </h3>
                <div className="space-y-2">
                  {extractedData.education?.slice(0, 2).map((edu, index) => (
                    <div key={index} className="text-sm">
                      <p>
                        <strong>{edu.degree}</strong>
                      </p>
                      <p className="text-gray-600">
                        {edu.institution} ({edu.year})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={handleRetry}>
              Upload Different Resume
            </Button>
            <Button onClick={handleConfirmData} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Use This Data
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show error state
  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-red-900">Upload Failed</h3>
              <p className="text-red-700 mb-4">{error}</p>
            </div>

            <Button onClick={handleRetry} className="w-full">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show upload progress
  if (isUploading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Processing Your Resume</h3>
              <p className="text-gray-600">Extracting information from your resume...</p>
            </div>

            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Processing:</strong> We're extracting your personal information, skills, experience, and
                education from your resume.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show upload interface
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-6 h-6" />
          <span>Upload Your Resume</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Drop your resume here</h3>
              <p className="text-gray-600 mb-4">or click to browse files</p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button type="button" onClick={handleButtonClick}>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p>Supports PDF, DOC, DOCX files (Max 10MB)</p>
            </div>
          </div>
        </div>

        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Privacy Note:</strong> Your resume will be processed securely and temporarily stored only during
            extraction.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
