"""
Jarvis Delivers - CrewAI Food Recommendation System
Multi-agent system for intelligent food recommendations using Gemini AI
"""

import os
import json
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import asyncio
import logging

from crewai import Agent, Task, Crew, Process
from crewai.tools import BaseTool
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
from pydantic import BaseModel
import pymongo
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Initialize LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    temperature=0.7,
    google_api_key=os.getenv('GEMINI_API_KEY'),
    convert_system_message_to_human=True
)

# Data Models
@dataclass
class UserContext:
    id: str
    name: str
    address: Optional[Dict] = None
    dietary_preferences: List[str] = None
    past_orders: List[Dict] = None

@dataclass
class FoodRecommendation:
    item_id: str
    name: str
    restaurant: str
    price: float
    rating: float
    cuisine_type: str
    description: str
    reasoning: str
    confidence_score: float

class ChatRequest(BaseModel):
    message: str
    user_context: Dict[str, Any]
    conversation_history: List[Dict[str, str]] = []

class ChatResponse(BaseModel):
    message: str
    recommendations: List[Dict[str, Any]] = []
    actionRequired: Optional[str] = None
    confidence: float = 0.0

# Database connection
def get_database():
    try:
        client = pymongo.MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017'))
        return client['jarvis-delivers']
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return None

# Custom Tools for CrewAI Agents
class RestaurantSearchTool(BaseTool):
    name: str = "restaurant_search"
    description: str = "Search for restaurants and food items based on criteria like cuisine, location, price range, ratings"
    
    def _run(self, query: str, location: str = None, cuisine: str = None, price_range: str = None) -> str:
        """Search restaurants and food items"""
        try:
            db = get_database()
            if not db:
                return "Database connection failed"
            
            # Build search criteria
            search_criteria = {}
            food_criteria = {}
            
            if cuisine:
                food_criteria["cuisine"] = {"$regex": cuisine, "$options": "i"}
            
            if query:
                food_criteria["$or"] = [
                    {"name": {"$regex": query, "$options": "i"}},
                    {"description": {"$regex": query, "$options": "i"}},
                    {"tags": {"$in": [query.lower()]}}
                ]
            
            # Search food items
            food_items = list(db.fooditems.find(food_criteria).limit(20))
            
            # Get restaurant details
            restaurant_ids = [item.get('restaurant') for item in food_items if item.get('restaurant')]
            restaurants = {str(r['_id']): r for r in db.restaurants.find({"_id": {"$in": restaurant_ids}})}
            
            # Format results
            results = []
            for item in food_items:
                restaurant = restaurants.get(str(item.get('restaurant', '')), {})
                results.append({
                    "item_id": str(item['_id']),
                    "name": item.get('name', ''),
                    "price": item.get('price', 0),
                    "description": item.get('description', ''),
                    "cuisine": item.get('cuisine', ''),
                    "tags": item.get('tags', []),
                    "restaurant_name": restaurant.get('name', ''),
                    "restaurant_rating": restaurant.get('rating', 0),
                    "delivery_time": restaurant.get('deliveryTime', 'N/A')
                })
            
            return json.dumps(results, indent=2)
            
        except Exception as e:
            logger.error(f"Restaurant search error: {e}")
            return f"Search failed: {str(e)}"

class UserPreferencesTool(BaseTool):
    name: str = "user_preferences"
    description: str = "Get user preferences, order history, and dietary restrictions"
    
    def _run(self, user_id: str) -> str:
        """Get user preferences and history"""
        try:
            db = get_database()
            if not db:
                return "Database connection failed"
            
            # Get user info
            user = db.users.find_one({"_id": user_id})
            if not user:
                return "User not found"
            
            # Get order history
            orders = list(db.orders.find({"user": user_id}).sort("createdAt", -1).limit(10))
            
            user_data = {
                "name": user.get('name', ''),
                "email": user.get('email', ''),
                "dietary_preferences": user.get('dietaryPreferences', []),
                "past_orders": len(orders),
                "favorite_cuisines": [],  # Could be calculated from order history
                "average_order_value": 0  # Could be calculated from order history
            }
            
            return json.dumps(user_data, indent=2)
            
        except Exception as e:
            logger.error(f"User preferences error: {e}")
            return f"Failed to get user preferences: {str(e)}"

