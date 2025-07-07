const express = require('express');
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Portfolio templates
const templates = {
  modern: {
    name: 'Modern',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#60a5fa',
      background: '#ffffff',
      text: '#1f2937'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    }
  },
  creative: {
    name: 'Creative',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      background: '#faf5ff',
      text: '#374151'
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Open Sans, sans-serif'
    }
  },
  minimal: {
    name: 'Minimal',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#ffffff',
      text: '#111827'
    },
    fonts: {
      heading: 'Roboto, sans-serif',
      body: 'Roboto, sans-serif'
    }
  },
  tech: {
    name: 'Tech',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      background: '#0f172a',
      text: '#f8fafc'
    },
    fonts: {
      heading: 'JetBrains Mono, monospace',
      body: 'Source Code Pro, monospace'
    }
  }
};

// Generate HTML for portfolio
function generatePortfolioHTML(data, templateName) {
  const template = templates[templateName] || templates.modern;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500;600&family=Open+Sans:wght@300;400;500;600;700&family=Source+Code+Pro:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary-color: ${template.colors.primary};
            --secondary-color: ${template.colors.secondary};
            --accent-color: ${template.colors.accent};
            --background-color: ${template.colors.background};
            --text-color: ${template.colors.text};
            --heading-font: ${template.fonts.heading};
            --body-font: ${template.fonts.body};
        }
        
        body {
            font-family: var(--body-font);
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--background-color);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 80px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }
        
        .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin: 0 auto 20px;
            background: var(--accent-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
            font-weight: bold;
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            font-family: var(--heading-font);
            font-size: 3rem;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .header .subtitle {
            font-size: 1.5rem;
            margin-bottom: 20px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .header .bio {
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto;
            opacity: 0.8;
            position: relative;
            z-index: 1;
        }
        
        /* Navigation */
        .nav {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 15px 0;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .nav ul {
            list-style: none;
            display: flex;
            justify-content: center;
            gap: 30px;
        }
        
        .nav a {
            text-decoration: none;
            color: var(--text-color);
            font-weight: 500;
            padding: 10px 20px;
            border-radius: 25px;
            transition: all 0.3s ease;
        }
        
        .nav a:hover {
            background: var(--primary-color);
            color: white;
            transform: translateY(-2px);
        }
        
        /* Sections */
        .section {
            padding: 80px 0;
        }
        
        .section:nth-child(even) {
            background: ${template.colors.background === '#ffffff' ? '#f8fafc' : 'rgba(255, 255, 255, 0.05)'};
        }
        
        .section-title {
            font-family: var(--heading-font);
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 50px;
            color: var(--primary-color);
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: var(--accent-color);
            border-radius: 2px;
        }
        
        /* About Section */
        .about-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.8;
        }
        
        /* Skills Section */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
            margin-top: 40px;
        }
        
        .skill-category {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        
        .skill-category:hover {
            transform: translateY(-5px);
        }
        
        .skill-category h3 {
            font-family: var(--heading-font);
            color: var(--primary-color);
            margin-bottom: 20px;
            font-size: 1.3rem;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .skill-tag {
            background: var(--primary-color);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        /* Projects Section */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        
        .project-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        
        .project-card:hover {
            transform: translateY(-5px);
        }
        
        .project-header {
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            color: white;
            padding: 20px;
        }
        
        .project-title {
            font-family: var(--heading-font);
            font-size: 1.3rem;
            margin-bottom: 10px;
        }
        
        .project-content {
            padding: 20px;
        }
        
        .project-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 15px 0;
        }
        
        .tech-tag {
            background: var(--accent-color);
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8rem;
        }
        
        .project-links {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .project-link {
            background: var(--primary-color);
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.9rem;
            transition: background 0.3s ease;
        }
        
        .project-link:hover {
            background: var(--secondary-color);
        }
        
        /* Experience Section */
        .experience-timeline {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
        }
        
        .experience-timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--accent-color);
            transform: translateX(-50%);
        }
        
        .experience-item {
            background: white;
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            position: relative;
            width: calc(50% - 30px);
        }
        
        .experience-item:nth-child(odd) {
            margin-left: 0;
        }
        
        .experience-item:nth-child(even) {
            margin-left: calc(50% + 30px);
        }
        
        .experience-item::before {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            border-radius: 50%;
            top: 30px;
        }
        
        .experience-item:nth-child(odd)::before {
            right: -40px;
        }
        
        .experience-item:nth-child(even)::before {
            left: -40px;
        }
        
        .experience-title {
            font-family: var(--heading-font);
            color: var(--primary-color);
            font-size: 1.3rem;
            margin-bottom: 5px;
        }
        
        .experience-company {
            font-weight: 600;
            color: var(--secondary-color);
            margin-bottom: 5px;
        }
        
        .experience-duration {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 15px;
        }
        
        /* Education Section */
        .education-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        
        .education-card {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .education-card:hover {
            transform: translateY(-5px);
        }
        
        .education-degree {
            font-family: var(--heading-font);
            color: var(--primary-color);
            font-size: 1.3rem;
            margin-bottom: 10px;
        }
        
        .education-institution {
            font-weight: 600;
            color: var(--secondary-color);
            margin-bottom: 10px;
        }
        
        /* Contact Section */
        .contact-content {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        }
        
        .contact-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        
        .contact-link {
            background: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .contact-link:hover {
            background: var(--secondary-color);
            transform: translateY(-2px);
        }
        
        /* Footer */
        .footer {
            background: var(--text-color);
            color: white;
            text-align: center;
            padding: 40px 0;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .header .subtitle {
                font-size: 1.2rem;
            }
            
            .nav ul {
                flex-direction: column;
                gap: 10px;
            }
            
            .section-title {
                font-size: 2rem;
            }
            
            .experience-timeline::before {
                left: 20px;
            }
            
            .experience-item {
                width: calc(100% - 60px);
                margin-left: 60px !important;
            }
            
            .experience-item::before {
                left: -40px !important;
            }
            
            .skills-grid,
            .projects-grid,
            .education-grid {
                grid-template-columns: 1fr;
            }
        }
        
        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .section {
            animation: fadeInUp 0.6s ease-out;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="profile-img">
                ${data.fullName ? data.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1>${data.fullName || 'Your Name'}</h1>
            <p class="subtitle">${data.currentRole || 'Professional Title'}</p>
            <p class="bio">${data.shortBio || 'Your professional bio goes here'}</p>
        </div>
    </header>

    <!-- Navigation -->
    <nav class="nav">
        <div class="container">
            <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#education">Education</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <!-- About Section -->
    <section id="about" class="section">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <p>${data.aboutMe || 'Tell us about yourself, your background, and what drives you as a professional.'}</p>
                ${data.careerGoals ? `<p style="margin-top: 20px;"><strong>Career Goals:</strong> ${data.careerGoals}</p>` : ''}
            </div>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="section">
        <div class="container">
            <h2 class="section-title">Skills & Expertise</h2>
            <div class="skills-grid">
                ${data.technicalSkills && data.technicalSkills.length > 0 ? `
                <div class="skill-category">
                    <h3>Technical Skills</h3>
                    <div class="skills-list">
                        ${data.technicalSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${data.softSkills && data.softSkills.length > 0 ? `
                <div class="skill-category">
                    <h3>Soft Skills</h3>
                    <div class="skills-list">
                        ${data.softSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${data.toolsAndTech && data.toolsAndTech.length > 0 ? `
                <div class="skill-category">
                    <h3>Tools & Technologies</h3>
                    <div class="skills-list">
                        ${data.toolsAndTech.map(tool => `<span class="skill-tag">${tool}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="section">
        <div class="container">
            <h2 class="section-title">Projects</h2>
            <div class="projects-grid">
                ${data.projects && data.projects.length > 0 ? data.projects.map(project => `
                <div class="project-card">
                    <div class="project-header">
                        <h3 class="project-title">${project.name || 'Project Name'}</h3>
                        ${project.role ? `<p>Role: ${project.role}</p>` : ''}
                        ${project.timeline ? `<p>Timeline: ${project.timeline}</p>` : ''}
                    </div>
                    <div class="project-content">
                        <p>${project.description || 'Project description goes here'}</p>
                        ${project.techStack && project.techStack.length > 0 ? `
                        <div class="project-tech">
                            ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                        ` : ''}
                        <div class="project-links">
                            ${project.githubRepo ? `<a href="${project.githubRepo}" class="project-link" target="_blank">GitHub</a>` : ''}
                            ${project.liveLink ? `<a href="${project.liveLink}" class="project-link" target="_blank">Live Demo</a>` : ''}
                        </div>
                    </div>
                </div>
                `).join('') : '<p style="text-align: center; color: #666;">No projects added yet.</p>'}
            </div>
        </div>
    </section>

    <!-- Experience Section -->
    <section id="experience" class="section">
        <div class="container">
            <h2 class="section-title">Work Experience</h2>
            <div class="experience-timeline">
                ${data.experience && data.experience.length > 0 ? data.experience.map(exp => `
                <div class="experience-item">
                    <h3 class="experience-title">${exp.jobTitle || 'Job Title'}</h3>
                    <p class="experience-company">${exp.companyName || 'Company Name'}</p>
                    <p class="experience-duration">${exp.duration || 'Duration'}</p>
                    <p>${exp.responsibilities || 'Job responsibilities and achievements'}</p>
                    ${exp.techStack && exp.techStack.length > 0 ? `
                    <div class="project-tech" style="margin-top: 15px;">
                        ${exp.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    ` : ''}
                </div>
                `).join('') : '<p style="text-align: center; color: #666;">No work experience added yet.</p>'}
            </div>
        </div>
    </section>

    <!-- Education Section -->
    <section id="education" class="section">
        <div class="container">
            <h2 class="section-title">Education</h2>
            <div class="education-grid">
                ${data.education && data.education.length > 0 ? data.education.map(edu => `
                <div class="education-card">
                    <h3 class="education-degree">${edu.degree || 'Degree/Program'}</h3>
                    <p class="education-institution">${edu.institution || 'Institution Name'}</p>
                    <p class="education-duration">${edu.duration || 'Duration'}</p>
                    ${edu.cgpa ? `<p><strong>CGPA:</strong> ${edu.cgpa}</p>` : ''}
                    ${edu.relevantCourses && edu.relevantCourses.length > 0 ? `
                    <div class="project-tech" style="margin-top: 15px;">
                        ${edu.relevantCourses.map(course => `<span class="tech-tag">${course}</span>`).join('')}
                    </div>
                    ` : ''}
                </div>
                `).join('') : '<p style="text-align: center; color: #666;">No education information added yet.</p>'}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="section">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <p>Let's connect and discuss opportunities!</p>
                ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
                <div class="contact-links">
                    ${data.email ? `<a href="mailto:${data.email}" class="contact-link">📧 Email</a>` : ''}
                    ${data.phone ? `<a href="tel:${data.phone}" class="contact-link">📞 Phone</a>` : ''}
                    ${data.linkedinUrl ? `<a href="${data.linkedinUrl}" class="contact-link" target="_blank">💼 LinkedIn</a>` : ''}
                    ${data.githubUrl ? `<a href="${data.githubUrl}" class="contact-link" target="_blank">🐙 GitHub</a>` : ''}
                    ${data.twitterUrl ? `<a href="${data.twitterUrl}" class="contact-link" target="_blank">🐦 Twitter</a>` : ''}
                    ${data.blogUrl ? `<a href="${data.blogUrl}" class="contact-link" target="_blank">🌐 Website</a>` : ''}
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${data.fullName || 'Your Name'}. All rights reserved.</p>
            <p>Built with AutoFolio</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Add scroll effect to navigation
        window.addEventListener('scroll', function() {
            const nav = document.querySelector('.nav');
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });
    </script>
</body>
</html>
  `;
}

// Generate portfolio
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { portfolioData, template = 'modern' } = req.body;
    
    if (!portfolioData) {
      return res.status(400).json({ error: 'Portfolio data is required' });
    }

    // Generate HTML
    const html = generatePortfolioHTML(portfolioData, template);
    
    // Create portfolios directory if it doesn't exist
    const portfoliosDir = path.join(__dirname, '../generated-portfolios');
    if (!fs.existsSync(portfoliosDir)) {
      fs.mkdirSync(portfoliosDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `portfolio-${req.userId}-${timestamp}.html`;
    const filePath = path.join(portfoliosDir, filename);

    // Write HTML file
    fs.writeFileSync(filePath, html);

    // Return the file path and preview URL
    const previewUrl = `/api/portfolio-generator/preview/${filename}`;
    
    res.json({
      success: true,
      filename,
      previewUrl,
      downloadUrl: `/api/portfolio-generator/download/${filename}`,
      message: 'Portfolio generated successfully!'
    });

  } catch (error) {
    console.error('Portfolio generation error:', error);
    res.status(500).json({ error: 'Failed to generate portfolio' });
  }
});

// Preview generated portfolio
router.get('/preview/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../generated-portfolios', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const html = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'Failed to preview portfolio' });
  }
});

// Download generated portfolio
router.get('/download/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../generated-portfolios', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.download(filePath, `portfolio.html`);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download portfolio' });
  }
});

// Get available templates
router.get('/templates', (req, res) => {
  res.json({
    templates: Object.keys(templates).map(key => ({
      id: key,
      name: templates[key].name,
      colors: templates[key].colors
    }))
  });
});

module.exports = router;