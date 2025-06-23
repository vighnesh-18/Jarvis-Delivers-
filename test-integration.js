// Test script to verify AI service integration
const fetch = require('node-fetch');

const AI_SERVICE_URL = 'http://localhost:8000';

async function testIntegration() {
    console.log('🔧 Testing AI Service Integration...\n');
    
    try {
        // Test 1: Health check
        console.log('1. Testing Health Check...');
        const healthResponse = await fetch(`${AI_SERVICE_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health Check:', healthData);
        
        // Test 2: Chat endpoint
        console.log('\n2. Testing Chat Endpoint...');
        const chatRequest = {
            message: "I'm craving some spicy food",
            user_context: {
                id: "test-user-123",
                name: "Test User",
                address: { city: "Test City" }
            },
            conversation_history: []
        };
        
        const chatResponse = await fetch(`${AI_SERVICE_URL}/process-chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatRequest)
        });
        
        if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            console.log('✅ Chat Response:', JSON.stringify(chatData, null, 2));
        } else {
            console.log('❌ Chat endpoint error:', chatResponse.status, await chatResponse.text());
        }
        
    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
    }
}

testIntegration();
