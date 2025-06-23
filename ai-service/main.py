"""
FastAPI server for the AI-powered food recommendation service.
Uses CrewAI with specialized agents for intelligent food recommendations.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import uvicorn

# Import our modular CrewAI implementation
from src.crews.food_crew import food_crew
from src.config.settings import config
from src.utils.helpers import validate_user_message, validate_user_context, log_crew_activity

# Initialize FastAPI app
app = FastAPI(
    title="Jarvis Delivers AI Service",
    description="CrewAI-powered food recommendation service with Gemini AI",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5002"],  # Frontend and backend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class UserContext(BaseModel):
    id: str
    name: Optional[str] = None
    address: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str
    user_context: UserContext
    conversation_history: Optional[List[Dict[str, Any]]] = []

class CartRequest(BaseModel):
    item_id: str
    user_id: str
    quantity: Optional[int] = 1

class ChatResponse(BaseModel):
    message: str
    recommendations: List[Dict[str, Any]]
    actionRequired: Optional[Dict[str, Any]] = None
    user_context: Optional[Dict[str, Any]] = None
    processed_at: Optional[str] = None

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Jarvis Delivers AI Service",
        "version": "1.0.0",
        "ai_model": config.GEMINI_MODEL
    }

# Main chat processing endpoint
@app.post("/process-chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    """
    Process user chat message through CrewAI workflow
    
    Args:
        request (ChatRequest): Chat request with message and user context
        
    Returns:
        ChatResponse: AI-generated response with recommendations
    """
    try:        # Validate input
        if not validate_user_message(request.message):
            raise HTTPException(status_code=400, detail="Invalid message format")
        
        if not validate_user_context(request.user_context.dict()):
            raise HTTPException(status_code=400, detail="Invalid user context")
        
        log_crew_activity("Processing chat request", {
            "user_id": request.user_context.id,
            "message_length": len(request.message)
        })
        
        try:
            # Process through CrewAI
            result = food_crew.process_user_query(
                user_message=request.message,
                user_context=request.user_context.dict()
            )
        except Exception as crew_error:            # Check if it's a quota/rate limit error
            error_str = str(crew_error)
            if "quota" in error_str.lower() or "rate" in error_str.lower() or "429" in error_str:
                log_crew_activity("Quota exceeded - using fallback response", {"error": error_str})
                
                # Smart fallback based on user message keywords
                user_msg_lower = request.message.lower()
                fallback_recommendations = []
                fallback_message = ""
                
                if any(word in user_msg_lower for word in ["pizza", "italian"]):
                    fallback_message = "My AI chef is taking a quick break, but I know you want pizza! 🍕 Here are some amazing options:"
                    fallback_recommendations = [
                        {
                            "id": "pizza_1", 
                            "name": "Margherita Pizza", 
                            "price": 14.99,
                            "restaurant": "Pizza Paradise",
                            "description": "Classic Italian pizza with fresh mozzarella, tomato sauce, and basil leaves on a crispy wood-fired crust.",
                            "category": "Pizza",
                            "rating": 4.5,
                            "preparationTime": "15 mins"
                        },
                        {
                            "id": "pizza_2",
                            "name": "Pepperoni Pizza",
                            "price": 16.99,
                            "restaurant": "Pizza Paradise",
                            "description": "Classic pepperoni pizza with mozzarella cheese and spicy pepperoni slices on a hand-tossed crust.",
                            "category": "Pizza", 
                            "rating": 4.6,
                            "preparationTime": "18 mins"
                        }
                    ]
                elif any(word in user_msg_lower for word in ["sushi", "japanese", "roll"]):
                    fallback_message = "Even without my AI powers, I can tell you love sushi! 🍣 Check these out:"
                    fallback_recommendations = [
                        {
                            "id": "sushi_1",
                            "name": "California Roll",
                            "price": 8.99,
                            "restaurant": "Sushi Zen",
                            "description": "Crab, avocado and cucumber rolled in rice and nori, topped with sesame seeds.",
                            "category": "Sushi",
                            "rating": 4.4,
                            "preparationTime": "10 mins"
                        },
                        {
                            "id": "sushi_2",
                            "name": "Salmon Roll",
                            "price": 12.99,
                            "restaurant": "Sushi Zen",
                            "description": "Fresh salmon with cucumber and avocado wrapped in seasoned sushi rice and nori.",
                            "category": "Sushi",
                            "rating": 4.8,
                            "preparationTime": "10 mins"
                        }
                    ]
                elif any(word in user_msg_lower for word in ["indian", "curry", "spicy"]):
                    fallback_message = "My AI is recharging, but I know great Indian food! 🍛 Try these:"
                    fallback_recommendations = [
                        {
                            "id": "indian_1",
                            "name": "Paneer Butter Masala",
                            "price": 18.38,
                            "restaurant": "Spice Garden",
                            "description": "Soft paneer cubes simmered in a rich, creamy tomato and butter sauce with aromatic Indian spices.",
                            "category": "Indian",
                            "rating": 4.7,
                            "preparationTime": "25 mins"
                        },
                        {
                            "id": "indian_2",
                            "name": "Chicken Tikka Masala",
                            "price": 19.99,
                            "restaurant": "Spice Garden",
                            "description": "Tender chicken pieces marinated in yogurt and spices, cooked in a rich, creamy tomato-based curry sauce.",
                            "category": "Indian",
                            "rating": 4.9,
                            "preparationTime": "30 mins"
                        }
                    ]
                else:
                    # General fallback for all other requests
                    fallback_message = "I'm experiencing high demand right now! 🔥 But here are some popular dishes I think you'll love:"
                    fallback_recommendations = [
                        {
                            "id": "popular_1",
                            "name": "Chicken Caesar Salad",
                            "price": 13.99,
                            "restaurant": "Green Garden Cafe",
                            "description": "Crisp romaine lettuce, grilled chicken, parmesan cheese, and croutons with Caesar dressing.",
                            "category": "Salad",
                            "rating": 4.3,
                            "preparationTime": "12 mins"
                        },
                        {
                            "id": "popular_2",
                            "name": "BBQ Burger",
                            "price": 15.99,
                            "restaurant": "Burger Junction",
                            "description": "Juicy beef patty with BBQ sauce, bacon, cheese, lettuce, and tomato on a toasted bun.",
                            "category": "Burger",
                            "rating": 4.5,
                            "preparationTime": "20 mins"
                        },
                        {
                            "id": "popular_3",
                            "name": "Pad Thai",
                            "price": 14.99,
                            "restaurant": "Bangkok Street",
                            "description": "Stir-fried rice noodles with shrimp, tofu, bean sprouts, and peanuts in a tangy tamarind sauce.",
                            "category": "Thai",
                            "rating": 4.6,
                            "preparationTime": "18 mins"
                        }
                    ]
                
                return ChatResponse(
                    message=fallback_message,
                    recommendations=fallback_recommendations,
                    actionRequired={
                        "type": "add_to_cart",
                        "message": "Would you like to add any of these to your cart?"
                    },
                    user_context=request.user_context.dict(),
                    processed_at=f"{__import__('datetime').datetime.now().isoformat()}"
                )
            else:
                # Re-raise non-quota errors
                raise crew_error
        
        log_crew_activity("Chat processing completed", {
            "user_id": request.user_context.id,
            "recommendations_count": len(result.get('recommendations', []))
        })
        
        return ChatResponse(**result)
        
    except Exception as e:
        log_crew_activity("Chat processing error", {"error": str(e)})
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

# Add to cart endpoint
@app.post("/add-to-cart")
async def add_to_cart(request: CartRequest):
    """
    Add item to user's cart
    
    Args:
        request (CartRequest): Cart request with item and user details
        
    Returns:
        Dict: Cart operation result
    """
    try:
        if not request.item_id or not request.user_id:
            raise HTTPException(status_code=400, detail="Item ID and User ID are required")
        
        log_crew_activity("Adding item to cart", {
            "user_id": request.user_id,
            "item_id": request.item_id,
            "quantity": request.quantity
        })
        
        result = food_crew.add_to_cart(
            item_id=request.item_id,
            user_id=request.user_id,
            quantity=request.quantity
        )
        
        return result
        
    except Exception as e:
        log_crew_activity("Cart operation error", {"error": str(e)})
        raise HTTPException(status_code=500, detail=f"Cart operation failed: {str(e)}")

# Get recommendations endpoint (alternative to chat)
@app.post("/recommendations")
async def get_recommendations(request: Dict[str, Any]):
    """
    Get food recommendations based on filters
    
    Args:
        request (Dict): Request with filters and preferences
        
    Returns:
        Dict: Recommendations response
    """
    try:
        # This could be a simplified version of the chat workflow
        # For now, return a basic response
        return {
            "recommendations": [],
            "message": "Recommendations endpoint - use /process-chat for full AI experience"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendations failed: {str(e)}")

# Debug endpoint for development
@app.get("/debug/config")
async def debug_config():
    """Debug endpoint to check configuration (development only)"""
    return {
        "gemini_configured": bool(config.GEMINI_API_KEY),
        "mongodb_uri": config.MONGODB_URI.replace(config.MONGODB_URI.split('@')[0].split('//')[1], "***") if '@' in config.MONGODB_URI else config.MONGODB_URI,
        "model": config.GEMINI_MODEL,
        "db_name": config.DB_NAME
    }

# Test endpoint for development
@app.get("/test-crew")
async def test_crew():
    """Test endpoint to verify CrewAI is working"""
    try:
        # Create a test request
        test_result = food_crew.process_user_query(
            user_message="I'm feeling sad and want some comfort food",
            user_context={"name": "Test User", "id": "test123"}
        )
        
        return {
            "status": "success", 
            "test_result": test_result
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

if __name__ == "__main__":
    print(f"🚀 Starting Jarvis Delivers AI Service on port {config.AI_SERVICE_PORT}")
    print(f"🤖 Using Gemini AI model: {config.GEMINI_MODEL}")
    print(f"🍕 Ready to serve intelligent food recommendations!")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=config.AI_SERVICE_PORT,
        reload=True,
        log_level="info"
    )
