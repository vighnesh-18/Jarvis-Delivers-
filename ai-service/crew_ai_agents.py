from crewai import Agent, Task, Crew, Process
from crewai.tools import BaseTool
import google.generativeai as genai
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
import json
import httpx
from pymongo import MongoClient
from datetime import datetime
import asyncio

load_dotenv()

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class FoodSearchTool(BaseTool):
    name: str = "food_search"
    description: str = "Search for food items based on user preferences and intent"
    
    def _run(self, query: str, preferences: Dict = None) -> List[Dict]:
        """Search for food items from the database"""
        try:
            # Connect to MongoDB
            client = MongoClient(os.getenv("MONGODB_URI"))
            db = client['jarvis-delivers']
            
            # Build search query
            search_query = {}
            
            if preferences:
                if preferences.get('foodType'):
                    search_query['$or'] = [
                        {'name': {'$regex': preferences['foodType'], '$options': 'i'}},
                        {'description': {'$regex': preferences['foodType'], '$options': 'i'}},
                        {'category': {'$regex': preferences['foodType'], '$options': 'i'}}
                    ]
                
                if preferences.get('budget') == 'low':
                    search_query['price'] = {'$lte': 15}
                elif preferences.get('budget') == 'high':
                    search_query['price'] = {'$gte': 25}
                
                if 'vegetarian' in preferences.get('preferences', []):
                    search_query['isVegetarian'] = True
                
                if 'spicy' in preferences.get('preferences', []):
                    search_query['tags'] = {'$in': ['spicy', 'hot']}
            
            # Query food items with restaurant data
            food_items = list(db.fooditems.aggregate([
                {'$match': search_query},
                {'$lookup': {
                    'from': 'restaurants',
                    'localField': 'restaurant',
                    'foreignField': '_id',
                    'as': 'restaurant_info'
                }},
                {'$unwind': '$restaurant_info'},
                {'$limit': 10}
            ]))
            
            # Format results
            results = []
            for item in food_items:
                results.append({
                    'id': str(item['_id']),
                    'name': item['name'],
                    'price': item['price'],
                    'description': item['description'],
                    'restaurant': {
                        'name': item['restaurant_info']['name'],
                        'rating': item['restaurant_info'].get('rating', 4.0)
                    },
                    'isVegetarian': item.get('isVegetarian', False),
                    'tags': item.get('tags', [])
                })
            
            client.close()
            return results
            
        except Exception as e:
            print(f"Food search error: {e}")
            return []

class RestaurantSearchTool(BaseTool):
    name: str = "restaurant_search"
    description: str = "Search for restaurants based on location and preferences"
    
    def _run(self, location: str = None, cuisine: str = None) -> List[Dict]:
        """Search for restaurants"""
        try:
            client = MongoClient(os.getenv("MONGODB_URI"))
            db = client['jarvis-delivers']
            
            query = {}
            if cuisine:
                query['cuisine'] = {'$regex': cuisine, '$options': 'i'}
            
            restaurants = list(db.restaurants.find(query).limit(5))
            
            results = []
            for restaurant in restaurants:
                results.append({
                    'id': str(restaurant['_id']),
                    'name': restaurant['name'],
                    'cuisine': restaurant.get('cuisine', 'Various'),
                    'rating': restaurant.get('rating', 4.0),
                    'estimatedDeliveryTime': restaurant.get('estimatedDeliveryTime', '25-35 mins')
                })
            
            client.close()
            return results
            
        except Exception as e:
            print(f"Restaurant search error: {e}")
            return []

class CartTool(BaseTool):
    name: str = "cart_operations"
    description: str = "Handle cart operations like adding items"
    
    def _run(self, action: str, item_id: str = None, user_id: str = None) -> Dict:
        """Perform cart operations"""
        try:
            if action == "add_item" and item_id and user_id:
                # This would integrate with your Node.js backend cart API
                return {
                    'success': True,
                    'message': f'Item {item_id} added to cart for user {user_id}'
                }
            return {'success': False, 'message': 'Invalid cart operation'}
        except Exception as e:
            return {'success': False, 'message': f'Cart operation failed: {e}'}

