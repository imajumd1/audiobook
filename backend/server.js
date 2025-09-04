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

// Translation function
async function translateText(text, targetLanguage) {
  try {
    console.log(`Translating text to ${targetLanguage}...`);
    
    const languagePrompts = {
      'hindi': `Translate the following English text to Hindi. Provide only the Hindi translation without any additional text or explanations:\n\n${text}`,
      'bengali': `Translate the following English text to Bengali (Bangla). Provide only the Bengali translation without any additional text or explanations:\n\n${text}`,
      'mandarin': `Translate the following English text to Mandarin Chinese (Simplified). Provide only the Chinese translation without any additional text or explanations:\n\n${text}`,
      'spanish': `Translate the following English text to Spanish. Provide only the Spanish translation without any additional text or explanations:\n\n${text}`,
      'french': `Translate the following English text to French. Provide only the French translation without any additional text or explanations:\n\n${text}`
    };

    const prompt = languagePrompts[targetLanguage.toLowerCase()];
    if (!prompt) {
      throw new Error(`Unsupported language: ${targetLanguage}`);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    });

    const translatedText = completion.choices[0].message.content.trim();
    console.log(`Translation successful: ${translatedText.substring(0, 100)}...`);
    return translatedText;
    
  } catch (error) {
    console.error(`Translation error for ${targetLanguage}:`, error);
    throw new Error(`Failed to translate text to ${targetLanguage}`);
  }
}

// Parse musical markers from text
function parseMusicalText(text) {
  // Remove musical markers and return clean text for TTS
  // Users can add markers like [slow], [fast], [pause], [high], [low]
  const cleanText = text
    .replace(/\[slow\]/gi, ' ')
    .replace(/\[fast\]/gi, ' ')
    .replace(/\[pause\]/gi, ', ')
    .replace(/\[high\]/gi, ' ')
    .replace(/\[low\]/gi, ' ')
    .replace(/\[normal\]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
    
  // Extract musical hints for processing
  const musicalHints = {
    hasRhythm: /\[(slow|fast|pause)\]/gi.test(text),
    hasPitch: /\[(high|low|normal)\]/gi.test(text),
    isMusical: /\[(slow|fast|pause|high|low|normal)\]/gi.test(text)
  };
  
  return { cleanText, musicalHints };
}

// Get appropriate voice based on language, type, and musical mode
function getVoiceForLanguageAndType(language, voiceType, isMusical = false) {
  const voiceMap = {
    english: {
      adult: isMusical ? 'shimmer' : 'nova',  // shimmer is more expressive for musical content
      child: 'fable'  // Already good for musical/storytelling
    },
    hindi: {
      adult: 'alloy', // Neutral voice that works well for Hindi
      child: 'fable'  // Youthful voice for children's content
    },
    bengali: {
      adult: 'alloy', // Neutral voice that works well for Bengali
      child: 'fable'  // Youthful voice for children's content
    },
    mandarin: {
      adult: 'alloy', // Neutral voice that works well for Mandarin
      child: 'fable'  // Youthful voice for children's content
    },
    spanish: {
      adult: 'alloy', // Neutral voice that works well for Spanish
      child: 'fable'  // Youthful voice for children's content
    },
    french: {
      adult: 'alloy', // Neutral voice that works well for French
      child: 'fable'  // Youthful voice for children's content
    }
  };
  
  return voiceMap[language]?.[voiceType] || 'alloy';
}

// Translation-only endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, language = 'english' } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string' });
    }

    if (text.length > 4000) {
      return res.status(400).json({ error: 'Text must be less than 4000 characters' });
    }

    console.log(`Translating text to ${language}...`);

    let translatedText = text;
    if (language !== 'english') {
      translatedText = await translateText(text, language);
    }

    res.json({
      success: true,
      originalText: text,
      translatedText: translatedText,
      language: language
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Failed to translate text. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Generate TTS endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { text, language = 'english', voiceType = 'adult' } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string' });
    }

    if (text.length > 4000) {
      return res.status(400).json({ error: 'Text must be less than 4000 characters' });
    }

    console.log(`Generating ${language} audio (${voiceType} voice) for ${text.length} characters...`);

    // Parse musical markers if present
    const { cleanText, musicalHints } = parseMusicalText(text);
    console.log(`Musical mode: ${musicalHints.isMusical ? 'ON' : 'OFF'}`);

    // Handle translation if needed
    let finalText = cleanText;
    let translatedText = cleanText;
    
    if (language !== 'english') {
      translatedText = await translateText(cleanText, language);
      finalText = translatedText;
    }

    // Get appropriate voice (with musical consideration)
    const voice = getVoiceForLanguageAndType(language, voiceType, musicalHints.isMusical);
    console.log(`Using voice: ${voice} for ${language} ${voiceType} ${musicalHints.isMusical ? '(Musical Mode)' : ''}`);

    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: finalText.trim(),
      speed: musicalHints.hasRhythm ? 0.9 : 1.0 // Slightly slower for musical content
    });

    // Create unique filename with language and voice info
    const timestamp = Date.now();
    const musicalSuffix = musicalHints.isMusical ? '_musical' : '';
    const filename = `audio_${language}_${voiceType}${musicalSuffix}_${timestamp}.mp3`;
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
      language: language,
      voiceType: voiceType,
      voice: voice,
      isMusical: musicalHints.isMusical,
      musicalHints: musicalHints,
      translatedText: language !== 'english' ? translatedText : undefined,
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

    // Handle translation errors
    if (error.message?.includes('translate')) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.status(500).json({ 
      error: 'Failed to generate audio. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Preview endpoint - serves audio for streaming/preview
app.get('/api/preview/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(tempDir, filename);

    // Security check: ensure filename is safe (support both old and new formats including musical)
    if (!filename.match(/^audio_(english|hindi|bengali|mandarin|spanish|french)_(adult|child)(_musical)?_\d+\.mp3$/) && !filename.match(/^audio_\d+\.mp3$/)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    console.log(`Serving preview: ${filename}`);

    // Get file stats for proper streaming
    const stat = fs.statSync(filepath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests for better browser compatibility
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      const fileStream = fs.createReadStream(filepath, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache'
      });
      
      fileStream.pipe(res);
    } else {
      // Normal streaming without range
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache'
      });
      
      fs.createReadStream(filepath).pipe(res);
    }

  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'Failed to stream audio file' });
  }
});

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(tempDir, filename);

    // Security check: ensure filename is safe (support both old and new formats including musical)
    if (!filename.match(/^audio_(english|hindi|bengali|mandarin|spanish|french)_(adult|child)(_musical)?_\d+\.mp3$/) && !filename.match(/^audio_\d+\.mp3$/)) {
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
  console.log(`🎼 Musical Mode: ENABLED`);
  
  // Clean up old files on startup
  cleanupOldFiles();
  
  // Set up periodic cleanup (every hour)
  setInterval(cleanupOldFiles, 60 * 60 * 1000);
});

module.exports = app;