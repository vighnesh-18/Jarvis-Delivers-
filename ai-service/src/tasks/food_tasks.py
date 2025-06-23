"""
Food recommendation tasks for CrewAI workflow.
Defines all tasks that agents will perform in the food recommendation pipeline.
"""

from crewai import Task
from typing import List


class FoodRecommendationTasks:
    """Collection of tasks for the food recommendation workflow"""
    
    @staticmethod
    def create_intent_analysis_task(user_message: str, user_context: dict = None) -> Task:
        """
        Create task for analyzing user intent and preferences
        
        Args:
            user_message (str): The user's message requesting food recommendations
            user_context (dict): Additional context about the user
            
        Returns:
            Task: CrewAI task for intent analysis
        """
        user_name = user_context.get('name', 'friend') if user_context else 'friend'
        
        return Task(
            description=f"""
            Analyze this user message to understand their food preferences and intent: "{user_message}"
            
            User context: {user_context if user_context else 'No additional context provided'}
            
            Extract and return a comprehensive JSON object with the following structure:
            {{
                "mood": "comfort|celebration|healthy|casual|adventurous|null",
                "budget": "low|medium|high|null", 
                "foodType": "specific cuisine or food type mentioned (e.g., pizza, indian, chinese)",
                "preferences": ["array of dietary preferences like vegetarian, vegan, spicy, healthy, etc."],
                "urgency": "fast|normal|relaxed",
                "emotional_context": "brief description of user's emotional state or situation",
                "meal_type": "breakfast|lunch|dinner|snack|null",
                "serving_size": "individual|sharing|party|null",
                "health_goals": "weight_loss|muscle_gain|maintenance|comfort|null"
            }}
            
            Analysis guidelines:
            - Be empathetic and read between the lines
            - Consider phrases like "I'm feeling down" = comfort food needed
            - "Broke" or "budget" = low budget preference
            - "Celebration" or "special occasion" = higher budget, special items
            - "Quick bite" = fast urgency
            - "Healthy" mentions = health-conscious preferences
            - Cultural or regional mentions = specific cuisine preferences
            
            Provide thorough analysis based on explicit and implicit cues in the message.
            """,
            expected_output="JSON object with comprehensive analyzed user intent and preferences",
            agent=None  # Will be set when creating the crew
        )
    
    @staticmethod
    def create_food_discovery_task() -> Task:
        """
        Create task for discovering relevant food options
        
        Returns:
            Task: CrewAI task for food discovery
        """
        return Task(
            description="""
            Based on the analyzed user intent and preferences, discover the most relevant food options.
            
            Use the available tools to:
            1. Search for food items that match the user's preferences using food_search tool
            2. Search for restaurants that align with their cuisine preferences using restaurant_search tool
            3. Consider budget constraints, dietary restrictions, and mood preferences
            
            Search strategy:
            - Start with specific food type if mentioned
            - Include budget-appropriate options
            - Filter by dietary restrictions (vegetarian, vegan, etc.)
            - Consider mood-based selections (comfort food, healthy options, celebration food)
            - Include variety in cuisine types when appropriate
            
            Return a comprehensive list of relevant food items and restaurants with all available details:
            - Food items with pricing, descriptions, restaurant info
            - Restaurant information with ratings, delivery times, specialties
            - Ensure options match the user's analyzed intent
            
            Focus on quality options that will satisfy the user's stated and implied needs.
            """,
            expected_output="Comprehensive list of relevant food options and restaurants with detailed information",
            agent=None,  # Will be set when creating the crew
            context=[]   # Will include intent analysis task
        )
    
    @staticmethod
    def create_evaluation_task() -> Task:
        """
        Create task for evaluating and ranking food options
        
        Returns:
            Task: CrewAI task for food evaluation
        """
        return Task(
            description="""
            Evaluate and rank the discovered food options based on multiple criteria to ensure the best recommendations.
            
            Evaluation criteria (in order of importance):
            1. **Match to User Intent**: How well does each option match the user's stated preferences, mood, and needs?
            2. **Quality Indicators**: Restaurant ratings, food ratings, customer reviews
            3. **Value for Money**: Price appropriateness for the quality and quantity offered
            4. **Delivery Experience**: Estimated delivery time, restaurant reliability
            5. **Health Considerations**: Nutritional value, freshness, preparation quality
            6. **Uniqueness**: Special or standout items that provide exceptional experience
            
            Ranking process:
            - Score each option on a 1-10 scale for each criterion
            - Weight scores based on user intent (e.g., budget-conscious users prioritize value)
            - Consider user's emotional context for final ranking
            - Ensure dietary restrictions are absolutely respected
            
            Return the top 3-5 ranked options with:
            - Overall scores and reasoning for each ranking
            - Specific benefits that align with user needs
            - Any potential concerns or considerations
            - Clear explanation of why each option was selected
            
            Focus on providing options that will truly satisfy and delight the user.
            """,
            expected_output="Top 3-5 ranked food options with detailed evaluation scores and reasoning",
            agent=None,  # Will be set when creating the crew
            context=[]   # Will include intent analysis and discovery tasks
        )
    
    @staticmethod
    def create_recommendation_task(user_name: str = "friend") -> Task:
        """
        Create task for generating personalized recommendations
        
        Args:
            user_name (str): User's name for personalization
            
        Returns:
            Task: CrewAI task for recommendation generation
        """
        return Task(
            description=f"""
            Create a personalized, engaging food recommendation for "{user_name}" based on all the analysis and evaluation completed.
            
            Your response should be warm, conversational, and enthusiastic about food. Address the user directly and make them excited about their options.
              Response structure - Return a JSON object with:
            {{
                "message": "Short, friendly recommendation message (1-2 sentences, max 50 words)",
                "recommendations": [
                    {{
                        "id": "food_item_id",
                        "name": "Food Name",
                        "price": 12.99,
                        "restaurant": {{
                            "name": "Restaurant Name",
                            "rating": 4.5,
                            "deliveryTime": "25-30 mins"
                        }},
                        "description": "Brief, appetizing description",
                        "why_perfect": "Short explanation of why this matches their needs",
                        "tags": ["vegetarian", "spicy", etc.]
                    }}
                ],
                "actionRequired": {{
                    "type": "add_to_cart",
                    "message": "Would you like me to add the [top item] to your cart?",
                    "item_id": "recommended_item_id"
                }} or null
            }}
            
            Message guidelines:
            - Keep message VERY SHORT and concise (2-3 sentences maximum)
            - Be friendly but brief ("Hey {user_name}! Found some great options for you!")
            - Use minimal emojis (max 1-2)
            - Focus on the recommendations rather than long explanations
            - Keep descriptions under 30 words each
            - Make it chatty but not wordy but also make it witty and sarcastic
            
            Always end with asking if they'd like to add the top recommendation to their cart, unless they specifically mentioned just browsing.
            """,
            expected_output="JSON object with personalized recommendation message and action options",
            agent=None,  # Will be set when creating the crew
            context=[]   # Will include all previous tasks
        )
