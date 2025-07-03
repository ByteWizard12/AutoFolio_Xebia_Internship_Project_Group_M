const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

async function extractWithAffinda(pdfPath) {
  const apiKey = process.env.RESUME_PARSER;
  const file = fs.createReadStream(pdfPath);
  const formData = new require('form-data')();
  formData.append('file', file);
  try {
    const response = await axios.post(
      'https://api.affinda.com/v2/resumes',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    return { error: err.response?.data || err.message };
  }
}

// Replace Hugging Face About Me generation with Cohere
async function generateAboutMeWithCohere(prompt) {
  const apiKey = process.env.cohere_API_KEY;
  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt: prompt,
        max_tokens: 120,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
    return response.data.generations[0].text.trim();
  } catch (err) {
    console.error('Cohere API error:', err.response?.data || err.message);
    return '';
  }
}

router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type' });
  }
  try {
    // Call Affinda API
    const affindaData = await extractWithAffinda(req.file.path);
    const extracted = affindaData.data || {};
    let aboutMe = extracted.summary || extracted.objective || extracted.aboutMe || "";
    let huggingFaceError = null;
    // If About Me is missing, try to generate it using Cohere
    if (!aboutMe) {
      // Build a focused prompt for Cohere
      let prompt = `Generate a professional About Me section for a portfolio website using the following details in 2-3 paragraphs\n`;
      if (extracted.name?.raw) prompt += `Name: ${extracted.name.raw}\n`;
      if (extracted.profession) prompt += `Profession: ${extracted.profession}\n`;
      if (Array.isArray(extracted.education) && extracted.education.length > 0) {
        prompt += `Education: ` + extracted.education.map(e => `${e.accreditation?.inputStr || e.accreditation?.education || ''} at ${e.organization}`).join('; ') + '\n';
      }
      if (Array.isArray(extracted.workExperience) && extracted.workExperience.length > 0) {
        prompt += `Experience: ` + extracted.workExperience.map(w => `${w.jobTitle} at ${w.organization}`).join('; ') + '\n';
      }
      if (Array.isArray(extracted.skills) && extracted.skills.length > 0) {
        prompt += `Skills: ` + extracted.skills.map(s => s.name).join(', ') + '\n';
      }
      prompt += 'Write in first person, 2-3 sentences.';
      // Limit input length for Cohere API
      prompt = prompt.slice(0, 1000);
      try {
        aboutMe = await generateAboutMeWithCohere(prompt);
        if (!aboutMe || aboutMe.trim() === "") {
          aboutMe = "I'm a passionate and driven professional eager to make an impact in my field.";
        }
      } catch (err) {
        huggingFaceError = err.message || 'Cohere API failed';
        aboutMe = "I'm a passionate and driven professional eager to make an impact in my field.";
      }
    }
    // Add aboutMe to the extracted details
    extracted.aboutMe = aboutMe;
    // Send all extracted fields, and a warning if Cohere failed
    res.json({ filePath: `/uploads/${req.file.filename}`, extractedDetails: extracted, affindaRaw: affindaData, huggingFaceError });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process resume', details: err.message });
  }
});

// Add a new endpoint for About Me generation only
router.post('/generate-about-me', async (req, res) => {
  try {
    const extracted = req.body.extractedData || {};
    let aboutMe = extracted.summary || extracted.objective || extracted.aboutMe || "";
    let cohereError = null;
    if (!aboutMe) {
      let prompt = `Generate a professional About Me section for a portfolio website using the following details.\n`;
      if (extracted.name?.raw) prompt += `Name: ${extracted.name.raw}\n`;
      if (extracted.profession) prompt += `Profession: ${extracted.profession}\n`;
      if (Array.isArray(extracted.education) && extracted.education.length > 0) {
        prompt += `Education: ` + extracted.education.map(e => `${e.accreditation?.inputStr || e.accreditation?.education || ''} at ${e.organization}`).join('; ') + '\n';
      }
      if (Array.isArray(extracted.workExperience) && extracted.workExperience.length > 0) {
        prompt += `Experience: ` + extracted.workExperience.map(w => `${w.jobTitle} at ${w.organization}`).join('; ') + '\n';
      }
      if (Array.isArray(extracted.skills) && extracted.skills.length > 0) {
        prompt += `Skills: ` + extracted.skills.map(s => s.name).join(', ') + '\n';
      }
      prompt += 'Write in first person, 2-3 sentences.';
      prompt = prompt.slice(0, 1000);
      try {
        aboutMe = await generateAboutMeWithCohere(prompt);
        if (!aboutMe || aboutMe.trim() === "") {
          aboutMe = "I'm a passionate and driven professional eager to make an impact in my field.";
        }
      } catch (err) {
        cohereError = err.message || 'Cohere API failed';
        aboutMe = "I'm a passionate and driven professional eager to make an impact in my field.";
      }
    }
    res.json({ aboutMe, cohereError });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate About Me', details: err.message });
  }
});

module.exports = router; 