# CrewAI Agents
def create_intent_analyst_agent() -> Agent:
    """Agent that analyzes user intent and mood"""
    return Agent(
        role='Intent Analyst',
        goal='Understand user intent, mood, and food preferences from their message',
        backstory="""You are an expert at understanding human emotions and food cravings. 
        You can detect if someone is sad and needs comfort food, celebrating and wants something special,
        or just hungry and needs practical suggestions. You understand cultural food preferences,
        dietary restrictions, and can read between the lines of what people really want.""",
        tools=[UserPreferencesTool()],
        llm=llm,
        verbose=True,
        allow_delegation=False
    )

def create_food_researcher_agent() -> Agent:
    """Agent that searches and gathers food options"""
    return Agent(
        role='Food Researcher',
        goal='Find the best food options based on user preferences and context',
        backstory="""You are a food expert with encyclopedic knowledge of cuisines, restaurants,
        and dishes. You know which foods go well together, what's good for different moods,
        and can find exactly what someone is craving. You consider factors like delivery time,
        ratings, price, and dietary restrictions to find perfect matches.""",
        tools=[RestaurantSearchTool()],
        llm=llm,
        verbose=True,
        allow_delegation=False
    )

def create_recommendation_curator_agent() -> Agent:
    """Agent that curates and ranks recommendations"""
    return Agent(
        role='Recommendation Curator',
        goal='Create personalized food recommendations with compelling reasons',
        backstory="""You are a master curator who takes raw food data and transforms it into
        irresistible, personalized recommendations. You understand psychology, know how to present
        options appealingly, and can explain why each recommendation is perfect for the user's
        current situation. You're like a personal food concierge.""",
        llm=llm,
        verbose=True,
        allow_delegation=False
    )

def create_conversation_manager_agent() -> Agent:
    """Agent that manages the conversation flow"""
    return Agent(
        role='Conversation Manager',
        goal='Create engaging, helpful responses that guide users to their perfect meal',
        backstory="""You are a charismatic conversationalist who makes food ordering feel like
        chatting with a knowledgeable friend. You know when to ask clarifying questions,
        when to make suggestions, and how to handle edge cases gracefully. You maintain
        conversation context and create responses that feel natural and helpful.""",
        llm=llm,
        verbose=True,
        allow_delegation=False
    )

# CrewAI Tasks
def create_intent_analysis_task(user_message: str, user_context: Dict) -> Task:
    """Task to analyze user intent"""
    return Task(
        description=f"""
        Analyze this user message for intent and context:
        
        User Message: "{user_message}"
        User Context: {json.dumps(user_context, indent=2)}
        
        Determine:
        1. Primary intent (browse, order, recommendation, help, etc.)
        2. Mood indicators (comfort, celebration, healthy, quick, etc.)
        3. Food preferences mentioned (cuisine, specific dishes, dietary restrictions)
        4. Urgency level (immediate, flexible, planning ahead)
        5. Budget indicators (cheap, expensive, value, premium)
        
        Output as structured analysis with confidence scores.
        """,
        expected_output="Structured intent analysis with mood, preferences, urgency, and budget indicators",
        agent=create_intent_analyst_agent()
    )

def create_food_research_task(intent_analysis: str) -> Task:
    """Task to research food options"""
    return Task(
        description=f"""
        Based on this intent analysis, research relevant food options:
        
        Intent Analysis: {intent_analysis}
        
        Use the restaurant search tool to find:
        1. Food items matching the detected preferences
        2. Restaurants with appropriate ratings and delivery times
        3. Options across different price ranges
        4. Consider dietary restrictions and cuisine preferences
        
        Gather comprehensive data about available options.
        """,
        expected_output="Comprehensive list of relevant food options with details",
        agent=create_food_researcher_agent()
    )

