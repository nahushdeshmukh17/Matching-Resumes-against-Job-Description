const ResumeProfile = require('../models/ResumeProfile');

class ResumeProcessor {
  
  async processAndStore(userId, filename, rawText) {
    try {
      const extractedData = this.extractStructuredData(rawText);
      
      const resumeProfile = await ResumeProfile.findOneAndUpdate(
        { userId },
        {
          filename,
          rawText,
          processedText: this.cleanText(rawText),
          ...extractedData,
          processingStatus: 'completed',
          lastProcessed: new Date(),
          $inc: { version: 1 }
        },
        { 
          upsert: true, 
          new: true,
          setDefaultsOnInsert: true
        }
      );
      
      return resumeProfile;
    } catch (error) {
      console.error('Resume processing error:', error);
      
      await ResumeProfile.findOneAndUpdate(
        { userId },
        { processingStatus: 'failed' }
      );
      
      throw error;
    }
  }
  
  extractStructuredData(text) {
    const lowerText = text.toLowerCase();
    
    return {
      personalInfo: this.extractPersonalInfo(text),
      skills: this.extractSkills(lowerText),
      experience: this.extractExperience(lowerText),
      education: this.extractEducation(lowerText),
      projects: this.extractProjects(lowerText),
      additionalInfo: this.extractAdditionalInfo(lowerText)
    };
  }
  
  extractPersonalInfo(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const linkedinRegex = /linkedin\.com\/in\/[\w-]+/gi;
    const githubRegex = /github\.com\/[\w-]+/gi;
    
    const lines = text.split('\n');
    const firstLine = lines[0] || '';
    
    return {
      name: {
        fullName: this.extractName(firstLine),
        firstName: '',
        lastName: ''
      },
      contact: {
        email: (text.match(emailRegex) || [])[0] || '',
        phone: (text.match(phoneRegex) || [])[0] || '',
        linkedin: (text.match(linkedinRegex) || [])[0] || '',
        github: (text.match(githubRegex) || [])[0] || '',
        address: '',
        city: '',
        state: '',
        country: '',
        portfolio: ''
      }
    };
  }
  
  extractName(firstLine) {
    const cleanLine = firstLine.replace(/[^\w\s]/g, '').trim();
    const words = cleanLine.split(/\s+/);
    return words.length >= 2 ? words.slice(0, 2).join(' ') : cleanLine;
  }
  
  extractSkills(text) {
    const technicalSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue.js',
      'html', 'css', 'mongodb', 'mysql', 'postgresql', 'aws', 'docker',
      'kubernetes', 'git', 'typescript', 'php', 'ruby', 'go', 'rust'
    ];
    
    const tools = [
      'visual studio code', 'intellij', 'eclipse', 'postman', 'jira',
      'slack', 'trello', 'figma', 'photoshop', 'illustrator'
    ];
    
    const foundTechnical = technicalSkills.filter(skill => 
      text.includes(skill) || text.includes(skill.replace('.', ''))
    );
    
    const foundTools = tools.filter(tool => text.includes(tool));
    
    return {
      technical: foundTechnical,
      soft: this.extractSoftSkills(text),
      tools: foundTools,
      certifications: this.extractCertifications(text)
    };
  }
  
  extractSoftSkills(text) {
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem solving',
      'analytical', 'creative', 'adaptable', 'organized', 'detail-oriented'
    ];
    
    return softSkills.filter(skill => text.includes(skill));
  }
  
  extractCertifications(text) {
    const certKeywords = ['certified', 'certification', 'certificate'];
    const lines = text.split('\n');
    
    return lines.filter(line => 
      certKeywords.some(keyword => line.toLowerCase().includes(keyword))
    ).slice(0, 5);
  }
  
  extractExperience(text) {
    const yearMatches = text.match(/(\d+)\s*(?:years?|yrs?)/gi) || [];
    const totalYears = yearMatches.length > 0 ? 
      Math.max(...yearMatches.map(match => parseInt(match.match(/\d+/)[0]))) : 0;
    
    return {
      totalYears,
      positions: this.extractPositions(text)
    };
  }
  
  extractPositions(text) {
    const jobTitles = [
      'software engineer', 'developer', 'programmer', 'analyst',
      'manager', 'lead', 'senior', 'junior', 'intern'
    ];
    
    const lines = text.split('\n');
    const positions = [];
    
    lines.forEach(line => {
      if (jobTitles.some(title => line.toLowerCase().includes(title))) {
        positions.push({
          title: line.trim(),
          company: '',
          duration: '',
          description: '',
          technologies: [],
          achievements: []
        });
      }
    });
    
    return positions.slice(0, 5);
  }
  
  extractEducation(text) {
    const degrees = ['bachelor', 'master', 'phd', 'diploma', 'certificate'];
    const lines = text.split('\n');
    const education = [];
    
    lines.forEach(line => {
      if (degrees.some(degree => line.toLowerCase().includes(degree))) {
        education.push({
          degree: line.trim(),
          field: '',
          institution: '',
          graduationYear: '',
          gpa: '',
          honors: '',
          relevantCourses: []
        });
      }
    });
    
    return education.slice(0, 3);
  }
  
  extractProjects(text) {
    const projectKeywords = ['project', 'built', 'developed', 'created'];
    const lines = text.split('\n');
    const projects = [];
    
    lines.forEach(line => {
      if (projectKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
        projects.push({
          name: line.trim(),
          description: '',
          technologies: [],
          duration: '',
          role: '',
          achievements: [],
          links: {
            github: '',
            demo: '',
            documentation: ''
          }
        });
      }
    });
    
    return projects.slice(0, 5);
  }
  
  extractAdditionalInfo(text) {
    return {
      summary: this.extractSummary(text),
      languages: this.extractLanguages(text),
      interests: [],
      awards: [],
      publications: [],
      volunteerWork: []
    };
  }
  
  extractSummary(text) {
    const lines = text.split('\n');
    const summaryKeywords = ['summary', 'objective', 'profile'];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (summaryKeywords.some(keyword => line.includes(keyword))) {
        return lines.slice(i + 1, i + 4).join(' ').trim();
      }
    }
    
    return lines.slice(0, 3).join(' ').trim();
  }
  
  extractLanguages(text) {
    const languages = ['english', 'spanish', 'french', 'german', 'chinese', 'japanese'];
    return languages.filter(lang => text.includes(lang));
  }
  
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }
}

module.exports = new ResumeProcessor();