# Text-to-Speech Generator - UI Design

## Design Philosophy
- **Text-first**: Large, prominent textarea as the hero element
- **Single-action flow**: Paste → Generate → Download
- **Clean & minimal**: Remove distractions, focus on core functionality
- **Professional feel**: Modern typography, subtle shadows, proper spacing
- **Beginner-friendly**: Clear labels, helpful placeholders, obvious next steps

## Color Palette
```
Primary Blue:    #007bff (Generate button, accents)
Success Green:   #28a745 (Success states)
Error Red:       #dc3545 (Error messages)
Gray Scale:      #f8f9fa (background), #6c757d (text), #dee2e6 (borders)
White:           #ffffff (cards, inputs)
```

## Typography
- **Headers**: System fonts (San Francisco, Segoe UI, Roboto)
- **Body**: 16px base size for readability
- **Monospace**: For character counts, technical details

---

## Main Interface Layout

### Desktop View (1200px+)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    🎵 Text to Speech Magic                                  │
│    Convert any text into professional AI-generated audio   │
│                                                             │
│    ┌─────────────────────────────────────────────────────┐ │
│    │ Paste your text here...                             │ │
│    │                                                     │ │
│    │ Lorem ipsum dolor sit amet, consectetur adipiscing  │ │
│    │ elit. Sed do eiusmod tempor incididunt ut labore    │ │
│    │ et dolore magna aliqua. Ut enim ad minim veniam,    │ │
│    │ quis nostrud exercitation ullamco laboris nisi ut   │ │
│    │ aliquip ex ea commodo consequat.                    │ │
│    │                                                     │ │
│    │                                                     │ │
│    │                                                     │ │
│    └─────────────────────────────────────────────────────┘ │
│                                                             │
│    Characters: 234 / 4000                                  │
│                                                             │
│    Voice: Nova (Clear Female Voice) ▼                      │
│                                                             │
│    ┌─────────────────────┐                                 │
│    │  ✨ Generate Audio  │                                 │
│    └─────────────────────┘                                 │
│                                                             │
│                                                             │
│    ──────────── Powered by OpenAI TTS ────────────         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Mobile View (375px)
```
┌─────────────────────────────┐
│                             │
│  🎵 Text to Speech Magic    │
│  Convert text to audio      │
│                             │
│  ┌─────────────────────────┐ │
│  │ Paste your text here... │ │
│  │                         │ │
│  │ Lorem ipsum dolor sit   │ │
│  │ amet, consectetur       │ │
│  │ adipiscing elit. Sed do │ │
│  │ eiusmod tempor          │ │
│  │ incididunt ut labore    │ │
│  │ et dolore magna aliqua. │ │
│  │                         │ │
│  │                         │ │
│  └─────────────────────────┘ │
│                             │
│  Characters: 234 / 4000     │
│                             │
│  Voice: Nova ▼              │
│                             │
│  ┌─────────────────────────┐ │
│  │   ✨ Generate Audio    │ │
│  └─────────────────────────┘ │
│                             │
│  Powered by OpenAI TTS     │
│                             │
└─────────────────────────────┘
```

---

## Component States

### 1. Loading State
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    🎵 Text to Speech Magic                                  │
│    Convert any text into professional AI-generated audio   │
│                                                             │
│    ┌─────────────────────────────────────────────────────┐ │
│    │ Lorem ipsum dolor sit amet, consectetur adipiscing  │ │
│    │ elit. Sed do eiusmod tempor incididunt ut labore    │ │
│    │ et dolore magna aliqua. Ut enim ad minim veniam,    │ │
│    │ quis nostrud exercitation ullamco laboris...        │ │
│    └─────────────────────────────────────────────────────┘ │
│                                                             │
│    Characters: 234 / 4000                                  │
│                                                             │
│    Voice: Nova (Clear Female Voice) ▼                      │
│                                                             │
│    ┌─────────────────────┐                                 │
│    │  🎵 Generating...   │  ⟲                              │
│    └─────────────────────┘                                 │
│                                                             │
│    ⚡ Creating your audio file... (~20 seconds)            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Success State
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    🎵 Text to Speech Magic                                  │
│    Convert any text into professional AI-generated audio   │
│                                                             │
│    ┌─────────────────────────────────────────────────────┐ │
│    │ Lorem ipsum dolor sit amet, consectetur adipiscing  │ │
│    │ elit. Sed do eiusmod tempor incididunt ut labore    │ │
│    │ et dolore magna aliqua. Ut enim ad minim veniam,    │ │
│    │ quis nostrud exercitation ullamco laboris...        │ │
│    └─────────────────────────────────────────────────────┘ │
│                                                             │
│    Characters: 234 / 4000                                  │
│                                                             │
│    Voice: Nova (Clear Female Voice) ▼                      │
│                                                             │
│    ┌─────────────────────┐                                 │
│    │  ✨ Generate Audio  │                                 │
│    └─────────────────────┘                                 │
│                                                             │
│    ┌─────────────────────────────────────────────────────┐ │
│    │ ✅ Audio Generated Successfully!                    │ │
│    │                                                     │ │
│    │ 🎧 generated-audio.mp3 (1.2 MB)                    │ │
│    │                                                     │ │
│    │ ┌─────────────────┐ ┌─────────────────┐             │ │
│    │ │ 🎵 Play Preview │ │ ⬇️  Download    │             │ │
│    │ └─────────────────┘ └─────────────────┘             │ │
│    └─────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Error State
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    🎵 Text to Speech Magic                                  │
│    Convert any text into professional AI-generated audio   │
│                                                             │
│    ┌─────────────────────────────────────────────────────┐ │
│    │ Lorem ipsum dolor sit amet, consectetur adipiscing  │ │
│    │ elit. Sed do eiusmod tempor incididunt ut labore    │ │
│    │ et dolore magna aliqua. Ut enim ad minim veniam,    │ │
│    │ quis nostrud exercitation ullamco laboris...        │ │
│    └─────────────────────────────────────────────────────┘ │
│                                                             │
│    Characters: 234 / 4000                                  │
│                                                             │
│    Voice: Nova (Clear Female Voice) ▼                      │
│                                                             │
│    ┌─────────────────────┐                                 │
│    │  ✨ Generate Audio  │                                 │
│    └─────────────────────┘                                 │
│                                                             │
│    ┌─────────────────────────────────────────────────────┐ │
│    │ ❌ Generation Failed                                │ │
│    │ Something went wrong. Please try again.             │ │
│    │                                                     │ │
│    │ ┌─────────────────┐                                 │ │
│    │ │   🔄 Try Again   │                                 │ │
│    │ └─────────────────┘                                 │ │
│    └─────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Header Section
```
Component: AppHeader
├── Title: "🎵 Text to Speech Magic"
├── Subtitle: "Convert any text into professional AI-generated audio"
└── Styling: Large font, centered, generous top margin
```

