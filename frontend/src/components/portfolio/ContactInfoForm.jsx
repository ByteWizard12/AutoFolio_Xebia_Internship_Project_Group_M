"use client"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import { Mail, Phone, Linkedin, Github, Twitter, Globe, MessageCircle } from "lucide-react"

export function ContactInfoForm({ data, updateData, extractedFields, isReviewMode = false }) {
  const handleInputChange = (field, value) => {
    updateData(field, value)
  }

  const isExtracted = (field) => extractedFields?.has(field)

  const contactFields = [
    {
      key: "email",
      label: "Email",
      placeholder: "john.doe@email.com",
      icon: Mail,
      required: true,
      type: "email",
    },
    {
      key: "phone",
      label: "Phone Number",
      placeholder: "+1 (555) 123-4567",
      icon: Phone,
      required: false,
      type: "tel",
    },
    {
      key: "linkedinUrl",
      label: "LinkedIn Profile",
      placeholder: "https://linkedin.com/in/yourprofile",
      icon: Linkedin,
      required: true,
      type: "url",
    },
    {
      key: "githubUrl",
      label: "GitHub Profile",
      placeholder: "https://github.com/yourusername",
      icon: Github,
      required: true,
      type: "url",
    },
    {
      key: "twitterUrl",
      label: "Twitter Profile",
      placeholder: "https://twitter.com/yourusername",
      icon: Twitter,
      required: false,
      type: "url",
    },
    {
      key: "blogUrl",
      label: "Blog/Website",
      placeholder: "https://yourblog.com",
      icon: Globe,
      required: false,
      type: "url",
    },
    {
      key: "whatsappUrl",
      label: "WhatsApp",
      placeholder: "https://wa.me/1234567890",
      icon: MessageCircle,
      required: false,
      type: "url",
    },
    {
      key: "telegramUrl",
      label: "Telegram",
      placeholder: "https://t.me/yourusername",
      icon: MessageCircle,
      required: false,
      type: "url",
    },
  ]

  return (
    <div className="space-y-6">
      {!isReviewMode && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
          <p className="text-gray-600">How can people reach you?</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {contactFields.map((field) => {
          const IconComponent = field.icon
          return (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {isExtracted(field.key) && (
                  <Badge variant="secondary" className="text-xs">
                    <IconComponent className="w-3 h-3 mr-1" />
                    AI Extracted
                  </Badge>
                )}
              </div>
              <div className="relative">
                <IconComponent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={data[field.key] || ""}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className={`pl-10 ${isExtracted(field.key) ? "border-blue-300 bg-blue-50" : ""}`}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Contact Preferences */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Contact Preferences</h3>
          <p className="text-sm text-gray-600">
            Required fields (Email, LinkedIn, GitHub) will be prominently displayed. Optional fields will be shown as
            social links in your portfolio.
          </p>
        </CardContent>
      </Card>

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
