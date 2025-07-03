"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Plus, X, Trash2, Award, MessageSquare, BookOpen, Globe, Heart, Code, ExternalLink } from "lucide-react"

export function AdditionalSectionsForm({ data, updateData, extractedFields, isReviewMode = false }) {
  // State for adding new items
  const [newCertification, setNewCertification] = useState({ title: "", platform: "", link: "", date: "" })
  const [newAward, setNewAward] = useState({ title: "", description: "", issuer: "" })
  const [newTestimonial, setNewTestimonial] = useState({ quote: "", name: "", position: "" })
  const [newBlog, setNewBlog] = useState({ title: "", platform: "", description: "" })
  const [newLanguage, setNewLanguage] = useState({ language: "", fluency: "" })
  const [newOpenSource, setNewOpenSource] = useState({ title: "", description: "", link: "" })

  const isExtracted = (field) => extractedFields?.has(field)

  // Helper functions for each section
  const addCertification = () => {
    if (!newCertification.title.trim()) return
    const certifications = data.certifications || []
    updateData("certifications", [...certifications, { ...newCertification, id: Date.now() }])
    setNewCertification({ title: "", platform: "", link: "", date: "" })
  }

  const removeCertification = (id) => {
    const certifications = data.certifications || []
    updateData(
      "certifications",
      certifications.filter((cert) => cert.id !== id),
    )
  }

  const addAward = () => {
    if (!newAward.title.trim()) return
    const awards = data.awards || []
    updateData("awards", [...awards, { ...newAward, id: Date.now() }])
    setNewAward({ title: "", description: "", issuer: "" })
  }

  const removeAward = (id) => {
    const awards = data.awards || []
    updateData(
      "awards",
      awards.filter((award) => award.id !== id),
    )
  }

  const addTestimonial = () => {
    if (!newTestimonial.quote.trim()) return
    const testimonials = data.testimonials || []
    updateData("testimonials", [...testimonials, { ...newTestimonial, id: Date.now() }])
    setNewTestimonial({ quote: "", name: "", position: "" })
  }

  const removeTestimonial = (id) => {
    const testimonials = data.testimonials || []
    updateData(
      "testimonials",
      testimonials.filter((testimonial) => testimonial.id !== id),
    )
  }

  const addBlog = () => {
    if (!newBlog.title.trim()) return
    const blogs = data.blogs || []
    updateData("blogs", [...blogs, { ...newBlog, id: Date.now() }])
    setNewBlog({ title: "", platform: "", description: "" })
  }

  const removeBlog = (id) => {
    const blogs = data.blogs || []
    updateData(
      "blogs",
      blogs.filter((blog) => blog.id !== id),
    )
  }

  const addLanguage = () => {
    if (!newLanguage.language.trim()) return
    const languages = data.languages || []
    updateData("languages", [...languages, { ...newLanguage, id: Date.now() }])
    setNewLanguage({ language: "", fluency: "" })
  }

  const removeLanguage = (id) => {
    const languages = data.languages || []
    updateData(
      "languages",
      languages.filter((lang) => lang.id !== id),
    )
  }

  const addOpenSource = () => {
    if (!newOpenSource.title.trim()) return
    const openSource = data.openSource || []
    updateData("openSource", [...openSource, { ...newOpenSource, id: Date.now() }])
    setNewOpenSource({ title: "", description: "", link: "" })
  }

  const removeOpenSource = (id) => {
    const openSource = data.openSource || []
    updateData(
      "openSource",
      openSource.filter((project) => project.id !== id),
    )
  }

  return (
    <div className="space-y-6">
      {!isReviewMode && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Additional Sections</h2>
          <p className="text-gray-600">Add extra sections to make your portfolio stand out</p>
        </div>
      )}

      <Tabs defaultValue="certifications" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Certifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Certifications */}
              {/* Autofilled Certifications from Resume */}
              {Array.isArray(data.certifications) && data.certifications.length > 0 && (
                <div className="space-y-3">
                  {data.certifications.map((cert, idx) => (
                    <Card key={cert.id || idx} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-base mb-1">{cert.name}</span>
                          {cert.link && (
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm mt-1"
                            >
                              View Certificate
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Certification */}
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Certification Title *"
                      value={newCertification.title}
                      onChange={(e) => setNewCertification((prev) => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                      placeholder="Platform/Issuer"
                      value={newCertification.platform}
                      onChange={(e) => setNewCertification((prev) => ({ ...prev, platform: e.target.value }))}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      type="url"
                      placeholder="Certificate Link"
                      value={newCertification.link}
                      onChange={(e) => setNewCertification((prev) => ({ ...prev, link: e.target.value }))}
                    />
                    <Input
                      placeholder="Completion Date"
                      value={newCertification.date}
                      onChange={(e) => setNewCertification((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <Button onClick={addCertification} disabled={!newCertification.title.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Awards Tab */}
        <TabsContent value="awards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Awards & Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Awards */}
              {data.awards && data.awards.length > 0 && (
                <div className="space-y-3">
                  {data.awards.map((award) => (
                    <Card key={award.id} className="border-l-4 border-l-yellow-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{award.title}</h4>
                            {award.issuer && <p className="text-sm text-gray-600">{award.issuer}</p>}
                            {award.description && <p className="text-sm text-gray-700 mt-1">{award.description}</p>}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAward(award.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Award */}
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <Input
                    placeholder="Award Title *"
                    value={newAward.title}
                    onChange={(e) => setNewAward((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Issuer/Organization"
                    value={newAward.issuer}
                    onChange={(e) => setNewAward((prev) => ({ ...prev, issuer: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newAward.description}
                    onChange={(e) => setNewAward((prev) => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                  <Button onClick={addAward} disabled={!newAward.title.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Award
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Testimonials</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Testimonials */}
              {data.testimonials && data.testimonials.length > 0 && (
                <div className="space-y-3">
                  {data.testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <blockquote className="text-gray-700 italic mb-2">"{testimonial.quote}"</blockquote>
                            <div className="text-sm">
                              <span className="font-medium">{testimonial.name}</span>
                              {testimonial.position && <span className="text-gray-600"> - {testimonial.position}</span>}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTestimonial(testimonial.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Testimonial */}
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <Textarea
                    placeholder="Testimonial Quote *"
                    value={newTestimonial.quote}
                    onChange={(e) => setNewTestimonial((prev) => ({ ...prev, quote: e.target.value }))}
                    rows={3}
                  />
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Reviewer Name"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Position/Company"
                      value={newTestimonial.position}
                      onChange={(e) => setNewTestimonial((prev) => ({ ...prev, position: e.target.value }))}
                    />
                  </div>
                  <Button onClick={addTestimonial} disabled={!newTestimonial.quote.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testimonial
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blogs Tab */}
        <TabsContent value="blogs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Blogs & Publications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Blogs */}
              {data.blogs && data.blogs.length > 0 && (
                <div className="space-y-3">
                  {data.blogs.map((blog) => (
                    <Card key={blog.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{blog.title}</h4>
                            {blog.platform && <p className="text-sm text-gray-600">{blog.platform}</p>}
                            {blog.description && <p className="text-sm text-gray-700 mt-1">{blog.description}</p>}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBlog(blog.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Blog */}
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <Input
                    placeholder="Blog/Article Title *"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Platform/Link"
                    value={newBlog.platform}
                    onChange={(e) => setNewBlog((prev) => ({ ...prev, platform: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newBlog.description}
                    onChange={(e) => setNewBlog((prev) => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                  <Button onClick={addBlog} disabled={!newBlog.title.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Blog/Publication
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Languages</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Languages */}
              {data.languages && data.languages.length > 0 && (
                <div className="grid md:grid-cols-2 gap-3">
                  {data.languages.map((lang) => (
                    <Card key={lang.id} className="border-l-4 border-l-indigo-500">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{lang.language}</span>
                            {lang.fluency && <span className="text-sm text-gray-600 ml-2">({lang.fluency})</span>}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLanguage(lang.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Language */}
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Language *"
                      value={newLanguage.language}
                      onChange={(e) => setNewLanguage((prev) => ({ ...prev, language: e.target.value }))}
                    />
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newLanguage.fluency}
                      onChange={(e) => setNewLanguage((prev) => ({ ...prev, fluency: e.target.value }))}
                    >
                      <option value="">Select Fluency</option>
                      <option value="Native">Native</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                  <Button onClick={addLanguage} disabled={!newLanguage.language.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Language
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tab */}
        <TabsContent value="other" className="space-y-4">
          {/* Hobbies & Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Hobbies & Interests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Share your hobbies, interests, and what you do in your free time..."
                value={data.hobbies || ""}
                onChange={(e) => updateData("hobbies", e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Open Source Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>Open Source & Volunteer Work</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Open Source */}
              {data.openSource && data.openSource.length > 0 && (
                <div className="space-y-3">
                  {data.openSource.map((project) => (
                    <Card key={project.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{project.title}</h4>
                            {project.description && <p className="text-sm text-gray-700 mt-1">{project.description}</p>}
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 text-sm hover:underline flex items-center mt-1"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Project
                              </a>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOpenSource(project.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Open Source */}
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <Input
                    placeholder="Project/Organization Title *"
                    value={newOpenSource.title}
                    onChange={(e) => setNewOpenSource((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newOpenSource.description}
                    onChange={(e) => setNewOpenSource((prev) => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                  <Input
                    type="url"
                    placeholder="Project Link"
                    value={newOpenSource.link}
                    onChange={(e) => setNewOpenSource((prev) => ({ ...prev, link: e.target.value }))}
                  />
                  <Button onClick={addOpenSource} disabled={!newOpenSource.title.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Social Proof */}
          <Card>
            <CardHeader>
              <CardTitle>Social Proof & Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leetcode">LeetCode Profile</Label>
                  <Input
                    id="leetcode"
                    type="url"
                    placeholder="https://leetcode.com/username"
                    value={data.socialProof?.leetcode || ""}
                    onChange={(e) => updateData("socialProof", { ...data.socialProof, leetcode: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hackerrank">HackerRank Profile</Label>
                  <Input
                    id="hackerrank"
                    type="url"
                    placeholder="https://hackerrank.com/username"
                    value={data.socialProof?.hackerrank || ""}
                    onChange={(e) => updateData("socialProof", { ...data.socialProof, hackerrank: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="behance">Behance Profile</Label>
                  <Input
                    id="behance"
                    type="url"
                    placeholder="https://behance.net/username"
                    value={data.socialProof?.behance || ""}
                    onChange={(e) => updateData("socialProof", { ...data.socialProof, behance: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dribbble">Dribbble Profile</Label>
                  <Input
                    id="dribbble"
                    type="url"
                    placeholder="https://dribbble.com/username"
                    value={data.socialProof?.dribbble || ""}
                    onChange={(e) => updateData("socialProof", { ...data.socialProof, dribbble: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isReviewMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Additional sections help make your portfolio more comprehensive and personal. All
              fields in this section are optional.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
