const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { requireAuth } = require('../middleware/auth');
const nlpMatcher = require('../utils/nlpMatcher');

const router = express.Router();

// Apply to job (applicants only)
router.post('/', 
  requireAuth,
  [
    body('jobId').notEmpty().withMessage('Job ID is required'),
    body('resumeText').notEmpty().withMessage('Resume text is required'),
    body('resumeFileName').notEmpty().withMessage('Resume file name is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      if (req.session.userType !== 'applicant') {
        return res.status(403).json({
          success: false,
          message: 'Only applicants can apply to jobs'
        });
      }

      const { jobId, resumeText, resumeFileName } = req.body;

      // Check if job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Check if already applied
      const existingApplication = await Application.findOne({
        applicantId: req.session.userId,
        jobId
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied to this job'
        });
      }

      // Calculate advanced match score using NLP algorithms
      const matchScore = calculateAdvancedMatchScore(resumeText, job);

      const application = new Application({
        applicantId: req.session.userId,
        jobId,
        resumeText,
        resumeFileName,
        matchScore
      });

      await application.save();

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        application: {
          id: application._id,
          matchScore: application.matchScore,
          status: application.status
        }
      });
    } catch (error) {
      console.error('Application error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while submitting application'
      });
    }
  }
);

// Get user's applications
router.get('/my-applications', requireAuth, async (req, res) => {
  try {
    if (req.session.userType !== 'applicant') {
      return res.status(403).json({
        success: false,
        message: 'Only applicants can view their applications'
      });
    }

    const applications = await Application.find({ applicantId: req.session.userId })
      .populate('jobId', 'title company location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// Advanced NLP-based matching algorithm
function calculateAdvancedMatchScore(resumeText, job) {
  try {
    // Combine job description and skills for comprehensive matching
    const jobText = `${job.description} ${job.skills.join(' ')} ${job.requirements || ''}`;
    
    // Use NLP matcher for advanced analysis
    const nlpResult = nlpMatcher.calculateAdvancedMatch(resumeText, jobText);
    
    // Legacy skills matching for backward compatibility
    const legacySkillsScore = calculateLegacySkillsMatch(resumeText, job.skills);
    
    // Combine NLP results with legacy scoring
    return {
      overall: nlpResult.overallMatch,
      skills: Math.max(legacySkillsScore, nlpResult.skillsMatch),
      experience: extractExperienceScore(resumeText),
      education: extractEducationScore(resumeText),
      keywords: nlpResult.tfidfSimilarity,
      nlpAnalysis: {
        tfidfSimilarity: nlpResult.tfidfSimilarity,
        stringSimilarity: nlpResult.stringSimilarity,
        matchedTerms: nlpResult.matchedTerms,
        analysis: nlpResult.analysis
      }
    };
  } catch (error) {
    console.error('NLP matching failed, falling back to simple matching:', error);
    return calculateSimpleMatchScore(resumeText, job);
  }
}

// Legacy skills matching for comparison
function calculateLegacySkillsMatch(resumeText, jobSkills) {
  const resume = resumeText.toLowerCase();
  const skills = jobSkills.map(skill => skill.toLowerCase());
  
  let matches = 0;
  skills.forEach(skill => {
    if (resume.includes(skill)) matches++;
  });
  
  return skills.length > 0 ? Math.round((matches / skills.length) * 100) : 0;
}

// Extract experience score from resume
function extractExperienceScore(resumeText) {
  const text = resumeText.toLowerCase();
  const experienceKeywords = ['experience', 'years', 'worked', 'employed', 'position'];
  const matches = experienceKeywords.filter(keyword => text.includes(keyword)).length;
  return Math.min(60 + (matches * 10), 100);
}

// Extract education score from resume
function extractEducationScore(resumeText) {
  const text = resumeText.toLowerCase();
  const educationKeywords = ['degree', 'university', 'college', 'bachelor', 'master', 'phd', 'education'];
  const matches = educationKeywords.filter(keyword => text.includes(keyword)).length;
  return Math.min(60 + (matches * 8), 100);
}

// Fallback simple matching (in case NLP fails)
function calculateSimpleMatchScore(resumeText, job) {
  const resume = resumeText.toLowerCase();
  const jobDesc = job.description.toLowerCase();
  const jobSkills = job.skills.map(skill => skill.toLowerCase());
  
  let skillMatches = 0;
  jobSkills.forEach(skill => {
    if (resume.includes(skill)) skillMatches++;
  });
  const skillsScore = jobSkills.length > 0 ? (skillMatches / jobSkills.length) * 100 : 0;
  
  const jobKeywords = jobDesc.split(' ').filter(word => word.length > 3);
  let keywordMatches = 0;
  jobKeywords.forEach(keyword => {
    if (resume.includes(keyword)) keywordMatches++;
  });
  const keywordsScore = jobKeywords.length > 0 ? (keywordMatches / jobKeywords.length) * 100 : 0;
  
  const experienceScore = resume.includes('experience') ? 80 : 60;
  const educationScore = resume.includes('degree') ? 85 : 70;
  
  const overall = Math.round(
    (skillsScore * 0.4) + (keywordsScore * 0.3) + (experienceScore * 0.2) + (educationScore * 0.1)
  );
  
  return {
    overall: Math.min(overall, 100),
    skills: Math.round(skillsScore),
    experience: Math.round(experienceScore),
    education: Math.round(educationScore),
    keywords: Math.round(keywordsScore)
  };
}

module.exports = router;