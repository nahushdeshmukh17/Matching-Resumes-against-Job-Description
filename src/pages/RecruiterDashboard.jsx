import React, { useState } from 'react';

const RecruiterDashboard = () => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    description: ''
  });

  const handleInputChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jobData.title && jobData.company && jobData.description) {
      alert('Job posted successfully! Backend integration will save this data.');
      setJobData({ title: '', company: '', description: '' });
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleFindCandidates = () => {
    alert('Find matching candidates feature will be implemented with backend integration');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Recruiter Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Add Job Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Post New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={jobData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={jobData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Tech Corp Inc."
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Job Description</label>
                <textarea
                  name="description"
                  value={jobData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the role, requirements, and responsibilities..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Post Job
              </button>
            </form>
          </div>

          {/* Find Candidates Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Candidates</h2>
            <p className="text-gray-600 mb-6">
              Search for candidates that match your job requirements using AI-powered matching.
            </p>
            <button
              onClick={handleFindCandidates}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Find Matching Candidates
            </button>
            <p className="text-gray-500 mt-4 text-sm">
              This feature will be available with backend integration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;