import { useState } from 'react'
import axios from 'axios'

function App() {
  // State management
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioRef, setAudioRef] = useState(null)

  // Computed values
  const characterCount = text.length
  const isTextValid = text.trim().length > 0 && text.length <= 4000
  const isNearLimit = characterCount > 3500
  const isOverLimit = characterCount > 4000

  // Handle text input change
  const handleTextChange = (e) => {
    setText(e.target.value)
    // Clear previous results when text changes
    if (result) {
      setResult(null)
    }
    if (error) {
      setError('')
    }
  }

  // Generate audio function
  const generateAudio = async () => {
    if (!isTextValid || loading) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      console.log('Generating audio for text:', text.substring(0, 50) + '...')
      
      const response = await axios.post('/api/generate', {
        text: text.trim()
      }, {
        timeout: 60000 // 60 second timeout
      })

      console.log('Generation successful:', response.data)
      setResult(response.data)

    } catch (err) {
      console.error('Generation failed:', err)
      
      let errorMessage = 'Failed to generate audio. Please try again.'
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again with shorter text.'
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Play preview function
  const playPreview = () => {
    if (!result?.filename) return

    if (audioRef) {
      if (isPlaying) {
        audioRef.pause()
        setIsPlaying(false)
      } else {
        audioRef.play()
        setIsPlaying(true)
      }
    }
  }

  // Download audio function
  const downloadAudio = () => {
    if (!result?.downloadUrl) return

    // Create download link and trigger download
    const link = document.createElement('a')
    link.href = result.downloadUrl
    link.download = result.filename || 'generated-audio.mp3'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Audio event handlers
  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const handleAudioError = () => {
    setIsPlaying(false)
    console.error('Audio playback error')
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Clear all data
  const clearAll = () => {
    setText('')
    setResult(null)
    setError('')
  }

  return (
    <div className="container">
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #007bff, #6c5ce7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🎵 Text to Speech Magic
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#6c757d',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Convert any text into professional AI-generated audio using OpenAI TTS
        </p>
      </header>

      {/* Main Card */}
      <div className="card">
        {/* Text Input Section */}
        <div className="form-group">
          <label htmlFor="textInput" style={{ 
            display: 'block',
            marginBottom: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#212529'
          }}>
            Your Text
          </label>
          <textarea
            id="textInput"
            className="textarea"
            value={text}
            onChange={handleTextChange}
            placeholder="Paste your text here... Try something like: 'Hello! This is a test of the text-to-speech generator. It can convert any text into natural-sounding audio using AI.'"
            disabled={loading}
            style={{
              borderColor: isOverLimit ? '#dc3545' : (isNearLimit ? '#ffc107' : '#e9ecef')
            }}
          />
          
          {/* Character Counter */}
          <div className={`char-counter ${isOverLimit ? 'danger' : isNearLimit ? 'warning' : ''}`}>
            {characterCount} / 4000 characters
            {isOverLimit && (
              <span style={{ display: 'block', color: '#dc3545', fontSize: '12px' }}>
                Text is too long. Please reduce by {characterCount - 4000} characters.
              </span>
            )}
          </div>
        </div>

        {/* Voice Selection (Future Feature) */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#212529'
          }}>
            Voice
          </label>
          <div style={{
            padding: '12px 16px',
            background: '#f8f9fa',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            color: '#6c757d'
          }}>
            🎤 Nova (Clear Female Voice) - More voices coming soon!
          </div>
        </div>

        {/* Generate Button */}
        <button
          className="button"
          onClick={generateAudio}
          disabled={!isTextValid || loading}
          style={{
            width: '100%',
            fontSize: '1.1rem',
            padding: '16px 24px',
            marginBottom: '24px'
          }}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              🎵 Generating Audio...
            </>
          ) : (
            <>
              ✨ Generate Audio
            </>
          )}
        </button>

        {/* Loading Progress */}
        {loading && (
          <div className="alert info">
            <strong>⚡ Creating your audio file...</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
              This usually takes 15-30 seconds depending on text length.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert error">
            <strong>❌ Generation Failed</strong>
            <p style={{ margin: '8px 0 0 0' }}>{error}</p>
            <button 
              className="button secondary" 
              onClick={() => setError('')}
              style={{ marginTop: '12px', padding: '8px 16px', fontSize: '14px' }}
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Success State */}
        {result && (
          <div className="alert success result-panel">
            <strong>✅ Audio Generated Successfully!</strong>
            
            <div className="file-info">
              <div className="file-icon">🎧</div>
              <div className="file-details">
                <h3>{result.filename}</h3>
                <p>
                  {result.size ? formatFileSize(result.size) : 'MP3 Audio File'} • 
                  High Quality • Ready to preview and download
                </p>
              </div>
            </div>

            {/* Audio Player */}
            <div className="audio-player">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                fontSize: '14px',
                color: '#6c757d'
              }}>
                🎵 <strong style={{ marginLeft: '8px', color: '#212529' }}>Audio Preview</strong>
                <span style={{ marginLeft: 'auto' }}>Use controls to play, pause, and seek</span>
              </div>
              <audio
                ref={(ref) => setAudioRef(ref)}
                onEnded={handleAudioEnded}
                onError={handleAudioError}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                preload="metadata"
                controls
                style={{ width: '100%' }}
              >
                <source src={`/api/preview/${result.filename}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>

            <div className="button-group">
              <button 
                className={`button ${isPlaying ? 'pause' : 'play'}`}
                onClick={playPreview}
                style={{ flex: 1 }}
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Quick Play'}
              </button>
              <button 
                className="button success"
                onClick={downloadAudio}
                style={{ flex: 1 }}
              >
                ⬇️ Download MP3
              </button>
              <button 
                className="button secondary"
                onClick={clearAll}
                style={{ flex: 1 }}
              >
                🔄 New Audio
              </button>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!text && !loading && !result && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#6c757d',
            fontSize: '14px',
            borderTop: '1px solid #e9ecef',
            marginTop: '20px'
          }}>
            💡 <strong>Tip:</strong> Try pasting a paragraph, article excerpt, or script. 
            The AI will generate natural-sounding speech in seconds!
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '40px',
        padding: '20px',
        color: '#6c757d',
        fontSize: '14px'
      }}>
        <p>
          ──────────── Powered by OpenAI TTS ────────────
        </p>
        <p style={{ marginTop: '8px' }}>
          Professional AI voices • High-quality MP3 output • Fast generation
        </p>
      </footer>
    </div>
  )
}

export default App