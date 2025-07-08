// Utility functions to pre-fill form data with extracted resume information

export function preFillPersonalInfo(extractedData) {
  const { personalInfo } = extractedData

  return {
    firstName: personalInfo?.name?.split(" ")[0] || "",
    lastName: personalInfo?.name?.split(" ").slice(1).join(" ") || "",
    email: personalInfo?.email || "",
    phone: personalInfo?.phone || "",
    linkedin: personalInfo?.linkedin || "",
    github: personalInfo?.github || "",
    website: personalInfo?.website || "",
  }
}

export function preFillContactInfo(extractedData) {
  const { personalInfo } = extractedData

  return {
    email: personalInfo?.email || "",
    phone: personalInfo?.phone || "",
    linkedin: personalInfo?.linkedin || "",
    github: personalInfo?.github || "",
    website: personalInfo?.website || "",
    location: "", // This would need to be extracted separately
  }
}

export function preFillSkills(extractedData) {
  const { skills } = extractedData

  if (!skills || skills.length === 0) {
    return {
      technicalSkills: [],
      softSkills: [],
      tools: [],
      languages: [],
    }
  }

  // Categorize skills (basic categorization)
  const technicalKeywords = ["JavaScript", "Python", "React", "Node.js", "HTML", "CSS", "Java", "C++", "SQL"]
  const toolKeywords = ["Git", "Docker", "AWS", "Figma", "Photoshop", "VS Code"]
  const softSkillKeywords = ["Leadership", "Communication", "Problem Solving", "Team Work"]

  const technicalSkills = skills.filter((skill) =>
    technicalKeywords.some((keyword) => skill.toLowerCase().includes(keyword.toLowerCase())),
  )

  const tools = skills.filter((skill) =>
    toolKeywords.some((keyword) => skill.toLowerCase().includes(keyword.toLowerCase())),
  )

  const softSkills = skills.filter((skill) =>
    softSkillKeywords.some((keyword) => skill.toLowerCase().includes(keyword.toLowerCase())),
  )

  // Remaining skills go to technical
  const categorizedSkills = [...technicalSkills, ...tools, ...softSkills]
  const remainingSkills = skills.filter((skill) => !categorizedSkills.includes(skill))

  return {
    technicalSkills: [...technicalSkills, ...remainingSkills],
    softSkills: softSkills,
    tools: tools,
    languages: [], // Programming languages would need separate extraction
  }
}

export function preFillExperience(extractedData) {
  const { experience } = extractedData

  if (!experience || experience.length === 0) {
    return []
  }

  return experience.map((exp) => ({
    position: exp.position || "",
    company: exp.company || "",
    duration: exp.duration || "",
    startDate: extractStartDate(exp.duration),
    endDate: extractEndDate(exp.duration),
    description: exp.description || "",
    responsibilities: exp.description ? [exp.description] : [],
    achievements: [],
    technologies: [],
  }))
}

export function preFillEducation(extractedData) {
  const { education } = extractedData

  if (!education || education.length === 0) {
    return []
  }

  return education.map((edu) => ({
    degree: edu.degree || "",
    institution: edu.institution || "",
    year: edu.year || "",
    startYear: "",
    endYear: edu.year || "",
    gpa: "",
    description: "",
    achievements: [],
  }))
}

export function preFillAboutSection(extractedData) {
  const { personalInfo, skills, experience } = extractedData

  // Generate a basic bio based on extracted data
  let bio = ""

  if (personalInfo?.name) {
    bio += `I'm ${personalInfo.name}, `
  }

  if (experience && experience.length > 0) {
    const latestJob = experience[0]
    bio += `a ${latestJob.position || "professional"}`
    if (latestJob.company) {
      bio += ` at ${latestJob.company}`
    }
    bio += ". "
  }

  if (skills && skills.length > 0) {
    const topSkills = skills.slice(0, 5).join(", ")
    bio += `I have experience with ${topSkills} and more. `
  }

  bio += "I'm passionate about creating innovative solutions and contributing to meaningful projects."

  return {
    bio: bio,
    summary: bio,
    objective: "",
    interests: [],
    achievements: [],
  }
}

// Helper functions
function extractStartDate(duration) {
  if (!duration) return ""

  const match = duration.match(/(\d{4})/i)
  return match ? match[1] : ""
}

function extractEndDate(duration) {
  if (!duration) return ""

  if (duration.toLowerCase().includes("present") || duration.toLowerCase().includes("current")) {
    return "Present"
  }

  const matches = duration.match(/(\d{4})/g)
  return matches && matches.length > 1 ? matches[1] : ""
}

// Main function to pre-fill all form data
export function preFillAllData(extractedData, setFormData) {
  

  const personalInfo = preFillPersonalInfo(extractedData)
  const contactInfo = preFillContactInfo(extractedData)
  const skills = preFillSkills(extractedData)
  const experience = preFillExperience(extractedData)
  const education = preFillEducation(extractedData)
  const aboutSection = preFillAboutSection(extractedData)

  // Update form data
  setFormData((prevData) => ({
    ...prevData,
    personalInfo: {
      ...prevData.personalInfo,
      ...personalInfo,
    },
    contactInfo: {
      ...prevData.contactInfo,
      ...contactInfo,
    },
    skills: {
      ...prevData.skills,
      ...skills,
    },
    experience: experience.length > 0 ? experience : prevData.experience,
    education: education.length > 0 ? education : prevData.education,
    about: {
      ...prevData.about,
      ...aboutSection,
    },
    extractedFromResume: {
      extractedAt: extractedData.extractedAt,
      textLength: extractedData.textLength,
      sectionsFound: {
        personalInfo: Object.keys(personalInfo).filter((key) => personalInfo[key]).length,
        skills: skills.technicalSkills.length + skills.softSkills.length + skills.tools.length,
        experience: experience.length,
        education: education.length,
      },
    },
  }))

  
}
