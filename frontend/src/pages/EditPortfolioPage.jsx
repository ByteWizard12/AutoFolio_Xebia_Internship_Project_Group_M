"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { useToast } from "../hooks/use-toast"
import { Eye, Save, Download, Share2, Settings, Zap } from "lucide-react"
import { PortfolioPreview3D } from "../components/3d/portfolio-preview-3d"
// Import all form components
import { PersonalInfoForm } from "../components/portfolio/PersonalInfoForm"
import { ContactInfoForm } from "../components/portfolio/ContactInfoForm"
import { AboutSectionForm } from "../components/portfolio/AboutSectionForm"
import { SkillsForm } from "../components/portfolio/SkillsForm"
import { ProjectsForm } from "../components/portfolio/ProjectsForm"
import { ExperienceForm } from "../components/portfolio/ExperienceForm"
import { EducationForm } from "../components/portfolio/EducationForm"
import { AdditionalSectionsForm } from "../components/portfolio/AdditionalSectionsForm"

export default function EditPortfolioPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const [portfolioData, setPortfolioData] = useState({
    fullName: "",
    currentRole: "",
    shortBio: "",
    location: "",
    profilePicture: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    blogUrl: "",
    whatsappUrl: "",
    telegramUrl: "",
    aboutMe: "",
    careerGoals: "",
    technicalSkills: [],
    softSkills: [],
    toolsAndTech: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    awards: [],
    blogs: [],
    languages: [],
    openSource: [],
    hobbies: "",
    socialProof: {},
    template: "modern",
  })
  const [previewHtml, setPreviewHtml] = useState("")
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchPortfolio = async () => {
      const token = localStorage.getItem("token")
      if (!token) return
      try {
        const res = await fetch("http://localhost:5001/api/portfolio/finalized", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setPortfolioData({
            ...portfolioData,
            ...data,
            template: data.template || "modern",
          })
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchPortfolio()
    // eslint-disable-next-line
  }, [])

  const handleSave = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast({
        title: "Error",
        description: "Please log in to save your portfolio.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      // Save the portfolio data
      const saveRes = await fetch("http://localhost:5001/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(portfolioData),
      })

      if (!saveRes.ok) {
        throw new Error("Failed to save portfolio")
      }

      // Regenerate the portfolio HTML
      const generateRes = await fetch("http://localhost:5001/api/portfolio/generate", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!generateRes.ok) {
        throw new Error("Failed to regenerate portfolio")
      }

      const html = await generateRes.text()
      setPreviewHtml(html)

      toast({
        title: "Portfolio updated!",
        description: "Your changes have been saved and the portfolio has been regenerated.",
      })
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Error",
        description: "Failed to save portfolio changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = () => {
    toast({
      title: "Portfolio published!",
      description: "Your portfolio is now live at autoport.site/johndoe/portfolio1",
    })
  }

  const loadPreview = async () => {
    setLoadingPreview(true)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("http://localhost:5001/api/portfolio/generate", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const html = await res.text()
        setPreviewHtml(html)
      }
    } catch (err) {
      console.error("Failed to load preview:", err)
    }
    setLoadingPreview(false)
  }

  useEffect(() => {
    loadPreview()
  }, [portfolioData])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Autofolio</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Badge variant="outline">Draft</Badge>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={saving}
            >
              <Zap className="w-4 h-4 mr-2" />
              {saving ? "Updating..." : "Update Portfolio"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Portfolio Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-8">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="additional">Additional</TabsTrigger>
                    <TabsTrigger value="template">Template</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <PersonalInfoForm
                      data={portfolioData}
                      updateData={(section, data) => setPortfolioData({ ...portfolioData, [section]: data })}
                      extractedFields={new Set()}
                    />
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <ContactInfoForm
                      data={portfolioData}
                      updateData={(section, data) => setPortfolioData({ ...portfolioData, [section]: data })}
                      extractedFields={new Set()}
                    />
                  </TabsContent>

                  <TabsContent value="about" className="space-y-4">
                    <AboutSectionForm
                      data={portfolioData}
                      updateData={(section, data) => setPortfolioData({ ...portfolioData, [section]: data })}
                      extractedFields={new Set()}
                      isAboutMeLoading={false}
                    />
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <SkillsForm
                      data={portfolioData}
                      updateData={(section, data) => setPortfolioData({ ...portfolioData, [section]: data })}
                      extractedFields={new Set()}
                    />
                  </TabsContent>

                  <TabsContent value="projects" className="space-y-4">
                    <ProjectsForm
                      data={portfolioData}
                      updateData={(section, data) => setPortfolioData({ ...portfolioData, [section]: data })}
                      extractedFields={new Set()}
                    />
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4">
                    <ExperienceForm
                      data={portfolioData}
                      updateData={(section, data) => setPortfolioData({ ...portfolioData, [section]: data })}
                      extractedFields={new Set()}
                    />
                  </TabsContent>

                  <TabsContent value="education" className="space-y-4">
                    <EducationForm
                      data={portfolioData}
                      updateData={(section, data) => setPortfolioData({ ...portfolioData, [section]: data })}
                      extractedFields={new Set()}
                    />
                  </TabsContent>

                  <TabsContent value="additional" className="space-y-4">
                    <AdditionalSectionsForm
                      data={portfolioData}
                      updateData={(section, data) => setPortfolioData({ ...portfolioData, [section]: data })}
                      extractedFields={new Set()}
                    />
                  </TabsContent>

                  <TabsContent value="template" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Template & Theme</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {["modern", "creative", "minimal", "tech"].map((template) => (
                          <div
                            key={template}
                            className={`border-2 rounded-lg p-3 cursor-pointer hover:border-blue-600 ${portfolioData.template === template ? "border-blue-600" : "border-gray-200"}`}
                            onClick={() => setPortfolioData({ ...portfolioData, template })}
                          >
                            <div className="aspect-video bg-gray-100 rounded mb-2"></div>
                            <p className="text-sm font-medium capitalize">{template}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Save & Update Button */}
                      <div className="pt-6 border-t">
                        <Button 
                          onClick={handleSave}
                          disabled={saving}
                          className="w-full"
                          size="lg"
                        >
                          <Zap className="w-5 h-5 mr-2" />
                          {saving ? "Saving & Updating..." : "Save & Update Portfolio"}
                        </Button>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                          This will save your changes and regenerate your portfolio with the latest data
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Live Preview
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[600px]">
                {loadingPreview ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">Loading preview...</div>
                  </div>
                ) : (
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    title="Portfolio Preview"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
