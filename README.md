# 🎵 Text-to-Speech Generator

Convert any text into professional AI-generated audio using OpenAI's Text-to-Speech API. Built with React frontend and Express backend.

## ✨ Features

- **Professional AI Voices**: High-quality speech generation using OpenAI TTS
- **Simple Interface**: Clean, intuitive design focused on text input
- **Instant Downloads**: Generate and download MP3 files in seconds
- **Mobile Friendly**: Responsive design that works on all devices
- **Real-time Feedback**: Character counting, loading states, error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Setup

1. **Clone and install dependencies:**
```bash
git clone <your-repo>
cd tts-generator
npm install
```

2. **Configure OpenAI API:**
```bash
# Create backend/.env file
cd backend
echo "OPENAI_API_KEY=your_api_key_here" > .env
echo "PORT=3001" >> .env
echo "NODE_ENV=development" >> .env
```

3. **Start development servers:**
```bash
# From project root
npm run dev
```

This starts:
- Backend API server on http://localhost:3001
- React frontend on http://localhost:3000

### Production Build

```bash
# Build and deploy
npm run build
npm start
```

## 🛠 Tech Stack

**Frontend:**
- React 18 with Vite
- Axios for API calls
- Responsive CSS with modern design

**Backend:**
- Express.js server
- OpenAI TTS API integration
- File handling with automatic cleanup
- CORS enabled for frontend integration

## 📁 Project Structure

```
tts-generator/
├── backend/                 # Express API server
│   ├── server.js           # Main server file
│   ├── temp/               # Generated audio files (auto-cleanup)
│   ├── public/             # Built frontend files (created on build)
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── App.jsx         # Main component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   └── package.json
└── package.json           # Root package.json with scripts
```

## 🔧 API Endpoints

- `POST /api/generate` - Generate TTS audio from text
- `GET /api/download/:filename` - Download generated audio file
- `GET /health` - Health check endpoint

## 🌐 Deployment

### Railway Deployment

1. **Connect your GitHub repository to Railway**

2. **Set environment variables:**
```
OPENAI_API_KEY=your_actual_api_key_here
NODE_ENV=production
```

3. **Railway will automatically:**
- Run `npm run build` (builds React and copies to backend)
- Run `npm start` (starts Express server)
- Serve the React app and API from the same domain

### Other Platforms

The app can be deployed to any platform that supports Node.js:
- Heroku
- Vercel
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## 🎯 Usage

1. **Paste Text**: Add your text in the large textarea (up to 4000 characters)
2. **Generate**: Click "Generate Audio" button
3. **Download**: Download the generated MP3 file
4. **Repeat**: Generate as many audio files as needed

## 🔒 Security Notes

- API keys are stored in environment variables
- File uploads are validated and sanitized
- Generated files auto-delete after download
- CORS is properly configured

## 🐛 Troubleshooting

**"OPENAI_API_KEY not found"**
- Make sure you created `backend/.env` with your API key

**"Failed to generate audio"**
- Check your OpenAI API key and billing status
- Ensure text is under 4000 characters

**Frontend not loading**
- Make sure both servers are running (`npm run dev`)
- Check that ports 3000 and 3001 are available

**Build issues**
- Run `npm run clean` and `npm install` to reset dependencies

## 📝 License

MIT License - feel free to use this project for learning and development!

## 🎵 About

This project demonstrates modern web development practices:
- React hooks and state management
- Express API development
- External API integration (OpenAI)
- File handling and streaming
- Responsive UI design
- Production deployment setup

Perfect for learning backend API integration while building something genuinely useful!