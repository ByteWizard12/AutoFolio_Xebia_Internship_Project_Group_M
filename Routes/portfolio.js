require('dotenv').config();
const express = require("express");
const Router = express.Router;
const multer = require("multer");
const { z } = require("zod");
const { resumeModel, portfolioModel } = require("../db");
const { authenticateUser } = require("../middlewares/userMiddleware");

const portfolioRouter = Router();

// Configure multer for file upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// Upload resume
portfolioRouter.post("/upload-resume", authenticateUser, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const { originalname, buffer, size, mimetype } = req.file;
        const userId = req.user.id;

        // Generate unique filename
        const fileName = `${Date.now()}-${originalname}`;

        // Save resume to database
        const resume = await resumeModel.create({
            userId: userId,
            originalName: originalname,
            fileName: fileName,
            fileData: buffer,
            fileSize: size,
            mimeType: mimetype
        });

        res.status(201).json({
            message: "Resume uploaded successfully",
            resumeId: resume._id,
            fileName: fileName
        });

    } catch (error) {
        console.error("Error uploading resume:", error);
        res.status(500).json({
            message: "Error uploading resume",
            error: error.message
        });
    }
});

// Get resume by ID
portfolioRouter.get("/resume/:id", authenticateUser, async (req, res) => {
    try {
        const resume = await resumeModel.findById(req.params.id);
        
        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        // Check if user owns this resume
        if (resume.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        res.set('Content-Type', resume.mimeType);
        res.set('Content-Disposition', `inline; filename="${resume.originalName}"`);
        res.send(resume.fileData);

    } catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).json({
            message: "Error fetching resume",
            error: error.message
        });
    }
});

// Get user's resumes
portfolioRouter.get("/resumes", authenticateUser, async (req, res) => {
    try {
        const resumes = await resumeModel.find({ userId: req.user.id })
            .select('originalName fileName fileSize uploadedAt')
            .sort({ uploadedAt: -1 });

        res.json({
            resumes: resumes
        });

    } catch (error) {
        console.error("Error fetching resumes:", error);
        res.status(500).json({
            message: "Error fetching resumes",
            error: error.message
        });
    }
});

// Create portfolio
portfolioRouter.post("/create", authenticateUser, async (req, res) => {
    try {
        const { name, template, resumeId } = req.body;

        const portfolioData = {
            userId: req.user.id,
            name: name,
            template: template
        };

        if (resumeId) {
            portfolioData.resumeId = resumeId;
        }

        const portfolio = await portfolioModel.create(portfolioData);

        res.status(201).json({
            message: "Portfolio created successfully",
            portfolioId: portfolio._id
        });

    } catch (error) {
        console.error("Error creating portfolio:", error);
        res.status(500).json({
            message: "Error creating portfolio",
            error: error.message
        });
    }
});

// Get user's portfolios
portfolioRouter.get("/portfolios", authenticateUser, async (req, res) => {
    try {
        const portfolios = await portfolioModel.find({ userId: req.user.id })
            .populate('resumeId', 'originalName')
            .sort({ createdAt: -1 });

        res.json({
            portfolios: portfolios
        });

    } catch (error) {
        console.error("Error fetching portfolios:", error);
        res.status(500).json({
            message: "Error fetching portfolios",
            error: error.message
        });
    }
});

module.exports = {
    portfolioRouter
}; 