import Restaurant from '../models/Restaurant.js';
import FoodItem from '../models/FoodItem.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// AI Service Integration (Python CrewAI + Gemini)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Helper function to check if a string is a valid ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && (new mongoose.Types.ObjectId(id)).toString() === id;
};

// Main Controller Functions
const processUserQuery = async (req, res) => {
  try {
    const { message, userAddress, conversationHistory, userId } = req.body;
    
    // Get user from auth middleware or fallback to request body
    const authenticatedUserId = req.user?.id || req.user?._id || userId;
    
    // Only try to fetch user if we have a valid ObjectId
    let user = null;
    if (authenticatedUserId && isValidObjectId(authenticatedUserId)) {
      try {
        user = await User.findById(authenticatedUserId);
      } catch (error) {
        console.log('User lookup failed:', error.message);
      }
    }

    console.log('Chat Request:', { 
      message, 
      userId: authenticatedUserId, 
      userExists: !!user,
      userAddress 
    });    // Prepare request for Python AI service
    const aiRequest = {
      message,
      user_context: {
        id: authenticatedUserId || 'anonymous',
        name: user?.name || user?.email || 'friend',
        address: userAddress ? { full_address: userAddress } : null
      },
      conversation_history: conversationHistory || []
    };    console.log('Sending AI Request:', JSON.stringify(aiRequest, null, 2));

    // Call Python AI service with CrewAI
    const response = await fetch(`${AI_SERVICE_URL}/process-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aiRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Service Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      });
      throw new Error(`AI Service responded with status: ${response.status} - ${errorText}`);
    }    const aiResponse = await response.json();
    console.log('AI Response Received:', JSON.stringify(aiResponse, null, 2));
    
    res.json(aiResponse);

  } catch (error) {
    console.error('Process User Query Error:', error);
    
    // Fallback response if AI service is down
    res.json({
      message: "Sorry, our AI chef is taking a quick break! 👨‍🍳 But I can still help you find great food. What are you in the mood for?",
      recommendations: [],
      actionRequired: null
    });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { filters } = req.body;
    const userId = req.user?.id || req.user?._id || 'anonymous';
    
    // For now, return a simple response
    // This could also integrate with the AI service for more advanced recommendations
    res.json({ 
      recommendations: [],
      message: "Let me know what you're craving and I'll find the perfect match!"
    });
  } catch (error) {
    console.error('Get Recommendations Error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

const addToCartFromChat = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user?.id || req.user?._id || 'anonymous';
    
    // Call Python AI service for cart operations
    const aiRequest = {
      item_id: itemId,
      user_id: userId
    };

    const response = await fetch(`${AI_SERVICE_URL}/add-to-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aiRequest)
    });

    if (!response.ok) {
      throw new Error(`AI Service responded with status: ${response.status}`);
    }

    const result = await response.json();
    res.json(result);

  } catch (error) {
    console.error('Add to Cart from Chat Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add item to cart' 
    });
  }
};

export {
  processUserQuery,
  getRecommendations,
  addToCartFromChat
};
