"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { useToast } from "../hooks/use-toast"
import { ArrowRight, ArrowLeft, Zap, Upload, FileCheck, Edit3 } from "lucide-react"
import { TemplateSelector3D } from "../components/3d/template-selector-3d"

// Import all form components
import { ResumeUploadSection } from "../components/portfolio/ResumeUploadSection"
import { PersonalInfoForm } from "../components/portfolio/PersonalInfoForm"
import { ContactInfoForm } from "../components/portfolio/ContactInfoForm"
import { AboutSectionForm } from "../components/portfolio/AboutSectionForm"
import { SkillsForm } from "../components/portfolio/SkillsForm"
import { ProjectsForm } from "../components/portfolio/ProjectsForm"
import { ExperienceForm } from "../components/portfolio/ExperienceForm"
import { EducationForm } from "../components/portfolio/EducationForm"
import { AdditionalSectionsForm } from "../components/portfolio/AdditionalSectionsForm"

export default function CreatePortfolioPage() {
  const [step, setStep] = useState(1)
  const [dataSource, setDataSource] = useState(null) // 'resume' or 'manual'
  const [autoOpenFilePicker, setAutoOpenFilePicker] = useState(false)
  const [portfolioData, setPortfolioData] = useState({
    // Personal Info
    fullName: "",
    profilePicture: null,
    shortBio: "",
    currentRole: "",
    location: "",

    // Contact Info
    email: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    blogUrl: "",
    whatsappUrl: "",
    telegramUrl: "",

    // About Section
    aboutMe: "",
    careerGoals: "",
    resumeFile: null,
    resumePdfLink: "",

    // Skills
    technicalSkills: [],
    softSkills: [],
    toolsAndTech: [],

    // Projects
    projects: [],

    // Experience
    experience: [],

    // Education
    education: [],

    // Additional Sections
    certifications: [],
    awards: [],
    testimonials: [],
    blogs: [],
    languages: [],
    hobbies: "",
    openSource: [],
    socialProof: {
      leetcode: "",
      hackerrank: "",
      behance: "",
      dribbble: "",
    },

    // Template
    template: "modern",

    // Metadata
    extractedFromResume: new Set(), // Track which fields were extracted
  })

  const { toast } = useToast()
  const navigate = useNavigate()
//edit By vaibhav Krishna

  useEffect(() => {
    const hasPaid = localStorage.getItem("hasPaid")
    if (!loading && user && hasPaid !== "true") {
      navigate("/pricing")
    }
  }, [user, loading, navigate])

  //edit till this line 

  const steps = [
    { id: 1, title: "Data Source", description: "Choose how to provide your information" },
    { id: 2, title: "Personal Info", description: "Basic personal information" },
    { id: 3, title: "Contact", description: "Contact information" },
    { id: 4, title: "About", description: "About section and resume" },
    { id: 5, title: "Skills", description: "Technical and soft skills" },
    { id: 6, title: "Projects", description: "Your projects and work" },
    { id: 7, title: "Experience", description: "Work experience" },
    { id: 8, title: "Education", description: "Educational background" },
    { id: 9, title: "Additional", description: "Certifications, awards, etc." },
    { id: 10, title: "Template", description: "Choose your template" },
  ]

  const handleNext = () => {
    if (step < steps.length) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleDataSourceSelect = (source) => {
    setDataSource(source)
    if (source === "manual") {
      handleNext()
    } else if (source === "resume") {
      setAutoOpenFilePicker(true)
      handleNext()
    }
  }

  const handleResumeProcessed = (extractedData) => {
    console.log("Extracted Data:", extractedData); // Debug log
    setPortfolioData((prev) => ({
      ...prev,
      // Affinda mappings
      fullName: extractedData.name?.raw || prev.fullName,
      email: extractedData.emails?.[0] || prev.email,
      phone: extractedData.phoneNumbers?.[0] || prev.phone,
      linkedinUrl:
        extractedData.linkedin ||
        (Array.isArray(extractedData.websites)
          ? extractedData.websites.find(url => url.includes('linkedin.com'))
          : undefined) ||
        prev.linkedinUrl,
      githubUrl:
        extractedData.github ||
        (Array.isArray(extractedData.websites)
          ? extractedData.websites.find(url => url.includes('github.com'))
          : undefined) ||
        prev.githubUrl,
      // Add more mappings as needed
      education:
        Array.isArray(extractedData.education)
          ? extractedData.education.map(edu => ({
              degree: edu.accreditation?.inputStr || edu.degree || '',
              institution: edu.organization || '',
              startYear: edu.startDate || '',
              endYear: edu.endDate || '',
              percentage: edu.percentage || edu.grade || edu.gpa || '',
              cgpa: edu.cgpa || edu.gpa || '',
            })).filter(edu => edu.degree || edu.institution)
          : prev.education,
      experience: extractedData.workExperience || prev.experience,
      technicalSkills:
        Array.isArray(extractedData.skills)
          ? extractedData.skills.map(skill =>
              typeof skill === 'string'
                ? skill
                : skill.name || ''
            ).filter(Boolean)
          : prev.technicalSkills,
      // Track extracted fields
      extractedFromResume: new Set(Object.keys(extractedData)),
    }))
    toast({
      title: "Resume processed successfully!",
      description: "Your information has been extracted. You can review and edit it.",
      duration: 3000,
    })
    handleNext()
  }

  const updatePortfolioData = (section, data) => {
    setPortfolioData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = {
      fullName: portfolioData.fullName,
      currentRole: portfolioData.currentRole,
      shortBio: portfolioData.shortBio,
      email: portfolioData.email,
      linkedinUrl: portfolioData.linkedinUrl,
      githubUrl: portfolioData.githubUrl,
      aboutMe: portfolioData.aboutMe,
      technicalSkills: portfolioData.technicalSkills.length > 0,
      projects: portfolioData.projects.length > 0,
      education: portfolioData.education.length > 0,
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length > 0) {
      toast({
        title: "Missing required information",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    try {
      // Create portfolio in backend
      const token = localStorage.getItem('token')
      const portfolioPayload = {
        name: portfolioData.fullName + "'s Portfolio",
        template: portfolioData.template,
        resumeId: portfolioData.resumeId // This will be undefined if no resume was uploaded
      }

      const response = await fetch('http://localhost:8000/api/v1/portfolio/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(portfolioPayload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create portfolio')
      }

      const result = await response.json()

      toast({
        title: "Portfolio created successfully!",
        description: "Redirecting to the editor...",
        duration: 3000,
      })

      // Save portfolio data to localStorage for editing
      localStorage.setItem("portfolioData", JSON.stringify(portfolioData))
      localStorage.setItem("portfolioId", result.portfolioId)
      
      navigate("/edit/new")

    } catch (error) {
      console.error('Error creating portfolio:', error)
      toast({
        title: "Failed to create portfolio",
        description: error.message || "Please try again",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">How would you like to provide your information?</h2>
              <p className="text-gray-600">Choose the method that works best for you</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Resume Upload Option */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                onClick={() => handleDataSourceSelect("resume")}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
                  <p className="text-gray-600 mb-4">
                    Upload your resume and we'll automatically extract all your information using AI
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center">
                      <FileCheck className="w-4 h-4 mr-2" />
                      <span>Supports PDF, DOC, DOCX</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Edit3 className="w-4 h-4 mr-2" />
                      <span>Review and edit extracted data</span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full">Choose This Option</Button>
                </CardContent>
              </Card>

              {/* Manual Entry Option */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-500"
                onClick={() => handleDataSourceSelect("manual")}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Edit3 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Manual Entry</h3>
                  <p className="text-gray-600 mb-4">Fill in your information manually using our guided forms</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center">
                      <FileCheck className="w-4 h-4 mr-2" />
                      <span>Step-by-step guidance</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Edit3 className="w-4 h-4 mr-2" />
                      <span>Full control over your data</span>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4 w-full border-green-500 text-green-600 hover:bg-green-50">
                    Choose This Option
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 2:
        if (dataSource === "resume") {
          return (
            <ResumeUploadSection
              onResumeProcessed={handleResumeProcessed}
              portfolioData={portfolioData}
              updatePortfolioData={updatePortfolioData}
              autoOpenFilePicker={autoOpenFilePicker}
              setAutoOpenFilePicker={setAutoOpenFilePicker}
            />
          )
        } else {
          return (
            <PersonalInfoForm
              data={portfolioData}
              updateData={updatePortfolioData}
              extractedFields={portfolioData.extractedFromResume}
            />
          )
        }

      case 3:
        return (
          <ContactInfoForm
            data={portfolioData}
            updateData={updatePortfolioData}
            extractedFields={portfolioData.extractedFromResume}
          />
        )

      case 4:
        return (
          <AboutSectionForm
            data={portfolioData}
            updateData={updatePortfolioData}
            extractedFields={portfolioData.extractedFromResume}
          />
        )

      case 5:
        return (
          <SkillsForm
            data={portfolioData}
            updateData={updatePortfolioData}
            extractedFields={portfolioData.extractedFromResume}
          />
        )

      case 6:
        return (
          <ProjectsForm
            data={portfolioData}
            updateData={updatePortfolioData}
            extractedFields={portfolioData.extractedFromResume}
          />
        )

      case 7:
        return (
          <ExperienceForm
            data={portfolioData}
            updateData={updatePortfolioData}
            extractedFields={portfolioData.extractedFromResume}
          />
        )

      case 8:
        return (
          <EducationForm
            data={portfolioData}
            updateData={updatePortfolioData}
            extractedFields={portfolioData.extractedFromResume}
          />
        )

      case 9:
        return (
          <AdditionalSectionsForm
            data={portfolioData}
            updateData={updatePortfolioData}
            extractedFields={portfolioData.extractedFromResume}
          />
        )

      case 10:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Choose Your Template</h2>
              <p className="text-gray-600">Select a template that best represents your style</p>
            </div>
            <TemplateSelector3D
              templates={[
                { id: "modern", name: "Modern", description: "Clean and professional", color: "#3b82f6" },
                { id: "creative", name: "Creative", description: "Bold and artistic", color: "#8b5cf6" },
                { id: "minimal", name: "Minimal", description: "Simple and elegant", color: "#10b981" },
                { id: "tech", name: "Tech", description: "Perfect for developers", color: "#f59e0b" },
              ]}
              selectedTemplate={portfolioData.template}
              onSelect={(templateId) => updatePortfolioData("template", templateId)}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">AutoFolio</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">
              Step {step} of {steps.length}
            </Badge>
            <Link to="/dashboard">
              <Button variant="ghost">Cancel</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Portfolio</h1>
          <p className="text-gray-600">{steps[step - 1]?.description}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto">
          <div className="flex items-center space-x-2">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepItem.id <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepItem.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 mx-1 ${stepItem.id < step ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">{renderStepContent()}</CardContent>

          {/* Navigation */}
          {step > 1 && (
            <div className="flex justify-between p-6 border-t">
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {step < steps.length ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  Create Portfolio
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
