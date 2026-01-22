import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import MatchAnalysis from '../components/MatchAnalysis';
import ResumeRecommendations from '../components/ResumeRecommendations';
import apiService from '../services/api';

const ApplicantDashboard = () => {
  const [uploadedResume, setUploadedResume] = useState(() => {
    const saved = localStorage.getItem('uploadedResume');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedJob, setSelectedJob] = useState(() => {
    const saved = localStorage.getItem('selectedJob');
    return saved ? JSON.parse(saved) : null;
  });
  const [matchData, setMatchData] = useState(() => {
    const saved = localStorage.getItem('matchData');
    return saved ? JSON.parse(saved) : null;
  });
  const [recommendations, setRecommendations] = useState(() => {
    const saved = localStorage.getItem('recommendations');
    return saved ? JSON.parse(saved) : null;
  });
  const [jobs, setJobs] = useState([]);

  // Fetch real jobs from API
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/jobs');
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs.map(job => ({
          id: job._id,
          title: job.title,
          company: job.company,
          description: job.description,
          skills: job.skills,
          experience: job.experience,
          location: job.location,
          postedDate: new Date(job.createdAt).toLocaleDateString()
        })));
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    
    if (file && allowedTypes.includes(file.type)) {
      try {
        // Extract text from resume
        const response = await apiService.extractResumeText(file);
        
        if (response.success) {
          const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            extractedText: response.text
          };
          
          setUploadedResume(fileData);
          localStorage.setItem('uploadedResume', JSON.stringify(fileData));
          
          alert('Resume uploaded and processed successfully!');
        }
      } catch (error) {
        console.error('Resume processing error:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        alert('Error processing resume: ' + error.message);
      }
    } else {
      alert('Please upload a PDF, DOCX, or image file');
    }
  };

  const handleJobApply = async (job) => {
    if (!uploadedResume) {
      alert('Please upload your resume first');
      return;
    }

    if (!uploadedResume.extractedText) {
      alert('Resume text not extracted. Please re-upload your resume.');
      return;
    }

    try {
      setSelectedJob(job);
      localStorage.setItem('selectedJob', JSON.stringify(job));
      
      // Apply to job with extracted text
      const response = await apiService.applyToJob(job.id, uploadedResume.extractedText, uploadedResume.name);
      
      if (response.success) {
        // Set match data from response
        const matchData = {
          overallMatch: response.application.matchScore.overall,
          breakdown: {
            skills: {
              score: response.application.matchScore.skills,
              details: { matched: [], missing: [] }
            },
            experience: {
              score: response.application.matchScore.experience,
              details: { candidateYears: 0, requiredYears: 0 }
            },
            education: {
              score: response.application.matchScore.education,
              details: { match: 'Education analysis completed' }
            },
            keywords: {
              score: response.application.matchScore.keywords,
              details: {}
            }
          }
        };
        
        setMatchData(matchData);
        localStorage.setItem('matchData', JSON.stringify(matchData));
        
        // Generate recommendations based on match score
        const recommendations = generateRecommendations(response.application.matchScore);
        setRecommendations(recommendations);
        localStorage.setItem('recommendations', JSON.stringify(recommendations));
        
        alert(`Application submitted successfully! Match score: ${response.application.matchScore.overall}%`);
      }
    } catch (error) {
      if (error.message.includes('already applied')) {
        alert('You have already applied to this job!');
      } else {
        console.error('Application error:', error);
        alert('Error submitting application. Please try again.');
      }
    }
  };
  
  const generateRecommendations = (matchScore) => {
    const recommendations = [];
    
    if (matchScore.skills < 70) {
      recommendations.push({
        type: 'skills',
        title: 'Improve Technical Skills',
        description: 'Consider learning the key technologies mentioned in the job description.',
        priority: 'high'
      });
    }
    
    if (matchScore.experience < 60) {
      recommendations.push({
        type: 'experience',
        title: 'Highlight Relevant Experience',
        description: 'Emphasize projects and work experience that align with the job requirements.',
        priority: 'medium'
      });
    }
    
    if (matchScore.keywords < 50) {
      recommendations.push({
        type: 'keywords',
        title: 'Optimize Resume Keywords',
        description: 'Include more industry-specific keywords from the job description.',
        priority: 'medium'
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'general',
        title: 'Great Match!',
        description: 'Your resume shows strong alignment with this position. Consider applying to similar roles.',
        priority: 'low'
      });
    }
    
    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">
            Applicant Dashboard
          </h1>
          <p className="text-gray-400 text-lg">Find your perfect job match with AI-powered analysis</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Resume Upload & Job Listings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Upload Section */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Upload Resume
              </h2>
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center bg-gray-700/50 hover:bg-gray-700 transition-colors duration-300">
                <input
                  type="file"
                  accept=".pdf,.docx,.jpg,.jpeg,.png"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg inline-block"
                >
                  Choose Resume
                </label>
                <p className="text-gray-400 mt-3 font-medium">PDF, DOCX, or image files</p>
              </div>
              {uploadedResume && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-xl">
                  <div className="flex justify-between items-center">
                    <p className="text-green-400 font-semibold">
                      ✓ {uploadedResume.name} uploaded successfully!
                    </p>
                    <button
                      onClick={() => {
                        setUploadedResume(null);
                        localStorage.removeItem('uploadedResume');
                      }}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Job Listings */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Available Jobs
                </h2>
                <span className="bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  {jobs.length}
                </span>
              </div>
              <div className="space-y-6">
                {jobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onApply={handleJobApply}
                    showApplyButton={true}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Match Analysis & Recommendations */}
          <div className="space-y-6">
            <MatchAnalysis matchData={matchData} />
            <ResumeRecommendations recommendations={recommendations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;