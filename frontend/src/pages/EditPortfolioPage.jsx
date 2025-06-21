"use client"

import { useState } from "react"
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

export default function EditPortfolioPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const [portfolioData, setPortfolioData] = useState({
    name: "John Doe",
    title: "Full Stack Developer",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love creating user-friendly interfaces and robust backend systems.",
    skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "MongoDB"],
    experience: [
      {
        title: "Senior Full Stack Developer",
        company: "Tech Corp",
        duration: "2022 - Present",
        description: "Led development of microservices architecture serving 1M+ users",
      },
      {
        title: "Software Developer",
        company: "StartupXYZ",
        duration: "2020 - 2022",
        description: "Built responsive web applications using React and Node.js",
      },
    ],
    education: [
      {
        degree: "Bachelor of Computer Science",
        school: "University of Technology",
        year: "2020",
      },
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Full-stack e-commerce solution with payment integration",
        tech: ["React", "Node.js", "Stripe"],
        url: "https://github.com/johndoe/ecommerce",
      },
    ],
    social: {
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      website: "https://johndoe.dev",
    },
  })

  const handleSave = () => {
    toast({
      title: "Portfolio saved!",
      description: "Your changes have been saved successfully.",
    })
  }

  const handlePublish = () => {
    toast({
      title: "Portfolio published!",
      description: "Your portfolio is now live at autoport.site/johndoe/portfolio1",
    })
  }

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
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm" onClick={handlePublish}>
              Publish
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
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={portfolioData.name}
                          onChange={(e) => setPortfolioData({ ...portfolioData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          value={portfolioData.title}
                          onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={portfolioData.bio}
                        onChange={(e) => setPortfolioData({ ...portfolioData, bio: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={portfolioData.email}
                          onChange={(e) => setPortfolioData({ ...portfolioData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={portfolioData.phone}
                          onChange={(e) => setPortfolioData({ ...portfolioData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Work Experience</h3>
                      {portfolioData.experience.map((exp, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              <Input
                                placeholder="Job Title"
                                value={exp.title}
                                onChange={(e) => {
                                  const newExp = [...portfolioData.experience]
                                  newExp[index].title = e.target.value
                                  setPortfolioData({ ...portfolioData, experience: newExp })
                                }}
                              />
                              <Input
                                placeholder="Company"
                                value={exp.company}
                                onChange={(e) => {
                                  const newExp = [...portfolioData.experience]
                                  newExp[index].company = e.target.value
                                  setPortfolioData({ ...portfolioData, experience: newExp })
                                }}
                              />
                              <Input
                                placeholder="Duration"
                                value={exp.duration}
                                onChange={(e) => {
                                  const newExp = [...portfolioData.experience]
                                  newExp[index].duration = e.target.value
                                  setPortfolioData({ ...portfolioData, experience: newExp })
                                }}
                              />
                              <Textarea
                                placeholder="Description"
                                value={exp.description}
                                onChange={(e) => {
                                  const newExp = [...portfolioData.experience]
                                  newExp[index].description = e.target.value
                                  setPortfolioData({ ...portfolioData, experience: newExp })
                                }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Projects</h3>
                      {portfolioData.projects.map((project, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              <Input
                                placeholder="Project Name"
                                value={project.name}
                                onChange={(e) => {
                                  const newProjects = [...portfolioData.projects]
                                  newProjects[index].name = e.target.value
                                  setPortfolioData({ ...portfolioData, projects: newProjects })
                                }}
                              />
                              <Textarea
                                placeholder="Description"
                                value={project.description}
                                onChange={(e) => {
                                  const newProjects = [...portfolioData.projects]
                                  newProjects[index].description = e.target.value
                                  setPortfolioData({ ...portfolioData, projects: newProjects })
                                }}
                              />
                              <Input
                                placeholder="Project URL"
                                value={project.url}
                                onChange={(e) => {
                                  const newProjects = [...portfolioData.projects]
                                  newProjects[index].url = e.target.value
                                  setPortfolioData({ ...portfolioData, projects: newProjects })
                                }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Template & Theme</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {["Modern", "Creative", "Minimal", "Tech"].map((template) => (
                          <div
                            key={template}
                            className="border-2 border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-600"
                          >
                            <div className="aspect-video bg-gray-100 rounded mb-2"></div>
                            <p className="text-sm font-medium">{template}</p>
                          </div>
                        ))}
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
                <PortfolioPreview3D portfolioData={portfolioData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
