import { pdfjsLib } from "./pdfSetup"
import mammoth from "mammoth"

/**
 * Extract text from PDF files using PDF.js
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ""

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      // Combine text items with proper spacing
      const pageText = textContent.items
        .map((item) => item.str)
        .join(" ")
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()

      fullText += pageText + "\n\n"
    }

    return fullText.trim()
  } catch (error) {
    console.error("PDF text extraction error:", error)
    throw new Error("Failed to extract text from PDF. The file might be corrupted or password-protected.")
  }
}

/**
 * Extract text from Word documents using Mammoth.js
 */
export async function extractTextFromWord(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })

    if (result.messages && result.messages.length > 0) {
      console.warn("Word extraction warnings:", result.messages)
    }

    return result.value.trim()
  } catch (error) {
    console.error("Word text extraction error:", error)
    throw new Error(
      "Failed to extract text from Word document. The file might be corrupted or in an unsupported format.",
    )
  }
}

/**
 * Extract text from plain text files
 */
export async function extractTextFromPlainText(file) {
  try {
    const text = await file.text()
    return text.trim()
  } catch (error) {
    console.error("Text file extraction error:", error)
    throw new Error("Failed to read text file.")
  }
}

/**
 * Main text extraction function that handles different file types
 */
export async function extractTextFromFile(file) {
  const fileType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()

  try {
    // PDF files
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return await extractTextFromPDF(file)
    }

    // Word documents
    if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword" ||
      fileName.endsWith(".docx") ||
      fileName.endsWith(".doc")
    ) {
      return await extractTextFromWord(file)
    }

    // Plain text files
    if (fileType === "text/plain" || fileName.endsWith(".txt") || fileName.endsWith(".rtf")) {
      return await extractTextFromPlainText(file)
    }

    throw new Error(`Unsupported file type: ${fileType}`)
  } catch (error) {
    console.error("Text extraction failed:", error)
    throw error
  }
}

/**
 * Validate file before processing
 */
export function validateResumeFile(file) {
  const validTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]

  const validExtensions = [".pdf", ".doc", ".docx", ".txt", ".rtf"]
  const maxSize = 10 * 1024 * 1024 // 10MB

  // Check file type
  const isValidType =
    validTypes.includes(file.type) || validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

  if (!isValidType) {
    throw new Error("Please upload a PDF, DOC, DOCX, or TXT file")
  }

  // Check file size
  if (file.size > maxSize) {
    throw new Error("File size must be less than 10MB")
  }

  // Check if file is empty
  if (file.size === 0) {
    throw new Error("File appears to be empty")
  }

  return true
}

/**
 * Clean and normalize extracted text
 */
export function cleanExtractedText(text) {
  return (
    text
      // Remove excessive whitespace
      .replace(/\s+/g, " ")
      // Remove special characters that might interfere with parsing
      .replace(/[^\w\s@.,;:()\-+#/]/g, " ")
      // Normalize line breaks
      .replace(/\n\s*\n/g, "\n\n")
      // Trim
      .trim()
  )
}
