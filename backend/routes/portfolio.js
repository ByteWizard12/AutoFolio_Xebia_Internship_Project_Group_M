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

router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type' });
  }
  try {
    // Call Affinda API
    const affindaData = await extractWithAffinda(req.file.path);
    console.log('Affinda full response:', JSON.stringify(affindaData, null, 2));
    console.log('Affinda extracted details:', JSON.stringify(affindaData.data, null, 2));
    res.json({ filePath: `/uploads/${req.file.filename}`, extractedDetails: affindaData.data || {}, affindaRaw: affindaData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process resume', details: err.message });
  }
});

module.exports = router; 