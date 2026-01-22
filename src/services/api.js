const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    // Don't stringify FormData objects
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }
    
    // Remove Content-Type header for FormData to let browser set it
    if (config.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password, userType) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password, userType },
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Resume extraction
  async extractResumeText(file) {
    const formData = new FormData();
    formData.append('resume', file);
    
    return this.request('/resume/extract', {
      method: 'POST',
      body: formData
    });
  }

  // Application methods
  async applyToJob(jobId, resumeText, resumeFileName) {
    return this.request('/applications', {
      method: 'POST',
      body: { jobId, resumeText, resumeFileName },
    });
  }

  async getMyApplications() {
    return this.request('/applications/my-applications');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();