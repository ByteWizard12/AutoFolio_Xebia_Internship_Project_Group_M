"use client"

import { useState } from "react"

export function useResumeUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [extractedData, setExtractedData] = useState(null)

  const uploadResume = async (file) => {
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("resume", file)

      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Upload failed")
      }

      const result = await response.json()
      setExtractedData(result.data)
      return result.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const reset = () => {
    setError(null)
    setExtractedData(null)
    setIsUploading(false)
  }

  return {
    uploadResume,
    isUploading,
    error,
    extractedData,
    reset,
  }
}
