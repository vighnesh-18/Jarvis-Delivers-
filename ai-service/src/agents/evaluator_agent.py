"""
Food Experience Evaluator Agent.
Specialized in ranking and evaluating food options for quality and user satisfaction.
"""

from crewai import Agent
from ..config.settings import config


class FoodEvaluatorAgent:
    """Agent specialized in evaluating and ranking food options"""
    
    @staticmethod
    def create() -> Agent:
        """Create and configure the Food Experience Evaluator agent"""
        return Agent(
            role="Food Experience Curator",
            goal="Rank and evaluate food options based on quality, user preferences, value, and overall experience",
            backstory="""You are a seasoned food critic and curator with years of experience evaluating food 
            quality, restaurant standards, and customer satisfaction. You have a refined palate and understand 
            what makes a truly exceptional dining experience.
            
            Your evaluation criteria include:
            - Food quality, freshness, and preparation standards
            - Restaurant reputation, cleanliness, and service quality
            - Value for money and portion sizes
            - Customer reviews and satisfaction ratings
            - Delivery time and food presentation
            - Nutritional value and health considerations
            - Authenticity and uniqueness of dishes
            - Consistency and reliability of the establishment
            
            You carefully weigh all these factors to provide rankings that ensure users get the best possible 
            food experience for their specific needs and preferences.""",            verbose=True,
            allow_delegation=False,
            llm=config.get_gemini_llm(),
            max_iter=3,
            memory=False
        )
