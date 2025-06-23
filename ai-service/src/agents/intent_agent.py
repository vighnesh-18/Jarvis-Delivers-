"""
Food Intent Analyzer Agent.
Specialized in understanding user food preferences, mood, and dietary requirements.
"""

from crewai import Agent
from ..config.settings import config


class FoodIntentAgent:
    """Agent specialized in analyzing user food intent and preferences"""
    
    @staticmethod
    def create() -> Agent:
        """Create and configure the Food Intent Analyzer agent"""
        return Agent(
            role="Food Intent Analyzer",
            goal="Understand user's food preferences, mood, budget, and dietary requirements from their message",
            backstory="""You are an empathetic food psychologist who understands the deep connection between 
            emotions and food choices. You have years of experience reading between the lines to understand 
            what someone really craves based on their mood, situation, and preferences.
            
            You're particularly skilled at:
            - Detecting emotional states that influence food choices
            - Understanding budget constraints from subtle hints
            - Identifying dietary restrictions and preferences
            - Recognizing urgency levels (quick bite vs leisurely meal)
            - Picking up on cultural and regional food preferences
              You analyze every message with care and empathy, always considering the human behind the request.""",
            verbose=True,
            allow_delegation=False,
            llm=config.get_gemini_llm(),
            max_iter=3,
            memory=False  # Disabled to prevent OpenAI embeddings usage
        )
