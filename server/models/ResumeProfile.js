const mongoose = require('mongoose');

const resumeProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One profile per user
  },
  filename: {
    type: String,
    required: true
  },
  rawText: {
    type: String,
    required: true
  },
  processedText: {
    type: String
  },
  
  // Extracted Personal Information
  personalInfo: {
    name: {
      firstName: String,
      lastName: String,
      fullName: String
    },
    contact: {
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      country: String,
      linkedin: String,
      github: String,
      portfolio: String
    }
  },
  
  // Skills and Technologies
  skills: {
    technical: [String],      // Programming languages, frameworks
    soft: [String],          // Communication, leadership, etc.
    tools: [String],         // Software, platforms
    certifications: [String] // Certificates, licenses
  },
  
  // Work Experience
  experience: {
    totalYears: Number,
    positions: [{
      title: String,
      company: String,
      duration: String,
      startDate: String,
      endDate: String,
      description: String,
      technologies: [String],
      achievements: [String]
    }]
  },
  
  // Education Background
  education: [{
    degree: String,
    field: String,
    institution: String,
    graduationYear: String,
    gpa: String,
    honors: String,
    relevantCourses: [String]
  }],
  
  // Projects
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    duration: String,
    role: String,
    achievements: [String],
    links: {
      github: String,
      demo: String,
      documentation: String
    }
  }],
  
  // Additional Information
  additionalInfo: {
    summary: String,
    languages: [String],
    interests: [String],
    awards: [String],
    publications: [String],
    volunteerWork: [String]
  },
  
  // Processing Metadata
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  lastProcessed: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index for faster queries
resumeProfileSchema.index({ userId: 1 });
resumeProfileSchema.index({ 'skills.technical': 1 });
resumeProfileSchema.index({ 'experience.totalYears': 1 });

module.exports = mongoose.model('ResumeProfile', resumeProfileSchema);