class FoodRecommendationCrew:
    def __init__(self):
        # Initialize Gemini model
        self.model = genai.GenerativeModel('gemini-pro')
        
        # Initialize tools
        self.food_search_tool = FoodSearchTool()
        self.restaurant_search_tool = RestaurantSearchTool()
        self.cart_tool = CartTool()
        
        # Create agents
        self.planner_agent = Agent(
            role="Food Intent Analyzer",
            goal="Understand user's food preferences, mood, budget, and dietary requirements from their message",
            backstory="""You are an empathetic food psychologist who understands the deep connection between 
            emotions and food choices. You can read between the lines to understand what someone really craves 
            based on their mood, situation, and preferences.""",
            verbose=True,
            allow_delegation=False,
            llm=self.model
        )
        
        self.search_agent = Agent(
            role="Food Discovery Specialist",
            goal="Find the most relevant food options based on analyzed user intent",
            backstory="""You are a food discovery expert with deep knowledge of cuisines, ingredients, and 
            restaurant offerings. You know how to match user preferences with the perfect food options.""",
            verbose=True,
            allow_delegation=False,
            tools=[self.food_search_tool, self.restaurant_search_tool],
            llm=self.model
        )
        
        self.evaluator_agent = Agent(
            role="Food Experience Curator",
            goal="Rank and evaluate food options based on quality, user preferences, and overall experience",
            backstory="""You are a seasoned food critic and curator who evaluates food options based on 
            taste, quality, value for money, and how well they match user preferences. You understand the 
            nuances of a great food experience.""",
            verbose=True,
            allow_delegation=False,
            llm=self.model
        )
        
        self.recommendation_agent = Agent(
            role="Personalized Food Advisor",
            goal="Create personalized, engaging food recommendations with perfect explanations",
            backstory="""You are a charismatic food advisor who creates personalized recommendations. 
            You speak naturally, understand emotions, and can explain why a particular food choice is perfect 
            for someone's current situation. You're like that friend who always knows the best place to eat.""",
            verbose=True,
            allow_delegation=False,
            tools=[self.cart_tool],
            llm=self.model
        )
    
    def process_user_query(self, user_message: str, user_context: Dict = None) -> Dict:
        """Process user query through the CrewAI pipeline"""
        
        user_name = user_context.get('name', 'friend') if user_context else 'friend'
        user_id = user_context.get('id', '') if user_context else ''
        
        # Task 1: Analyze user intent
        intent_task = Task(
            description=f"""
            Analyze this user message to understand their food preferences and intent: "{user_message}"
            
            Extract and return a JSON object with:
            - mood: (comfort/celebration/healthy/casual/null)
            - budget: (low/medium/high/null)
            - foodType: (specific cuisine or food type mentioned)
            - preferences: (array of dietary preferences like vegetarian, spicy, etc.)
            - urgency: (fast/normal/relaxed)
            - emotional_context: (brief description of user's emotional state)
            
            Be empathetic and read between the lines. Consider phrases like "I'm feeling down" = comfort food needed.
            """,
            agent=self.planner_agent,
            expected_output="JSON object with analyzed user intent and preferences"
        )
        
        # Task 2: Search for relevant options
        search_task = Task(
            description="""
            Based on the analyzed user intent, search for the most relevant food options.
            Use the food_search tool to find items that match their preferences.
            Also use restaurant_search tool if needed for broader options.
            
            Return a list of relevant food items with all details.
            """,
            agent=self.search_agent,
            expected_output="List of relevant food options with detailed information",
            context=[intent_task]
        )
        
        # Task 3: Evaluate and rank options
        evaluation_task = Task(
            description="""
            Evaluate and rank the found food options based on:
            - How well they match user preferences
            - Quality (restaurant rating, item popularity)
            - Value for money
            - Emotional satisfaction potential
            
            Return the top 3 ranked options with scores and reasoning.
            """,
            agent=self.evaluator_agent,
            expected_output="Top 3 ranked food options with evaluation scores",
            context=[intent_task, search_task]
        )
        
        # Task 4: Generate personalized recommendation
        recommendation_task = Task(
            description=f"""
            Create a personalized, engaging food recommendation for user "{user_name}".
            
            Based on the analyzed intent and ranked options:
            1. Write a warm, conversational message explaining why these recommendations are perfect
            2. Address their emotional context if applicable
            3. Mention specific benefits (budget-friendly, comfort food, healthy, etc.)
            4. Ask if they'd like to add the top item to their cart
            
            Return a JSON object with:
            - message: (engaging, personalized recommendation text)
            - recommendations: (array of top 2-3 items with id, name, price, restaurant, description)
            - actionRequired: (object with type: 'add_to_cart' and item details if applicable)
            
            Be conversational, empathetic, and enthusiastic about food!
            """,
            agent=self.recommendation_agent,
            expected_output="JSON object with personalized recommendation and action options",
            context=[intent_task, search_task, evaluation_task]
        )
        
        # Create and run crew
        crew = Crew(
            agents=[self.planner_agent, self.search_agent, self.evaluator_agent, self.recommendation_agent],
            tasks=[intent_task, search_task, evaluation_task, recommendation_task],
            verbose=2,
            process=Process.sequential
        )
        
        try:
            result = crew.kickoff()
            
            # Parse the final result (should be JSON from recommendation_task)
            try:
                if isinstance(result, str):
                    # Try to extract JSON from the result string
                    import re
                    json_match = re.search(r'\{.*\}', result, re.DOTALL)
                    if json_match:
                        return json.loads(json_match.group())
                    else:
                        # Fallback response
                        return {
                            "message": result,
                            "recommendations": [],
                            "actionRequired": None
                        }
                return result
            except json.JSONDecodeError:
                return {
                    "message": "I found some great options for you! Let me help you explore them.",
                    "recommendations": [],
                    "actionRequired": None
                }
                
        except Exception as e:
            print(f"Crew execution error: {e}")
            return {
                "message": "Sorry, I'm having trouble processing your request right now. Can you try again? 😅",
                "recommendations": [],
                "actionRequired": None
            }
    
    def add_to_cart(self, item_id: str, user_id: str) -> Dict:
        """Add item to cart using the cart tool"""
        return self.cart_tool._run("add_item", item_id=item_id, user_id=user_id)

# Initialize the crew
food_crew = FoodRecommendationCrew()
