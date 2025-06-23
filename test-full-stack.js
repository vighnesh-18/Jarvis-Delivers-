// Test script to verify the full stack integration
const testFullStackIntegration = async () => {
  console.log('🧪 Testing Full Stack Integration...\n');

  try {
    // Test 1: AI Service Direct
    console.log('1️⃣ Testing AI Service Direct...');
    const aiResponse = await fetch('http://localhost:8000/process-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'I want sushi',
        user_context: { id: 'test', name: 'Test User' },
        conversation_history: []
      })
    });
    
    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      console.log('✅ AI Service Response:', aiData.message);
    } else {
      console.log('❌ AI Service Failed:', aiResponse.status);
    }

    // Test 2: Backend Integration
    console.log('\n2️⃣ Testing Backend Integration...');
    const backendResponse = await fetch('http://localhost:5002/api/chat/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'I want sushi',
        userAddress: '123 Test St',
        conversationHistory: []
      })
    });

    if (backendResponse.ok) {
      const backendData = await backendResponse.json();
      console.log('✅ Backend Response:', backendData.message);
      console.log('✅ Integration Working! Backend successfully fetched AI response.');
    } else {
      console.log('❌ Backend Failed:', backendResponse.status);
    }

    console.log('\n🎉 Full Stack Integration Test Complete!');
    console.log('🔗 Frontend URL: http://localhost:5173');
    console.log('🤖 Test the chatbot in your browser now!');

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
};

testFullStackIntegration();
