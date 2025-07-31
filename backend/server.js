const express = require('express');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public')); // For serving React build

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Generate TTS endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string' });
    }

    if (text.length > 4000) {
      return res.status(400).json({ error: 'Text must be less than 4000 characters' });
    }

    console.log(`Generating audio for ${text.length} characters...`);

    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: text.trim(),
    });

    // Create unique filename
    const timestamp = Date.now();
    const filename = `audio_${timestamp}.mp3`;
    const filepath = path.join(tempDir, filename);

    // Convert response to buffer and save
    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    console.log(`Audio generated successfully: ${filename}`);

    // Return download URL
    res.json({
      success: true,
      downloadUrl: `/api/download/${filename}`,
      filename: filename,
      size: buffer.length,
      timestamp: timestamp
    });

  } catch (error) {
    console.error('TTS Generation error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({ 
        error: 'OpenAI API quota exceeded. Please check your API key and billing.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key. Please check your configuration.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to generate audio. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(tempDir, filename);

    // Security check: ensure filename is safe
    if (!filename.match(/^audio_\d+\.mp3$/)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    console.log(`Serving download: ${filename}`);

    // Set headers for download
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream file and cleanup after download
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Cleanup file after 5 seconds
      setTimeout(() => {
        try {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            console.log(`Cleaned up file: ${filename}`);
          }
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
      }, 5000);
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Cleanup old files on startup
function cleanupOldFiles() {
  try {
    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    let cleaned = 0;

    files.forEach(file => {
      const filepath = path.join(tempDir, file);
      const stats = fs.statSync(filepath);
      const age = now - stats.mtimeMs;

      // Remove files older than 1 hour
      if (age > 60 * 60 * 1000) {
        fs.unlinkSync(filepath);
        cleaned++;
      }
    });

    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} old audio files`);
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🎵 TTS Generator Backend running on port ${PORT}`);
  console.log(`📁 Temp directory: ${tempDir}`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Configured' : 'MISSING'}`);
  
  // Clean up old files on startup
  cleanupOldFiles();
  
  // Set up periodic cleanup (every hour)
  setInterval(cleanupOldFiles, 60 * 60 * 1000);
});

module.exports = app;