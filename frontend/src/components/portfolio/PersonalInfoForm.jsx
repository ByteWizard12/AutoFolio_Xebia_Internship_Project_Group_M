"use client"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Upload, User, MapPin, Briefcase } from "lucide-react"

export function PersonalInfoForm({ data, updateData, extractedFields, isReviewMode = false }) {
  const handleInputChange = (field, value) => {
    updateData(field, value)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleInputChange("profilePicture", file)
    }
  }

  const isExtracted = (field) => extractedFields?.has(field)

  return (
    <div className="space-y-6">
      {!isReviewMode && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
          <p className="text-gray-600">Let's start with your basic information</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            {isExtracted("fullName") && (
              <Badge variant="secondary" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                AI Extracted
              </Badge>
            )}
          </div>
          <Input
            id="fullName"
            placeholder="e.g., John Doe"
            value={data.fullName || ""}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className={isExtracted("fullName") ? "border-blue-300 bg-blue-50" : ""}
          />
        </div>

        {/* Current Role */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="currentRole">
              Current Role/Title <span className="text-red-500">*</span>
            </Label>
            {isExtracted("currentRole") && (
              <Badge variant="secondary" className="text-xs">
                <Briefcase className="w-3 h-3 mr-1" />
                AI Extracted
              </Badge>
            )}
          </div>
          <Input
            id="currentRole"
            placeholder="e.g., Senior Software Developer"
            value={data.currentRole || ""}
            onChange={(e) => handleInputChange("currentRole", e.target.value)}
            className={isExtracted("currentRole") ? "border-blue-300 bg-blue-50" : ""}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="location">Location</Label>
            {isExtracted("location") && (
              <Badge variant="secondary" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                AI Extracted
              </Badge>
            )}
          </div>
          <Input
            id="location"
            placeholder="e.g., San Francisco, CA"
            value={data.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className={isExtracted("location") ? "border-blue-300 bg-blue-50" : ""}
          />
        </div>

        {/* Profile Picture */}
        <div className="space-y-2">
          <Label htmlFor="profilePicture">Profile Picture</Label>
          <div className="flex items-center space-x-4">
            {data.profilePicture && (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {typeof data.profilePicture === "string" ? (
                  <img
                    src={data.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="profile-picture-upload"
              />
              <Label htmlFor="profile-picture-upload">
                <Button variant="outline" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </Label>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Short Bio */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="shortBio">
            Short Bio/Tagline <span className="text-red-500">*</span>
          </Label>
          {isExtracted("shortBio") && (
            <Badge variant="secondary" className="text-xs">
              AI Extracted
            </Badge>
          )}
        </div>
        <Textarea
          id="shortBio"
          placeholder="e.g., Passionate full-stack developer with 5+ years of experience building scalable web applications"
          value={data.shortBio || ""}
          onChange={(e) => handleInputChange("shortBio", e.target.value)}
          className={isExtracted("shortBio") ? "border-blue-300 bg-blue-50" : ""}
          rows={3}
        />
        <p className="text-sm text-gray-500">This will appear as your main headline. Keep it concise and impactful.</p>
      </div>

      {isReviewMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Fields highlighted in blue were automatically extracted from your resume. You can
              edit any information above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
