"""
Configuration module for the AI service.
Handles environment variables, API keys, and database connections.
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai
from pymongo import MongoClient
from typing import Optional

# Load environment variables
load_dotenv()

class Config:    
    """Configuration class for AI service settings"""
    
    # API Keys and URLs
    GEMINI_API_KEY: str = os.getenv("GOOGLE_API_KEY", os.getenv("GEMINI_API_KEY", ""))
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/jarvis-delivers")
    NODE_BACKEND_URL: str = os.getenv("NODE_BACKEND_URL", "http://localhost:5002")
    AI_SERVICE_PORT: int = int(os.getenv("AI_SERVICE_PORT", 8000))
    
    # AI Model Settings
    GEMINI_MODEL: str = "gemini-1.5-flash"
    MAX_TOKENS: int = 1000
    TEMPERATURE: float = 0.7
    
    # Database Settings
    DB_NAME: str = "jarvis-delivers"
    COLLECTIONS = {
        "users": "users",
        "restaurants": "restaurants",
        "food_items": "fooditems",
        "orders": "orders"
    }
    
    # Search Limits
    MAX_FOOD_RESULTS: int = 10
    MAX_RESTAURANT_RESULTS: int = 5
    
    @classmethod
    def validate_config(cls) -> bool:        
        """Validate that all required configuration is present"""
        if not cls.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is required")
        return True
    
    @classmethod
    def get_mongo_client(cls) -> MongoClient:
        """Get MongoDB client instance"""
        return MongoClient(cls.MONGODB_URI)
    
    @classmethod
    def get_gemini_model(cls):
        """Get configured Gemini model for CrewAI"""
        # For CrewAI with LiteLLM, use the proper gemini model format
        return f"gemini/{cls.GEMINI_MODEL}"
    
    @classmethod
    def get_gemini_direct(cls):
        """Get direct Gemini model instance for non-CrewAI usage"""
        genai.configure(api_key=cls.GEMINI_API_KEY)
        return genai.GenerativeModel(cls.GEMINI_MODEL)
    
    @classmethod
    def get_gemini_llm(cls):
        """Get configured CrewAI LLM instance for Gemini - Updated for newer CrewAI versions"""
        from crewai import LLM
        
        # Set environment variable to ensure CrewAI uses Gemini
        import os
        os.environ["GOOGLE_API_KEY"] = cls.GEMINI_API_KEY
        
        return LLM(
            model="gemini/gemini-1.5-flash",
            api_key=cls.GEMINI_API_KEY,
            temperature=cls.TEMPERATURE,
            base_url=None  # Use default Gemini endpoint
        )

# Initialize configuration
config = Config()
config.validate_config()