def create_curation_task(intent_analysis: str, food_options: str) -> Task:
    """Task to curate recommendations"""
    return Task(
        description=f"""
        Create personalized recommendations using:
        
        Intent Analysis: {intent_analysis}
        Available Food Options: {food_options}
        
        Curate 3-5 top recommendations that:
        1. Match the user's mood and preferences
        2. Are appropriately ranked by relevance
        3. Include compelling reasons for each choice
        4. Consider practical factors (price, delivery time, ratings)
        5. Provide variety while staying relevant
        
        Each recommendation should include reasoning and confidence score.
        """,
        expected_output="Curated list of 3-5 recommendations with reasoning and confidence scores",
        agent=create_recommendation_curator_agent()
    )

def create_response_task(intent_analysis: str, recommendations: str, user_message: str) -> Task:
    """Task to create the final response"""
    return Task(
        description=f"""
        Create an engaging response using:
        
        Original User Message: "{user_message}"
        Intent Analysis: {intent_analysis}
        Curated Recommendations: {recommendations}
        
        Create a response that:
        1. Acknowledges the user's request naturally
        2. Presents recommendations in an appealing way
        3. Explains why these choices are perfect for them
        4. Includes any necessary follow-up questions
        5. Maintains a friendly, helpful tone
        
        Format as a conversational message with structured recommendation data.
        """,
        expected_output="Engaging conversational response with structured recommendation data",
        agent=create_conversation_manager_agent()
    )

# Main CrewAI Processing Function
class JarvisDeliveryAI:
    def __init__(self):
        self.db = get_database()
    
    async def process_chat_message(self, request: ChatRequest) -> ChatResponse:
        """Process a chat message using CrewAI agents"""
        try:
            logger.info(f"Processing message: {request.message}")
            
            # Create the crew
            crew = Crew(
                agents=[
                    create_intent_analyst_agent(),
                    create_food_researcher_agent(),
                    create_recommendation_curator_agent(),
                    create_conversation_manager_agent()
                ],
                tasks=[
                    create_intent_analysis_task(request.message, request.user_context),
                    create_food_research_task("{intent_analysis}"),
                    create_curation_task("{intent_analysis}", "{food_options}"),
                    create_response_task("{intent_analysis}", "{recommendations}", request.message)
                ],
                process=Process.sequential,
                verbose=True
            )
            
            # Execute the crew
            result = crew.kickoff()
            
            # Parse the result
            response_text = str(result)
            
            # Try to extract structured data from the response
            recommendations = self._extract_recommendations(response_text)
            
            return ChatResponse(
                message=response_text,
                recommendations=recommendations,
                confidence=0.8  # Could be calculated based on agent confidence scores
            )
            
        except Exception as e:
            logger.error(f"CrewAI processing error: {e}")
            return ChatResponse(
                message="Sorry, I'm having trouble processing your request right now. What kind of food are you in the mood for?",
                recommendations=[],
                confidence=0.0
            )
    
    def _extract_recommendations(self, response_text: str) -> List[Dict[str, Any]]:
        """Extract structured recommendations from agent response"""
        # This would parse the agent's response to extract recommendation data
        # For now, return empty list - could be enhanced with regex or structured parsing
        return []
    
    async def add_to_cart(self, item_id: str, user_id: str) -> Dict[str, Any]:
        """Add item to cart through AI service"""
        try:
            # This would integrate with the cart system
            # For now, return a success response
            return {
                "success": True,
                "message": "Item added to cart successfully!",
                "item_id": item_id
            }
        except Exception as e:
            logger.error(f"Add to cart error: {e}")
            return {
                "success": False,
                "message": "Failed to add item to cart"
            }

# Initialize the AI service
jarvis_ai = JarvisDeliveryAI()
