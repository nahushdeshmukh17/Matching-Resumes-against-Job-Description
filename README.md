# JobMatch AI 🚀

A modern, AI-powered job matching platform that connects job seekers with their perfect opportunities and helps recruiters find ideal candidates through intelligent resume-job matching.

![JobMatch AI](https://img.shields.io/badge/React-19.2.0-blue)
![Express](https://img.shields.io/badge/Express-4.18.2-green)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0.3-47A248)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.0-38B2AC)
![Vite](https://img.shields.io/badge/Vite-6.4.0-646CFF)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### For Job Seekers
- 📄 **Smart Resume Upload**: PDF/DOCX support with instant processing
- 🎯 **AI-Powered Matching**: Get percentage-based job compatibility scores
- 📊 **Detailed Analysis**: See exactly why you match (skills, experience, education)
- 💡 **Personalized Recommendations**: Get specific advice to improve your resume
- 🔍 **Job Discovery**: Browse and apply to relevant positions

### For Recruiters
- 🛠️ **Interactive Job Builder**: Create job postings with clickable options
- 📸 **Image Upload**: Extract job descriptions from images using OCR
- 👥 **Candidate Management**: View all applicants with detailed match breakdowns
- 📈 **Smart Sorting**: Sort candidates by overall match, skills, or experience
- 👀 **Resume Viewer**: Full-screen resume analysis with match overlay

### Technical Features
- 🎨 **Modern Dark Theme**: Professional, eye-friendly interface
- ⚡ **Smooth Animations**: Polished user experience with CSS animations
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔐 **Secure Authentication**: JWT-based auth with session management
- 🚀 **Fast Performance**: Built with Vite for lightning-fast development

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 with JSX
- **React Router DOM** 7.9.4
- **Tailwind CSS** 3.4.0
- **Vite** 6.4.0

### Backend
- **Express.js** 4.18.2
- **MongoDB** with Mongoose 8.0.3
- **Authentication** with bcryptjs & sessions
- **Security** with Helmet, CORS, Rate Limiting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SAM160706/Matching-Resumes-against-Job-Description.git
cd jobmatch-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
cp .env.server.example .env.server
# Edit .env.server with your MongoDB URI and session secret
```

4. **Start both frontend and backend**
```bash
npm start
```

Or run them separately:
```bash
# Frontend only
npm run dev

# Backend only
npm run server:dev
```

5. **Open your browser**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5001`

## 📁 Project Structure

```
jobmatch-ai/
├── src/                     # Frontend React app
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── context/            # React context providers
│   ├── services/           # API service layer
│   └── App.jsx             # Main app component
├── server/                  # Backend Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── server.js           # Express server
├── public/                 # Static assets
├── .env.server            # Backend environment variables
└── package.json           # Unified dependencies
```

## 🎯 Available Scripts

```bash
npm start          # Start both frontend and backend
npm run dev        # Start frontend only
npm run server     # Start backend only
npm run server:dev # Start backend with nodemon
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🎨 Key Features Demo

### Applicant Flow
1. **Signup/Login** → Create account or sign in
2. **Upload Resume** → Drag & drop PDF/DOCX files
3. **Browse Jobs** → See available positions
4. **Apply** → Click "Apply Now" on any job
5. **View Match** → See detailed compatibility analysis
6. **Get Recommendations** → Receive personalized improvement tips

### Recruiter Flow
1. **Signup/Login** → Create recruiter account
2. **Post Job** → Use interactive job builder or upload image
3. **View Candidates** → See all applicants with match scores
4. **Analyze Resumes** → Click "View Resume" for detailed analysis
5. **Sort & Filter** → Organize candidates by match criteria

## 🔮 Future Enhancements

- 🤖 **Real AI Integration**: Connect with OpenAI/Hugging Face APIs
- 🔍 **Advanced Search**: Elasticsearch for powerful job/candidate search
- 📧 **Email Notifications**: Automated matching alerts
- 📊 **Analytics Dashboard**: Detailed insights and reporting
- 🌐 **Multi-language Support**: Internationalization
- 📱 **Mobile App**: React Native implementation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using React and Express.js
- Inspired by modern job platforms like LinkedIn and Indeed
- UI/UX designed for optimal user experience

---