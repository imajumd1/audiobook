# Text-to-Speech Generator - Project Scope

## Project Overview
A backend-focused web application that converts text input into high-quality audio files using OpenAI's Text-to-Speech API. Users can input text, select from different AI voices, and download natural-sounding MP3 audio files.

## Core Objectives
- Learn backend API integration with external services (OpenAI TTS)
- Build a functional REST API with Express.js
- Handle file generation and downloads
- Deploy a production-ready application on Railway

## Target Users
- Content creators needing voiceovers
- Students and educators
- Anyone wanting to convert text to speech
- Developers learning backend API integration

## Core Features

### 1. Text Input & Processing
- Accept text input via web form or API endpoint
- Text validation and sanitization
- Character limit enforcement (OpenAI TTS limits)
- Support for multiple languages

### 2. Voice Selection
- Multiple AI voice options from OpenAI TTS:
  - `alloy` - Neutral, balanced voice
  - `echo` - Male voice
  - `fable` - British accent
  - `onyx` - Deep male voice
  - `nova` - Young female voice
  - `shimmer` - Soft female voice

### 3. Audio Generation
- Integration with OpenAI TTS API
- High-quality MP3 output (default format)
- Configurable audio quality settings
- Error handling for API failures

### 4. File Management
- Temporary file storage for generated audio
- Secure file download endpoints
- Automatic cleanup of old files
- Unique file naming to prevent conflicts

### 5. Simple Web Interface
- Basic HTML form for text input
- Voice selection dropdown
- Generate and download buttons
- Progress indicators
- Error message display

## Technical Requirements

### Tech Stack
**Backend:**
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **HTTP Client**: Axios or native fetch for OpenAI API calls
- **File Handling**: Node.js fs module
- **Environment**: dotenv for configuration
- **Process Management**: PM2 (for production)

**Frontend:**
- **Framework**: React.js
- **Build Tool**: Vite or Create React App
- **HTTP Client**: Axios for API calls
- **Styling**: CSS Modules or styled-components
- **State Management**: React useState (no Redux needed)

### External Dependencies
- **OpenAI API**: Text-to-Speech service
- **File System**: Temporary audio file storage
- **Railway**: Deployment platform

### API Endpoints

#### Core Endpoints
```
POST /api/generate
- Body: { text: string, voice: string, format?: string }
- Returns: { audioUrl: string, filename: string, duration?: number }

GET /api/download/:filename
- Downloads the generated audio file
- Auto-cleanup after download

GET /api/voices
- Returns available voice options

GET /health
- Health check endpoint
```

#### Frontend (React SPA)
```
/ (React Router)
- Main interface component with text input and voice selection
- Real-time state management
- File download handling

/about (React Route)
- Simple about page component
```

### File Structure
```
/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── ttsController.js
│   │   │   └── healthController.js
│   │   ├── services/
│   │   │   ├── openaiService.js
│   │   │   └── fileService.js
│   │   ├── middleware/
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   └── utils/
│   │       ├── constants.js
│   │       └── helpers.js
│   ├── temp/
│   │   └── (generated audio files)
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TextInput.jsx
│   │   │   ├── VoiceSelector.jsx
│   │   │   ├── GenerateButton.jsx
│   │   │   └── AudioPlayer.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   └── useTTS.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## User Flow

1. **Landing Page**: User visits the web interface
2. **Text Input**: User pastes or types text (max ~4000 characters)
3. **Voice Selection**: User selects preferred AI voice from dropdown
4. **Generation**: User clicks "Generate Audio" button
5. **Processing**: App calls OpenAI TTS API and creates MP3 file
6. **Download**: User receives download link for the audio file
7. **Cleanup**: Temporary files are cleaned up after download/timeout

## Technical Constraints

### OpenAI TTS Limits
- Maximum 4096 characters per request
- Rate limiting considerations
- API key security

### File Management
- Temporary storage only (not persistent)
- Auto-cleanup after 1 hour or download
- File size limits for download

### Performance
- Single request processing (no queuing initially)
- Timeout handling for long requests
- Basic error recovery

## Success Criteria

### Functional Requirements
- ✅ Successfully convert text to speech using OpenAI TTS
- ✅ Support all available OpenAI voices
- ✅ Generate and serve MP3 files for download
- ✅ Handle errors gracefully with user feedback
- ✅ Clean and responsive web interface

### Technical Requirements
- ✅ Deploy successfully on Railway
- ✅ Environment variables properly configured
- ✅ API endpoints respond correctly
- ✅ File cleanup works automatically
- ✅ Health checks pass

### User Experience
- ✅ Simple, intuitive interface
- ✅ Clear error messages
- ✅ Fast generation times (<30 seconds)
- ✅ Reliable downloads
- ✅ Mobile-friendly design

## Future Enhancements (Out of Scope)
- User authentication and accounts
- Audio file persistence/storage
- Batch processing multiple texts
- Custom voice training
- Advanced audio editing features
- Payment integration
- Usage analytics
- SSML support for advanced speech control

## Deployment Configuration

### Railway Setup
- **Build Command**: `npm run build` (builds React frontend + copies to backend)
- **Start Command**: `npm start` (starts Express server serving React build)
- **Port**: Railway's provided PORT environment variable
- **Environment Variables**:
  - `OPENAI_API_KEY` (required)
  - `NODE_ENV=production`
  - `PORT` (provided by Railway)

### Build Process
1. Build React frontend (`npm run build` in frontend/)
2. Copy build files to backend/public/
3. Express serves React build as static files
4. API routes handle /api/* requests

### Environment Variables
```
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
PORT=3000
MAX_TEXT_LENGTH=4000
CLEANUP_INTERVAL=3600000
```

## Project Timeline
- **Setup & Configuration**: 1-2 hours (both React + Express)
- **Core API Development**: 3-4 hours
- **React Frontend Development**: 3-4 hours
- **Integration & Testing**: 2-3 hours
- **Build Process & Deployment**: 1-2 hours
- **Total Estimated Time**: 11-16 hours

This scope focuses on creating a functional, learning-oriented backend application that demonstrates API integration, file handling, and deployment skills while providing real value to users.