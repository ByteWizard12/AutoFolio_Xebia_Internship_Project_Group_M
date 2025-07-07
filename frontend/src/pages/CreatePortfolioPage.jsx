"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { useToast } from "../hooks/use-toast"
import { ArrowRight, ArrowLeft, Zap, Upload, FileCheck, Edit3, Eye, Download, Share2 } from "lucide-react"
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
import { useAuth } from "../components/auth-provider"

export default function CreatePortfolioPage() {
  const [step, setStep] = useState(1)
  const [dataSource, setDataSource] = useState(null) // 'resume' or 'manual'
  const [autoOpenFilePicker, setAutoOpenFilePicker] = useState(false)
  const [generatedPortfolio, setGeneratedPortfolio] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
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
  const { user, loading } = useAuth()
  
  useEffect(() => {
    const hasPaid = localStorage.getItem("hasPaid")
    if (!loading && user && hasPaid !== "true") {
      navigate("/pricing")
    }
  }, [user, loading, navigate])

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
    { id: 11, title: "Preview", description: "Review and generate your portfolio" },
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

  // Helper: map certifications
  const mapCertifications = (certArr) => {
    if (!Array.isArray(certArr)) return [];
    const result = [];
    for (let i = 0; i < certArr.length; i++) {
      let cert = certArr[i]?.trim();
      if (!cert || cert.toLowerCase() === 'view certificate') continue;
      let link = '';
      if (
        certArr[i + 1] &&
        typeof certArr[i + 1] === 'string' &&
        certArr[i + 1].trim().toLowerCase().startsWith('view certificate')
      ) {
        const urlMatch = certArr[i + 1].match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) link = urlMatch[0];
        i++;
      }
      const urlMatch = cert.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        link = urlMatch[0];
        cert = cert.replace(urlMatch[0], '').replace(/View Certificate:?/i, '').trim();
      }
      result.push({ name: cert, link });
    }
    return result;
  };

  // Helper: extract projects from Affinda sections
  const mapProjects = (extractedData) => {
    if (Array.isArray(extractedData.projects) && extractedData.projects.length > 0) {
      return extractedData.projects;
    }
    if (Array.isArray(extractedData.sections)) {
      const projectSection = extractedData.sections.find(
        (s) => s.sectionType && s.sectionType.toLowerCase().includes('project')
      );
      if (projectSection && projectSection.text) {
        const lines = projectSection.text.split(/\n{2,}|\n(?=[A-Z][^\n]+\n)/).map(l => l.trim()).filter(Boolean);
        return lines.map(line => {
          const nameMatch = line.match(/^[^\n]+/);
          const name = nameMatch ? nameMatch[0].split('\n')[0] : '';
          const techMatch = line.match(/([A-Za-z0-9\-\.]+,? ?)+(?=\n|\|)/);
          const tech = techMatch ? techMatch[0].split(/,|\|/).map(t => t.trim()).filter(Boolean) : [];
          const desc = line.split('\n').slice(1).join(' ').trim();
          return { name, tech, description: desc };
        });
      }
    }
    return [];
  };

  const [isAboutMeLoading, setIsAboutMeLoading] = useState(false);

  const handleResumeProcessed = (extractedData, huggingFaceError) => {
    console.log('Affinda extractedDetails:', extractedData);
    setPortfolioData((prev) => ({
      ...prev,
      fullName: extractedData.name?.raw || extractedData.fullName || prev.fullName,
      email: extractedData.emails?.[0] || extractedData.email || prev.email,
      phone: extractedData.phoneNumbers?.[0] || extractedData.phone || prev.phone,
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
      experience: extractedData.workExperience || extractedData.experience || prev.experience,
      technicalSkills:
        Array.isArray(extractedData.skills)
          ? extractedData.skills.map(skill =>
              typeof skill === 'string'
                ? skill
                : skill.name || ''
            ).filter(Boolean)
          : prev.technicalSkills,
      softSkills: extractedData.softSkills || prev.softSkills,
      toolsAndTech: extractedData.toolsAndTech || prev.toolsAndTech,
      projects: mapProjects(extractedData),
      awards: extractedData.awards || prev.awards,
      certifications: mapCertifications(extractedData.certifications),
      careerGoals: extractedData.careerGoals || prev.careerGoals,
      extractedFromResume: new Set(Object.keys(extractedData)),
    }))
    
    setIsAboutMeLoading(true);
    fetch('http://localhost:5001/api/portfolio/generate-about-me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ extractedData }),
    })
      .then(res => res.json())
      .then(data => {
        setPortfolioData(prev => ({ ...prev, aboutMe: data.aboutMe || prev.aboutMe }));
      })
      .catch(() => {
        // fallback: do nothing
      })
      .finally(() => setIsAboutMeLoading(false));
    
    if (huggingFaceError) {
      toast({
        title: "AI Generation Warning",
        description: `Some AI-generated fields may be missing: ${huggingFaceError}`,
        variant: "destructive",
        duration: 6000,
      })
    } else {
      toast({
        title: "Resume processed successfully!",
        description: "Your information has been extracted. You can review and edit it.",
        duration: 3000,
      })
    }
    handleNext();
  }

  const updatePortfolioData = (section, data) => {
    setPortfolioData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleGeneratePortfolio = async () => {
    // Validate required fields
    const requiredFields = {
      fullName: portfolioData.fullName,
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

    setIsGenerating(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5001/api/portfolio-generator/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          portfolioData,
          template: portfolioData.template
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate portfolio')
      }

      const result = await response.json()
      setGeneratedPortfolio(result)

      toast({
        title: "Portfolio generated successfully!",
        description: "Your portfolio is ready for preview and download.",
        variant: "success",
        duration: 3000,
      })

    } catch (error) {
      console.error('Error generating portfolio:', error)
      toast({
        title: "Failed to generate portfolio",
        description: error.message || "Please try again",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePreviewPortfolio = () => {
    if (generatedPortfolio?.previewUrl) {
      window.open(`http://localhost:5001${generatedPortfolio.previewUrl}`, '_blank')
    }
  }

  const handleDownloadPortfolio = () => {
    if (generatedPortfolio?.downloadUrl) {
      window.open(`http://localhost:5001${generatedPortfolio.downloadUrl}`, '_blank')
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
            isAboutMeLoading={isAboutMeLoading}
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

      case 11:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Review & Generate Portfolio</h2>
              <p className="text-gray-600">Review your information and generate your portfolio website</p>
            </div>

            {/* Portfolio Summary */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Portfolio Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Name:</strong> {portfolioData.fullName || 'Not provided'}</p>
                    <p><strong>Role:</strong> {portfolioData.currentRole || 'Not provided'}</p>
                    <p><strong>Email:</strong> {portfolioData.email || 'Not provided'}</p>
                    <p><strong>Template:</strong> {portfolioData.template}</p>
                  </div>
                  <div>
                    <p><strong>Skills:</strong> {portfolioData.technicalSkills?.length || 0} technical skills</p>
                    <p><strong>Projects:</strong> {portfolioData.projects?.length || 0} projects</p>
                    <p><strong>Experience:</strong> {portfolioData.experience?.length || 0} positions</p>
                    <p><strong>Education:</strong> {portfolioData.education?.length || 0} entries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            {!generatedPortfolio && (
              <div className="text-center">
                <Button 
                  onClick={handleGeneratePortfolio} 
                  disabled={isGenerating}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Portfolio...
                    </>
                  ) : (
                    <>
                      Generate Portfolio
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Generated Portfolio Actions */}
            {generatedPortfolio && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">
                    🎉 Portfolio Generated Successfully!
                  </h3>
                  <p className="text-green-700 mb-6">
                    Your portfolio website has been created. You can now preview it or download the HTML file.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={handlePreviewPortfolio} variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Portfolio
                    </Button>
                    <Button onClick={handleDownloadPortfolio}>
                      <Download className="w-4 h-4 mr-2" />
                      Download HTML
                    </Button>
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(`http://localhost:5001${generatedPortfolio.previewUrl}`)
                        toast({
                          title: "Link copied!",
                          description: "Portfolio link copied to clipboard",
                          duration: 2000,
                        })
                      }}
                      variant="outline"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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
              {step < steps.length && (
                <Button onClick={handleNext}>
                  Next
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