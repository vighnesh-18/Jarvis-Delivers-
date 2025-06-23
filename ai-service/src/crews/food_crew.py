"""
Food Recommendation Crew.
Main orchestrator for the CrewAI food recommendation workflow.
"""

from crewai import Crew, Process
from typing import Dict, Any
import json
import re

from ..agents.intent_agent import FoodIntentAgent
from ..agents.discovery_agent import FoodDiscoveryAgent
from ..agents.evaluator_agent import FoodEvaluatorAgent
from ..agents.advisor_agent import FoodAdvisorAgent
from ..tasks.food_tasks import FoodRecommendationTasks
from ..tools.cart_operations import cart_operations
from ..tools.food_search import food_search
from ..tools.restaurant_search import restaurant_search


class FoodRecommendationCrew:
    """
    Main crew orchestrator for food recommendations using CrewAI.
    Coordinates multiple specialized agents to provide personalized food recommendations.
    """
    
    def __init__(self):
        """Initialize the crew with all agents and tools"""        # Initialize agents
        self.intent_agent = FoodIntentAgent.create()
        self.discovery_agent = FoodDiscoveryAgent.create()
        self.evaluator_agent = FoodEvaluatorAgent.create()
        self.advisor_agent = FoodAdvisorAgent.create()
        
        # Tools are now available as function imports
    
    def process_user_query(self, user_message: str, user_context: Dict = None) -> Dict[str, Any]:
        """
        Process user query through the complete CrewAI pipeline
        
        Args:
            user_message (str): User's food request message
            user_context (Dict): Additional context about the user (name, id, address, etc.)
            
        Returns:
            Dict: Complete recommendation response with message, recommendations, and actions
        """
        try:
            # Extract user info for personalization
            user_name = user_context.get('name', 'friend') if user_context else 'friend'
            user_id = user_context.get('id', '') if user_context else ''
            
            # Create tasks for the workflow
            intent_task = FoodRecommendationTasks.create_intent_analysis_task(user_message, user_context)
            discovery_task = FoodRecommendationTasks.create_food_discovery_task()
            evaluation_task = FoodRecommendationTasks.create_evaluation_task()
            recommendation_task = FoodRecommendationTasks.create_recommendation_task(user_name)
            
            # Assign agents to tasks
            intent_task.agent = self.intent_agent
            discovery_task.agent = self.discovery_agent
            evaluation_task.agent = self.evaluator_agent
            recommendation_task.agent = self.advisor_agent
            
            # Set task dependencies (context)
            discovery_task.context = [intent_task]
            evaluation_task.context = [intent_task, discovery_task]
            recommendation_task.context = [intent_task, discovery_task, evaluation_task]            # Create and execute crew
            crew = Crew(
                agents=[self.intent_agent, self.discovery_agent, self.evaluator_agent, self.advisor_agent],
                tasks=[intent_task, discovery_task, evaluation_task, recommendation_task],
                verbose=True,
                process=Process.sequential,
                memory=False,  # Disabled to prevent OpenAI embeddings usage
                max_rpm=10  # Rate limiting for API calls
            )
            
            # Execute the crew workflow
            print(f"🚀 Starting food recommendation workflow for user: {user_name}")
            result = crew.kickoff()
            
            # Parse and format the final result
            formatted_result = self._parse_crew_result(result)
            
            # Add user context to the result
            formatted_result['user_context'] = user_context
            formatted_result['processed_at'] = self._get_timestamp()
            
            print("✅ Food recommendation workflow completed successfully")
            return formatted_result
            
        except Exception as e:
            print(f"❌ Error in crew workflow: {e}")
            return self._create_fallback_response(user_message, user_name)
    
    def add_to_cart(self, item_id: str, user_id: str, quantity: int = 1) -> Dict[str, Any]:
        """
        Add item to cart using the cart tool
        
        Args:
            item_id (str): Food item ID to add
            user_id (str): User ID
            quantity (int): Quantity to add
              Returns:
            Dict: Cart operation result
        """
        try:
            result = self.cart_tool._run("add_item", item_id=item_id, user_id=user_id, quantity=quantity)
            return result
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to add item to cart: {str(e)}'
            }
    
    def _parse_crew_result(self, result: Any) -> Dict[str, Any]:
        """
        Parse and format the crew execution result
        
        Args:
            result: Raw result from crew execution
            
        Returns:
            Dict: Formatted result with message, recommendations, and actions
        """
        try:
            print(f"🔍 DEBUG: Raw crew result type: {type(result)}")
            print(f"🔍 DEBUG: Raw crew result content: {str(result)[:500]}...")
            
            # If result is already a dict, return it
            if isinstance(result, dict):
                print("✅ Result is already a dict, returning as-is")
                return result
            
            # If result is a string, try to extract JSON
            if isinstance(result, str):
                # First try to parse the entire string as JSON
                try:
                    parsed = json.loads(result)
                    print("✅ Successfully parsed entire result as JSON")
                    return parsed
                except json.JSONDecodeError:
                    print("⚠️ Failed to parse entire result as JSON, searching for JSON block...")
                
                # Try to find JSON block in the result string (fixed regex)
                json_match = re.search(r'\{.*\}', result, re.DOTALL)
                if json_match:
                    try:
                        parsed = json.loads(json_match.group())
                        print("✅ Successfully extracted and parsed JSON block")
                        return parsed
                    except json.JSONDecodeError as e:
                        print(f"❌ Failed to parse extracted JSON: {e}")
                
                # If no valid JSON found, check if it contains structured data
                if "recommendations" in result.lower() or "actionrequired" in result.lower():
                    print("⚠️ Result contains recommendation keywords but not valid JSON")
                
                # Create structured response from plain text
                print("📝 Creating structured response from plain text")
                return {
                    "message": result.strip(),
                    "recommendations": [],
                    "actionRequired": None
                }
            
            # Handle other result types (CrewAI task results, etc.)
            if hasattr(result, 'raw'):
                print("🔍 Result has 'raw' attribute, parsing...")
                return self._parse_crew_result(result.raw)
            
            if hasattr(result, 'output'):
                print("🔍 Result has 'output' attribute, parsing...")
                return self._parse_crew_result(result.output)
            
            # Convert to string and try again
            result_str = str(result)
            if result_str != str(result.__class__):  # Avoid infinite recursion
                print("🔄 Converting result to string and re-parsing...")
                return self._parse_crew_result(result_str)
            
            # Default fallback
            print("⚠️ Using default fallback response")
            return {
                "message": "I found some great options for you! Let me know if you'd like more details.",
                "recommendations": [],
                "actionRequired": None
            }
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error: {e}")
            return {
                "message": "I have some recommendations ready for you! There was a small formatting issue, but I can still help you find great food.",
                "recommendations": [],
                "actionRequired": None
            }
        except Exception as e:
            print(f"❌ Result parsing error: {e}")
            return self._create_fallback_response("", "friend")
    
    def _create_fallback_response(self, user_message: str, user_name: str) -> Dict[str, Any]:
        """
        Create a fallback response when the crew workflow fails
        
        Args:
            user_message (str): Original user message
            user_name (str): User's name
            
        Returns:
            Dict: Fallback response with rich recommendations
        """
        # Analyze user message for food preferences
        user_msg_lower = user_message.lower()
        
        # Default recommendations
        recommendations = [
            {
                "id": "spicy_jalapeno_pizza",
                "name": "Spicy Jalapeno Pizza",
                "price": 7.09,
                "restaurant": {
                    "name": "Pizza Paradise",
                    "rating": 4.7,
                    "deliveryTime": "25-35 mins"
                },
                "description": "Artisan pizza with fresh toppings on a wood-fired crust. A delicious blend of spicy jalapenos and savory flavors.",
                "why_perfect": "Budget-friendly, highly-rated, and offers a delicious balance of spice and flavor. Perfect for a satisfying meal.",
                "tags": ["pizza", "spicy", "vegetarian-option-available", "italian"]
            },
            {
                "id": "bbq_chicken_pizza",
                "name": "BBQ Chicken Pizza",
                "price": 8.95,
                "restaurant": {
                    "name": "Pizza Paradise",
                    "rating": 4.6,
                    "deliveryTime": "25-35 mins"
                },
                "description": "Smoky barbecue chicken with red onions, bell peppers and tangy BBQ sauce on a crispy crust.",
                "why_perfect": "A classic and flavorful choice for those who enjoy BBQ flavors.",
                "tags": ["pizza", "bbq", "chicken"]
            },
            {
                "id": "margherita_pizza",
                "name": "Margherita Pizza",
                "price": 13.81,
                "restaurant": {
                    "name": "Pizza Paradise",
                    "rating": 4.2,
                    "deliveryTime": "25-35 mins"
                },
                "description": "Classic Italian pizza with fresh mozzarella, tomato sauce, and basil leaves on a crispy wood-fired crust.",
                "why_perfect": "A classic and simple choice for traditional pizza lovers.",
                "tags": ["pizza", "classic", "vegetarian"]
            }
        ]
        
        # Customize based on user preferences
        if any(word in user_msg_lower for word in ["sushi", "japanese", "roll"]):
            recommendations = [
                {
                    "id": "california_roll",
                    "name": "California Roll",
                    "price": 8.99,
                    "restaurant": {
                        "name": "Sushi Zen",
                        "rating": 4.8,
                        "deliveryTime": "15-25 mins"
                    },
                    "description": "Crab, avocado and cucumber rolled in rice and nori, topped with sesame seeds.",
                    "why_perfect": "A perfect introduction to sushi with familiar flavors.",
                    "tags": ["sushi", "seafood", "fresh"]
                },
                {
                    "id": "salmon_roll",
                    "name": "Salmon Roll",
                    "price": 12.99,
                    "restaurant": {
                        "name": "Sushi Zen",
                        "rating": 4.9,
                        "deliveryTime": "15-25 mins"
                    },
                    "description": "Fresh salmon with cucumber and avocado wrapped in seasoned sushi rice and nori.",
                    "why_perfect": "High-quality fresh salmon that melts in your mouth.",
                    "tags": ["sushi", "salmon", "premium"]
                }
            ]
        elif any(word in user_msg_lower for word in ["indian", "curry", "spicy"]):
            recommendations = [
                {
                    "id": "chicken_tikka_masala",
                    "name": "Chicken Tikka Masala",
                    "price": 16.99,
                    "restaurant": {
                        "name": "Spice Garden",
                        "rating": 4.8,
                        "deliveryTime": "30-40 mins"
                    },
                    "description": "Tender chicken pieces marinated in yogurt and spices, cooked in a rich, creamy tomato-based curry sauce.",
                    "why_perfect": "The perfect balance of spice and creaminess that's loved worldwide.",
                    "tags": ["indian", "curry", "chicken", "creamy"]
                },
                {
                    "id": "paneer_butter_masala",
                    "name": "Paneer Butter Masala",
                    "price": 14.99,
                    "restaurant": {
                        "name": "Spice Garden",
                        "rating": 4.7,
                        "deliveryTime": "30-40 mins"
                    },
                    "description": "Soft paneer cubes simmered in a rich, creamy tomato and butter sauce with aromatic spices.",
                    "why_perfect": "A vegetarian delight that's rich, creamy, and absolutely satisfying.",
                    "tags": ["indian", "vegetarian", "paneer", "creamy"]
                }
            ]
        
        return {
            "message": f"Hey {user_name}! 👋 Even though my AI chef is taking a quick break, I've got some amazing recommendations for you! 🍕 Here are some highly-rated dishes that I think you'll absolutely love:",
            "recommendations": recommendations,
            "actionRequired": {
                "type": "add_to_cart",
                "message": f"Would you like me to add the {recommendations[0]['name']} to your cart?",
                "item_id": recommendations[0]['id']
            },
            "fallback": True,
            "original_message": user_message
        }
    
    def _get_timestamp(self) -> str:
        """Get current timestamp for logging"""
        from datetime import datetime
        return datetime.now().isoformat()

# Global instance for use in FastAPI
food_crew = FoodRecommendationCrew()
