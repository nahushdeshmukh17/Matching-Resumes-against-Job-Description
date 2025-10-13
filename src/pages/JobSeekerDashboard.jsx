import React, { useState } from 'react';

const JobSeekerDashboard = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setUploadedFile(file);
    } else {
      alert('Please upload a PDF or DOCX file');
    }
  };

  const handleCheckMatching = () => {
    alert('Matching jobs feature will be implemented with backend integration');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Job Seeker Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Resume Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Resume</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Choose File
              </label>
              <p className="text-gray-500 mt-2">PDF or DOCX files only</p>
            </div>
            {uploadedFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800">✓ {uploadedFile.name} uploaded successfully</p>
              </div>
            )}
          </div>

          {/* Resume Summary Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume Summary</h2>
            {uploadedFile ? (
              <div className="space-y-3">
                <p><strong>File:</strong> {uploadedFile.name}</p>
                <p><strong>Size:</strong> {(uploadedFile.size / 1024).toFixed(2)} KB</p>
                <p className="text-gray-600 italic">Resume analysis will be available with AI integration</p>
              </div>
            ) : (
              <p className="text-gray-500">Upload a resume to see summary</p>
            )}
          </div>
        </div>

        {/* Matching Jobs Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Matching Jobs</h2>
          <button
            onClick={handleCheckMatching}
            disabled={!uploadedFile}
            className={`${
              uploadedFile 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-400 cursor-not-allowed'
            } text-white font-semibold py-3 px-6 rounded-lg transition duration-200`}
          >
            Check Matching Jobs
          </button>
          {!uploadedFile && (
            <p className="text-gray-500 mt-2">Upload a resume first to find matching jobs</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;