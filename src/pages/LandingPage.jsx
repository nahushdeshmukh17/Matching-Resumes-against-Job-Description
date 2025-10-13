import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome to JobMatch AI
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Choose your role to get started
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/job-seeker')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            I'm a Job Seeker
          </button>
          <button
            onClick={() => navigate('/recruiter')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            I'm a Recruiter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;