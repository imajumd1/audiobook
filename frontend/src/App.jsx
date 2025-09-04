import { useState } from 'react'
import axios from 'axios'

function App() {
  // State management
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('english')
  const [voiceType, setVoiceType] = useState('adult')
  const [musicalMode, setMusicalMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [translation, setTranslation] = useState(null)
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
    if (translation) {
      setTranslation(null)
    }
    if (error) {
      setError('')
    }
  }

  // Translate text function
  const translateText = async () => {
    if (!isTextValid || translating || language === 'english') return

    setTranslating(true)
    setError('')
    setTranslation(null)

    try {
      console.log(`Translating text to ${language}...`)
      
      const response = await axios.post('/api/translate', {
        text: text.trim(),
        language: language
      }, {
        timeout: 30000 // 30 second timeout
      })

      console.log('Translation successful:', response.data)
      setTranslation(response.data)

    } catch (err) {
      console.error('Translation failed:', err)
      
      let errorMessage = 'Failed to translate text. Please try again.'
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Translation timed out. Please try again with shorter text.'
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.'
      }
      
      setError(errorMessage)
    } finally {
      setTranslating(false)
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
        text: text.trim(),
        language: language,
        voiceType: voiceType
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
    if (!result?.filename || !audioRef) return

    if (isPlaying) {
      audioRef.pause()
      setIsPlaying(false)
    } else {
      audioRef.play().catch(error => {
        console.error('Audio play failed:', error)
        setIsPlaying(false)
      })
    }
  }

  // Download audio function
  const downloadAudio = () => {
    if (!result?.filename) return

    // Create download link and trigger download
    const link = document.createElement('a')
    link.href = `/api/download/${result.filename}`
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
    setTranslation(null)
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
          Convert any text into professional AI-generated audio with multilanguage support and musical speech modes
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
            placeholder="Paste your text here... For musical mode, try: '[high]Happy[normal] [pause] [slow]Birthday[normal] to [high]you!'"
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

        {/* Language Selection */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#212529'
          }}>
            🌍 Language & Translation
          </label>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value)
              setTranslation(null) // Clear translation when language changes
            }}
            disabled={loading || translating}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '16px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="english">🇺🇸 English (Original Text)</option>
            <option value="hindi">🇮🇳 Hindi (हिंदी) - Auto Translate</option>
            <option value="bengali">🇧🇩 Bengali (বাংলা) - Auto Translate</option>
            <option value="mandarin">🇨🇳 Mandarin (中文) - Auto Translate</option>
            <option value="spanish">🇪🇸 Spanish (Español) - Auto Translate</option>
            <option value="french">🇫🇷 French (Français) - Auto Translate</option>
          </select>
          <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
            {language === 'english' ? 
              'Generate audio in English using your original text' : 
              `Text will be automatically translated to ${language.charAt(0).toUpperCase() + language.slice(1)} before audio generation`
            }
          </div>
        </div>

        {/* Translation Section */}
        {language !== 'english' && (
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <label style={{ 
                fontSize: '1rem',
                fontWeight: '600',
                color: '#212529',
                margin: 0
              }}>
                🔤 Translation Preview
              </label>
              <button
                onClick={translateText}
                disabled={!isTextValid || translating || loading}
                style={{
                  padding: '8px 16px',
                  background: translating ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: translating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {translating ? (
                  <>
                    <span className="spinner" style={{ width: '12px', height: '12px' }}></span>
                    Translating...
                  </>
                ) : (
                  <>
                    🔄 Translate Text
                  </>
                )}
              </button>
            </div>
            
            {translation && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '12px'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6c757d', 
                  marginBottom: '8px',
                  fontWeight: '600'
                }}>
                  📝 Translated Text ({language.charAt(0).toUpperCase() + language.slice(1)}):
                </div>
                <div style={{
                  background: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6',
                  fontFamily: language === 'mandarin' ? 'serif' : 'inherit',
                  lineHeight: '1.6',
                  fontSize: '14px'
                }}>
                  {translation.translatedText}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#28a745', 
                  marginTop: '8px',
                  fontWeight: '500'
                }}>
                  ✅ Translation complete! This text will be used for audio generation.
                </div>
              </div>
            )}
            
            {!translation && language !== 'english' && (
              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '14px',
                color: '#856404'
              }}>
                💡 Click "Translate Text" to see the translation before generating audio
              </div>
            )}
          </div>
        )}

        {/* Voice Type Selection */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#212529'
          }}>
            🎤 Voice Type
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{
              flex: 1,
              padding: '12px 16px',
              border: `2px solid ${voiceType === 'adult' ? '#007bff' : '#e9ecef'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              background: voiceType === 'adult' ? '#f8f9ff' : 'white',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                value="adult"
                checked={voiceType === 'adult'}
                onChange={(e) => setVoiceType(e.target.value)}
                disabled={loading}
                style={{ display: 'none' }}
              />
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                👩‍💼 Adult Voice
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                Clear & Professional
              </div>
            </label>
            <label style={{
              flex: 1,
              padding: '12px 16px',
              border: `2px solid ${voiceType === 'child' ? '#007bff' : '#e9ecef'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              background: voiceType === 'child' ? '#f8f9ff' : 'white',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                value="child"
                checked={voiceType === 'child'}
                onChange={(e) => setVoiceType(e.target.value)}
                disabled={loading}
                style={{ display: 'none' }}
              />
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                🧒 Child Voice
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                Young & Playful
              </div>
            </label>
          </div>
        </div>

        {/* Musical Mode Toggle */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '16px',
            background: musicalMode ? '#fff3cd' : '#f8f9fa',
            border: `2px solid ${musicalMode ? '#ffeaa7' : '#e9ecef'}`,
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}>
            <div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: '#212529',
                marginBottom: '4px'
              }}>
                🎵 Musical Speech Mode
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                Add rhythm and melody markers to make speech more musical
              </div>
            </div>
            <label style={{
              position: 'relative',
              display: 'inline-block',
              width: '60px',
              height: '34px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={musicalMode}
                onChange={(e) => setMusicalMode(e.target.checked)}
                disabled={loading}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: musicalMode ? '#28a745' : '#ccc',
                borderRadius: '34px',
                transition: '0.4s',
                cursor: 'pointer'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '26px',
                  width: '26px',
                  left: musicalMode ? '30px' : '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.4s'
                }} />
              </span>
            </label>
          </div>
          
          {/* Musical Mode Examples */}
          {musicalMode && (
            <div style={{
              marginTop: '12px',
              padding: '16px',
              background: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '8px', color: '#495057' }}>
                🎼 Musical Markers You Can Use:
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Rhythm:</strong> [slow], [fast], [pause]
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Pitch:</strong> [high], [low], [normal]
              </div>
              <div style={{ marginBottom: '12px', fontSize: '12px', color: '#6c757d' }}>
                Example: "[high]Happy[normal] [pause] [slow]Birthday[normal] to [high]you!"
              </div>
              <button
                onClick={() => setText('[high]Happy[normal] [pause] [slow]Birthday[normal] to [high]you! [pause] May your day be filled with [fast]joy and laughter!')}
                disabled={loading}
                style={{
                  padding: '8px 12px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginRight: '8px'
                }}
              >
                Try Birthday Example
              </button>
              <button
                onClick={() => setText('[slow]Twinkle [high]twinkle[normal] little [pause] star, [fast]how I wonder what you are!')}
                disabled={loading}
                style={{
                  padding: '8px 12px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Try Lullaby Example
              </button>
            </div>
          )}
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
              🎵 Generating {musicalMode ? 'Musical ' : ''}Audio...
            </>
          ) : (
            <>
              ✨ Generate {musicalMode ? 'Musical ' : ''}Audio
            </>
          )}
        </button>

        {/* Loading Progress */}
        {loading && (
          <div className="alert info">
            <strong>⚡ Creating your {musicalMode ? 'musical ' : ''}audio file...</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
              This usually takes 15-30 seconds depending on text length.
              {musicalMode && ' Musical processing may take a bit longer.'}
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
            {result.isMusical && (
              <div style={{ 
                fontSize: '14px', 
                color: '#155724', 
                marginTop: '8px',
                fontWeight: '500'
              }}>
                🎼 Musical Mode Applied - Enhanced rhythm and melody!
              </div>
            )}
            
            {/* Show translation if available */}
            {result.translatedText && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '16px',
                margin: '16px 0',
                fontSize: '14px'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6c757d', 
                  marginBottom: '8px',
                  fontWeight: '600'
                }}>
                  📝 Translated Text ({result.language === 'bengali' ? 'Bengali' : 'Hindi'}):
                </div>
                <div style={{
                  background: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6',
                  fontFamily: 'serif',
                  lineHeight: '1.6'
                }}>
                  {result.translatedText}
                </div>
              </div>
            )}
            
            <div className="file-info">
              <div className="file-icon">🎧</div>
              <div className="file-details">
                <h3>{result.filename}</h3>
                <p>
                  {result.size ? formatFileSize(result.size) : 'MP3 Audio File'} • 
                  {result.voice ? `${result.voice} voice` : 'High Quality'} • 
                  {result.language && result.voiceType ? `${result.language} ${result.voiceType}` : 'Ready to preview and download'}
                  {result.isMusical && ' • Musical Mode'}
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
            💡 <strong>Tip:</strong> Try the Musical Mode for birthday songs, lullabies, or any text you want to sound more melodic! 
            Use markers like [high], [slow], [pause] to create rhythm and melody.
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
          Multilanguage support • Musical speech modes • Professional AI voices • High-quality MP3 output
        </p>
      </footer>
    </div>
  )
}

export default App