### Text Input Area
```
Component: TextInput
├── Element: <textarea>
├── Placeholder: "Paste your text here..."
├── Rows: 8-10 (desktop), 6-8 (mobile)
├── Max Length: 4000 characters
├── Styling: Large font (16px), padding, rounded corners, focus outline
└── Features: Auto-resize, character counter
```

### Character Counter
```
Component: CharacterCounter
├── Format: "Characters: {current} / 4000"
├── Position: Below textarea, right-aligned
├── Styling: Small gray text
└── Behavior: Updates real-time, warns when approaching limit
```

### Voice Selector (Future)
```
Component: VoiceSelector
├── Type: Dropdown/Select
├── Default: "Nova (Clear Female Voice)"
├── Options: All OpenAI TTS voices
└── Styling: Consistent with other form elements
```

### Generate Button
```
Component: GenerateButton
├── Text: "✨ Generate Audio" | "🎵 Generating..."
├── States: idle, loading, disabled
├── Styling: Primary blue, large padding, full-width on mobile
└── Behavior: Disabled when no text or loading
```

### Result Panel
```
Component: ResultPanel
├── Success State: Green border, file info, action buttons
├── Error State: Red border, error message, retry button
├── Loading State: Blue border, progress indication
└── Features: Auto-hide after new generation starts
```

---

## Responsive Breakpoints

### Mobile (320px - 767px)
- Single column layout
- Full-width components
- Larger touch targets (44px minimum)
- Reduced padding and margins
- Simplified navigation

### Tablet (768px - 1023px)
- Similar to desktop but with adjusted spacing
- Slightly larger components for touch interaction

### Desktop (1024px+)
- Maximum content width of 800px
- Centered layout with side margins
- Larger text areas
- Hover states for interactive elements

---

## Accessibility Features

### Keyboard Navigation
```
Tab Order:
1. Textarea (text input)
2. Voice selector dropdown
3. Generate button
4. Result action buttons (play/download)
```

### Screen Reader Support
```
- Proper ARIA labels for all interactive elements
- Role attributes for dynamic content
- Live regions for status updates
- Alt text for icons and decorative elements
```

### Visual Accessibility
```
- High contrast ratios (4.5:1 minimum)
- Focus indicators on all interactive elements
- Error states clearly marked with color AND text
- Large enough touch targets (44px minimum)
```

---

## Animation & Micro-interactions

### Button States
```
Generate Button:
- Hover: Slight color darkening, subtle scale (1.02x)
- Click: Brief scale down (0.98x) then return
- Loading: Subtle pulse animation, spinner icon
```

### Status Changes
```
Result Panel:
- Slide in from bottom when showing results
- Fade out old content, fade in new content
- Success: Brief green flash border
- Error: Brief red flash border
```

### Loading States
```
Character Counter:
- Smooth color transition as approaching limit
- Brief highlight when typing

Text Area:
- Subtle glow on focus
- Smooth border color transitions
```

---

## Implementation Notes

### CSS Framework Approach
```
Option 1: Custom CSS with CSS Modules
+ Complete control over styling
+ Lightweight bundle
- More development time

Option 2: Tailwind CSS
+ Rapid development
+ Consistent design system
+ Good default responsive design

Option 3: Styled Components
+ Component-scoped styles
+ Dynamic styling based on props
+ Great TypeScript integration
```

### Component Architecture
```
App.jsx
├── Header
├── TextInput
│   ├── Textarea
│   └── CharacterCounter
├── VoiceSelector
├── GenerateButton
└── ResultPanel
    ├── SuccessState
    ├── ErrorState
    └── LoadingState
```

### State Management
```
App State:
- text: string
- loading: boolean
- error: string | null
- result: { downloadUrl: string, filename: string } | null
- characterCount: number (computed)
```

This design prioritizes simplicity and user experience while maintaining a professional appearance. The large text input makes it clear what the primary action is, while the clean layout guides users through the process naturally.