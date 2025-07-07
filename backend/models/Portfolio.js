const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  techStack: [String],
  liveLink: String,
  githubRepo: String,
  screenshots: [String],
  role: String,
  timeline: String,
  isExtracted: Boolean,
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  jobTitle: String,
  companyName: String,
  duration: String,
  responsibilities: String,
  techStack: [String],
  isExtracted: Boolean,
}, { _id: false });

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  duration: String,
  cgpa: String,
  relevantCourses: [String],
  isExtracted: Boolean,
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  // Personal Info
  fullName: String,
  currentRole: String,
  shortBio: String,
  location: String,
  profilePicture: String,
  // Contact Info
  email: String,
  phone: String,
  linkedinUrl: String,
  githubUrl: String,
  twitterUrl: String,
  blogUrl: String,
  whatsappUrl: String,
  telegramUrl: String,
  // About Section
  aboutMe: String,
  careerGoals: String,
  // Skills
  technicalSkills: [String],
  softSkills: [String],
  toolsAndTech: [String],
  // Experience
  experience: [experienceSchema],
  // Education
  education: [educationSchema],
  // Projects
  projects: [projectSchema],
  // Additional Sections
  certifications: [{}],
  awards: [{}],
  blogs: [{}],
  languages: [{}],
  openSource: [{}],
  hobbies: String,
  socialProof: {},
  // Template selection
  template: { type: String, default: 'default' },
  finalized: { type: Boolean, default: false },
  // Timestamp
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Portfolio', portfolioSchema); 