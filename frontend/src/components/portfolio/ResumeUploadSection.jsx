"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Upload, FileText, CheckCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { PersonalInfoForm } from "./PersonalInfoForm"
import { ContactInfoForm } from "./ContactInfoForm"
import { SkillsForm } from "./SkillsForm"
import { ProjectsForm } from "./ProjectsForm"
import { ExperienceForm } from "./ExperienceForm"
import { EducationForm } from "./EducationForm"
import { useAuth } from "../auth-provider"
import { useToast } from "../../hooks/use-toast"

export function ResumeUploadSection({ onResumeProcessed, portfolioData, updatePortfolioData, autoOpenFilePicker, setAutoOpenFilePicker }) {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)
  const [showExtractedData, setShowExtractedData] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [uploadedResumeId, setUploadedResumeId] = useState(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (autoOpenFilePicker && fileInputRef.current) {
      fileInputRef.current.click()
      setAutoOpenFilePicker(false)
    }
  }, [autoOpenFilePicker, setAutoOpenFilePicker])

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.includes('pdf')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only",
          variant: "destructive",
        })
        return
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        })
        return
      }
      
      setUploadedFile(file)
      setIsProcessed(false)
      setShowExtractedData(false)
    }
  }

  const uploadResumeToBackend = async (file) => {
    const formData = new FormData()
    formData.append('resume', file)

    const token = localStorage.getItem('token')
    
    const response = await fetch('http://localhost:8000/api/v1/portfolio/upload-resume', {
      method: 'POST',
      headers: {
        'token': token
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to upload resume')
    }

    return await response.json()
  }

  const processResume = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)

    try {
      // Upload resume to backend
      const uploadResult = await uploadResumeToBackend(uploadedFile)
      setUploadedResumeId(uploadResult.resumeId)

      // For now, we'll use mock data since AI parsing is not implemented yet
      // In the future, this would call an AI service to parse the resume
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time

      // Mock extracted data - in real implementation, this would come from AI service
      const mockExtractedData = {
        fullName: "John Doe",
        currentRole: "Senior Software Developer",
        shortBio: "Passionate full-stack developer with 5+ years of experience building scalable web applications",
        location: "San Francisco, CA",
        email: "john.doe@email.com",
        phone: "+1 (555) 123-4567",
        linkedinUrl: "https://linkedin.com/in/johndoe",
        githubUrl: "https://github.com/johndoe",
        aboutMe:
          "I'm a dedicated software developer with expertise in modern web technologies. I enjoy solving complex problems and building user-friendly applications that make a difference.",
        technicalSkills: ["JavaScript", "React", "Node.js", "Python", "PostgreSQL", "AWS"],
        projects: [
          {
            name: "E-commerce Platform",
            description: "Full-stack e-commerce solution with React and Node.js",
            techStack: ["React", "Node.js", "MongoDB", "Stripe"],
            githubRepo: "https://github.com/johndoe/ecommerce",
            liveLink: "https://myecommerce.com",
          },
        ],
        experience: [
          {
            jobTitle: "Senior Software Developer",
            companyName: "Tech Corp",
            duration: "2021 - Present",
            responsibilities: "Led development of microservices architecture, mentored junior developers",
          },
        ],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            institution: "University of California",
            duration: "2016 - 2020",
            cgpa: "3.8",
          },
        ],
      }

      setExtractedData(mockExtractedData)
      setIsProcessing(false)
      setIsProcessed(true)
      setShowExtractedData(true)

      toast({
        title: "Resume uploaded successfully!",
        description: "Your resume has been uploaded and is ready for processing",
      })

    } catch (error) {
      console.error('Error processing resume:', error)
      setIsProcessing(false)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const confirmExtractedData = () => {
    // Store the resume ID with the portfolio data for later use
    const dataWithResumeId = {
      ...extractedData,
      resumeId: uploadedResumeId
    }
    onResumeProcessed(dataWithResumeId)
  }

  const editExtractedData = (section, data) => {
    setExtractedData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  return (
    <div className="space-y-6">
      {!isProcessed ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
            <p className="text-gray-600">We'll extract your information automatically using AI</p>
          </div>

          {/* File Upload */}
          <Card>
            <CardContent className="p-8">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Upload your resume</p>
                  <p className="text-gray-600">PDF files only (Max 5MB)</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                    ref={fileInputRef}
                  />
                  <Label htmlFor="resume-upload">
                    <Button variant="outline" className="cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </Label>
                </div>
              </div>

              {uploadedFile && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-600 mr-2" />
                      <div>
                        <span className="text-blue-800 font-medium">{uploadedFile.name}</span>
                        <p className="text-blue-600 text-sm">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button onClick={processResume} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Process Resume
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-yellow-600" />
                    <span className="text-yellow-800">Uploading and processing your resume...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Processing Complete */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg mb-4">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              <span className="text-green-800 font-medium">Resume processed successfully!</span>
            </div>
            <p className="text-gray-600">Review the extracted information below and make any necessary changes</p>
          </div>

          {/* Toggle View */}
          <div className="flex justify-center mb-6">
            <Button
              variant="outline"
              onClick={() => setShowExtractedData(!showExtractedData)}
              className="flex items-center"
            >
              {showExtractedData ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Extracted Data
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show Extracted Data
                </>
              )}
            </Button>
          </div>

          {/* Extracted Data Forms */}
          {showExtractedData && extractedData && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2 bg-blue-100 text-blue-800">AI Extracted</Badge>
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PersonalInfoForm
                    data={extractedData}
                    updateData={editExtractedData}
                    extractedFields={new Set(Object.keys(extractedData))}
                    isReviewMode={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2 bg-blue-100 text-blue-800">AI Extracted</Badge>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactInfoForm
                    data={extractedData}
                    updateData={editExtractedData}
                    extractedFields={new Set(Object.keys(extractedData))}
                    isReviewMode={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2 bg-blue-100 text-blue-800">AI Extracted</Badge>
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SkillsForm
                    data={extractedData}
                    updateData={editExtractedData}
                    extractedFields={new Set(Object.keys(extractedData))}
                    isReviewMode={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2 bg-blue-100 text-blue-800">AI Extracted</Badge>
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectsForm
                    data={extractedData}
                    updateData={editExtractedData}
                    extractedFields={new Set(Object.keys(extractedData))}
                    isReviewMode={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2 bg-blue-100 text-blue-800">AI Extracted</Badge>
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ExperienceForm
                    data={extractedData}
                    updateData={editExtractedData}
                    extractedFields={new Set(Object.keys(extractedData))}
                    isReviewMode={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2 bg-blue-100 text-blue-800">AI Extracted</Badge>
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EducationForm
                    data={extractedData}
                    updateData={editExtractedData}
                    extractedFields={new Set(Object.keys(extractedData))}
                    isReviewMode={true}
                  />
                </CardContent>
              </Card>

              {/* Confirm Button */}
              <div className="text-center pt-6">
                <Button onClick={confirmExtractedData} size="lg" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm & Continue
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
