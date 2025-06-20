"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { useToast } from "../hooks/use-toast"
import { Upload, Linkedin, Github, FileText, ArrowRight, ArrowLeft, Zap } from "lucide-react"
import { TemplateSelector3D } from "../components/3d/template-selector-3d"

export default function CreatePortfolioPage() {
  const [step, setStep] = useState(1)
  const [portfolioData, setPortfolioData] = useState({
    name: "",
    linkedinUrl: "",
    githubUrl: "",
    resumeFile: null,
    bio: "",
    skills: [],
    template: "modern",
  })
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPortfolioData({ ...portfolioData, resumeFile: file })
      toast({
        title: "Resume uploaded",
        description: "We'll extract your information automatically.",
      })
    }
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    toast({
      title: "Portfolio created!",
      description: "Redirecting to the editor...",
    })
    navigate("/edit/new")
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
            <span className="text-xl font-bold">AutoPort</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">Step {step} of 3</Badge>
            <Link to="/dashboard">
              <Button variant="ghost">Cancel</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Portfolio</h1>
          <p className="text-gray-600">Let's gather your information to build an amazing portfolio</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && <div className={`w-12 h-1 mx-2 ${stepNum < step ? "bg-blue-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="max-w-2xl mx-auto">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about yourself and provide your professional links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Portfolio Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., John Doe - Software Developer"
                    value={portfolioData.name}
                    onChange={(e) => setPortfolioData({ ...portfolioData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="pl-10"
                      value={portfolioData.linkedinUrl}
                      onChange={(e) => setPortfolioData({ ...portfolioData, linkedinUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Profile URL</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="github"
                      placeholder="https://github.com/yourusername"
                      className="pl-10"
                      value={portfolioData.githubUrl}
                      onChange={(e) => setPortfolioData({ ...portfolioData, githubUrl: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
                <CardDescription>
                  Upload your resume to automatically extract your experience and skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Upload your resume</p>
                    <p className="text-gray-600">PDF, DOC, or DOCX files supported</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <Label htmlFor="resume-upload">
                      <Button variant="outline" className="cursor-pointer">
                        <FileText className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </Label>
                  </div>
                </div>
                {portfolioData.resumeFile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">{portfolioData.resumeFile.name}</span>
                    </div>
                    <p className="text-green-600 text-sm mt-1">
                      Resume uploaded successfully! We'll extract your information.
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Write a brief description about yourself..."
                    value={portfolioData.bio}
                    onChange={(e) => setPortfolioData({ ...portfolioData, bio: e.target.value })}
                  />
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Choose Your Template</CardTitle>
                <CardDescription>Select a template that best represents your style</CardDescription>
              </CardHeader>
              <CardContent>
                <TemplateSelector3D
                  templates={[
                    { id: "modern", name: "Modern", description: "Clean and professional", color: "#3b82f6" },
                    { id: "creative", name: "Creative", description: "Bold and artistic", color: "#8b5cf6" },
                    { id: "minimal", name: "Minimal", description: "Simple and elegant", color: "#10b981" },
                    { id: "tech", name: "Tech", description: "Perfect for developers", color: "#f59e0b" },
                  ]}
                  selectedTemplate={portfolioData.template}
                  onSelect={(templateId) => setPortfolioData({ ...portfolioData, template: templateId })}
                />
              </CardContent>
            </>
          )}

          <div className="flex justify-between p-6 border-t">
            <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            {step < 3 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Create Portfolio
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
