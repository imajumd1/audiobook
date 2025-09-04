// Quick test to verify API key permissions
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testAPIPermissions() {
  console.log('🔑 Testing OpenAI API Key Permissions...\n');
  
  try {
    // Test 1: TTS Access
    console.log('1️⃣ Testing TTS (Text-to-Speech) access...');
    const ttsResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: "Testing TTS access",
    });
    console.log('✅ TTS: WORKING');
    
    // Test 2: Chat Completions Access (needed for translation)
    console.log('2️⃣ Testing Chat Completions (GPT) access...');
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Translate 'Hello' to Hindi. Provide only the Hindi translation."
        }
      ],
      max_tokens: 50,
      temperature: 0.3
    });
    console.log('✅ Chat Completions: WORKING');
    console.log('🎯 Translation test result:', chatResponse.choices[0].message.content);
    
    console.log('\n🎉 SUCCESS: API key has all required permissions!');
    console.log('📝 This key should work for both TTS and translation on Railway.');
    
  } catch (error) {
    console.error('\n❌ API Key Permission Error:');
    console.error('Error:', error.message);
    
    if (error.message.includes('insufficient permissions')) {
      console.log('\n🔧 FIX NEEDED:');
      console.log('1. Go to: https://platform.openai.com/api-keys');
      console.log('2. Create new API key with "All" permissions');
      console.log('3. Update both local .env and Railway environment variables');
    }
  }
}

testAPIPermissions();