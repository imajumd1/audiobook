# Text-to-Speech Generator MVP

## The Magic Moment 🎯
**User pastes text → clicks one button → downloads beautiful AI audio in under 30 seconds**

## MVP Core: 3 Essential Features

### 1. Single API Endpoint Magic ✨
```
POST /api/generate
- Input: { text: "Your text here" }
- Output: Download URL for MP3
- One perfect voice (OpenAI's "nova" - young, clear female voice)
- No choices, no complexity, just magic
```

### 2. Zero-Config React Experience 🚀
- Modern React interface with instant feedback
- Real-time state management
- Automatic download triggers
- Perfect audio quality every time

### 3. Backend Beauty 💎
- Express API handles everything
- OpenAI TTS creates professional audio
- Temporary file served via download endpoint
- Clean up happens automatically

## Technical MVP Stack

### Backend Dependencies
```javascript
// Backend (only 4 essential!)
- express (web server)
- openai (TTS API)
- cors (React integration)
- dotenv (environment config)
```

### Frontend Dependencies
```javascript
// Frontend (React essentials)
- react
- react-dom
- axios (API calls)
- vite (build tool)
```

### File Structure (Minimal)
```
/
├── backend/
│   ├── server.js      (everything in one file to start)
│   ├── temp/          (generated audio files)
│   ├── .env           (OpenAI API key)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx    (single component MVP)
│   │   └── main.jsx   (React entry point)
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

### Single Route Implementation
```javascript
// The entire MVP in one route
app.post('/generate', async (req, res) => {
  // 1. Get text from request
  // 2. Call OpenAI TTS API  
  // 3. Save MP3 to temp folder
  // 4. Send file as download
  // 5. Clean up after download
})
```

## MVP User Journey (30 seconds total)

1. **0s**: User visits homepage
2. **5s**: Pastes text in simple textarea
3. **7s**: Clicks "Generate Audio" button
4. **10s**: Server calls OpenAI TTS API
5. **25s**: MP3 generation completes
6. **30s**: Download starts automatically

## What Makes It Feel Magical

### Speed ⚡
- No loading screens
- Direct file streaming
- Optimized for <30 second experience
- Instant feedback when generation starts

### Quality 🎵
- Professional AI voice (OpenAI's "nova")
- High-quality MP3 output
- Natural speech patterns
- Clear pronunciation

### Simplicity 🎯
- One text box
- One button
- One perfect result
- Zero configuration needed

## MVP Implementation Plan

### Phase 1: Core Backend (2 hours)
```javascript
// backend/server.js - The entire MVP backend
const express = require('express');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

// Single magical endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { text } = req.body;
    
    // Generate speech
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });
    
    // Create unique filename
    const filename = `audio_${Date.now()}.mp3`;
    const filepath = path.join(__dirname, 'temp', filename);
    
    // Save and return download URL
    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    
    res.json({ downloadUrl: `/api/download/${filename}` });
    
  } catch (error) {
    res.status(500).json({ error: 'Generation failed' });
  }
});

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'temp', req.params.filename);
  res.download(filepath, () => {
    setTimeout(() => fs.unlinkSync(filepath), 5000);
  });
});
```

### Phase 2: React Frontend (1.5 hours)
```jsx
// frontend/src/App.jsx - Single component MVP
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateAudio = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3001/api/generate', {
        text: text.trim()
      });
      
      // Trigger download
      const link = document.createElement('a');
      link.href = `http://localhost:3001${response.data.downloadUrl}`;
      link.download = 'generated-audio.mp3';
      link.click();
      
    } catch (err) {
      setError('Failed to generate audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'system-ui' }}>
      <h1>🎵 Text to Speech Magic</h1>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        style={{ width: '100%', height: '200px', fontSize: '16px', padding: '15px', marginBottom: '20px' }}
      />
      
      <button
        onClick={generateAudio}
        disabled={loading || !text.trim()}
        style={{
          background: loading ? '#ccc' : '#007bff',
          color: 'white',
          padding: '15px 30px',
          fontSize: '18px',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '🎵 Generating...' : '✨ Generate Audio'}
      </button>
      
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default App;
```

### Phase 3: Build Process (45 minutes)
```json
// Root package.json with build scripts
{
  "scripts": {
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "cd frontend && npm run build && cp -r dist/* ../backend/public/",
    "start": "cd backend && npm start"
  }
}
```

### Phase 4: Deploy (30 minutes)
- Configure Railway to run build script
- Set environment variables
- Deploy and test

## MVP Success Metrics

### User Experience
- ✅ Text to audio in under 30 seconds
- ✅ Professional quality output
- ✅ Zero learning curve
- ✅ Works on mobile browsers

### Technical
- ✅ Single file backend
- ✅ No database needed
- ✅ Auto file cleanup
- ✅ Error handling

### Business
- ✅ Demonstrates OpenAI TTS integration
- ✅ Shows file handling skills
- ✅ Proves deployment capability
- ✅ Creates real user value

## What's NOT in MVP

### Features Cut for Simplicity
- ❌ Multiple voice options (just nova)
- ❌ Multiple audio formats (just MP3)
- ❌ User accounts
- ❌ File persistence 
- ❌ Batch processing
- ❌ Advanced error messages
- ❌ Progress bars
- ❌ Audio preview

### Can Add Later
- Voice selection dropdown
- Text length validation
- Better error handling
- Progress indicators
- Audio quality options

## MVP Deployment Checklist

### Railway Configuration
```json
// backend/package.json
{
  "name": "tts-generator-mvp-backend",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "openai": "^4.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  }
}
```

```json
// frontend/package.json
{
  "name": "tts-generator-mvp-frontend",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.4.0"
  }
}
```

### Environment Variables
```
OPENAI_API_KEY=your_key_here
PORT=3000
```

### Test Cases
1. Paste "Hello world" → Download works
2. Paste longer text → Still works under 30s
3. Empty text → Shows error
4. API failure → Graceful error

## The MVP Promise 🎯

**"Paste any text, get professional AI audio in 30 seconds or less"**

This React + Express MVP delivers on that promise with modern UI/UX while keeping the backend complexity minimal. The React frontend provides instant feedback and smooth interactions, while the Express backend handles the OpenAI TTS magic.

The magic is in the simplicity - React's reactivity makes it feel instant, while the backend stays focused on one thing: perfect audio generation.