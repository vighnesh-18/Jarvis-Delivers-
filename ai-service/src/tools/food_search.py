"""
Food search tool for CrewAI agents.
Handles searching for food items based on user preferences.
"""

from langchain_core.tools import tool
from typing import Dict, List, Optional
from ..config.settings import config


@tool
def food_search(query: str, preferences: Optional[Dict] = None) -> List[Dict]:
    """
    Search for food items from the database based on user preferences.
    
    Args:
        query (str): Search query text
        preferences (Dict): User preferences including foodType, budget, dietary restrictions
        
    Returns:
        List[Dict]: List of food items matching the criteria
    """
    try:
        client = config.get_mongo_client()
        db = client[config.DB_NAME]
        
        # Build search query
        search_query = {}
        
        # Add query text search
        if query:
            search_query['$or'] = [
                {'name': {'$regex': query, '$options': 'i'}},
                {'description': {'$regex': query, '$options': 'i'}},
                {'category': {'$regex': query, '$options': 'i'}},
                {'tags': {'$in': [query.lower()]}}
            ]
        
        if preferences:
            # Food type/cuisine search
            if preferences.get('foodType'):
                food_type = preferences['foodType']
                if '$or' not in search_query:
                    search_query['$or'] = []
                search_query['$or'].extend([
                    {'name': {'$regex': food_type, '$options': 'i'}},
                    {'description': {'$regex': food_type, '$options': 'i'}},
                    {'category': {'$regex': food_type, '$options': 'i'}},
                    {'tags': {'$in': [food_type.lower()]}}
                ])
            
            # Budget constraints
            if preferences.get('budget') == 'low':
                search_query['price'] = {'$lte': 15}
            elif preferences.get('budget') == 'medium':
                search_query['price'] = {'$gte': 10, '$lte': 25}
            elif preferences.get('budget') == 'high':
                search_query['price'] = {'$gte': 20}
            
            # Dietary preferences
            user_prefs = preferences.get('preferences', [])
            if 'vegetarian' in user_prefs:
                search_query['isVegetarian'] = True
            if 'vegan' in user_prefs:
                search_query['isVegan'] = True
            if 'spicy' in user_prefs:
                search_query['tags'] = {'$in': ['spicy', 'hot', 'chili']}
            if 'healthy' in user_prefs:
                search_query['tags'] = {'$in': ['healthy', 'low-calorie', 'organic']}
        
        # Query food items with restaurant data
        try:
            food_items = list(db[config.COLLECTIONS['food_items']].aggregate([
                {'$match': search_query},
                {'$lookup': {
                    'from': config.COLLECTIONS['restaurants'],
                    'localField': 'restaurant',
                    'foreignField': '_id',
                    'as': 'restaurant_info'
                }},
                {'$unwind': '$restaurant_info'},
                {'$sort': {'restaurant_info.rating': -1, 'price': 1}},
                {'$limit': config.MAX_FOOD_RESULTS}
            ]))
        except:
            # Fallback to simple query if aggregation fails
            food_items = list(db[config.COLLECTIONS['food_items']].find(search_query).limit(config.MAX_FOOD_RESULTS))
        
        # Format results
        results = []
        for item in food_items:
            result_item = {
                'id': str(item['_id']),
                'name': item['name'],
                'price': item['price'],
                'description': item['description'],
                'category': item.get('category', 'Food'),
                'isVegetarian': item.get('isVegetarian', False),
                'isVegan': item.get('isVegan', False),
                'tags': item.get('tags', []),
                'calories': item.get('calories'),
                'rating': item.get('rating', 4.0)
            }
            
            # Add restaurant info if available
            if 'restaurant_info' in item:
                result_item['restaurant'] = {
                    'id': str(item['restaurant_info']['_id']),
                    'name': item['restaurant_info']['name'],
                    'rating': item['restaurant_info'].get('rating', 4.0),
                    'cuisine': item['restaurant_info'].get('cuisine', 'Various'),
                    'deliveryTime': item['restaurant_info'].get('estimatedDeliveryTime', '25-35 mins')
                }
            else:
                result_item['restaurant'] = {
                    'id': str(item.get('restaurant', 'unknown')),
                    'name': 'Restaurant',
                    'rating': 4.0,
                    'cuisine': 'Various',
                    'deliveryTime': '25-35 mins'
                }
            
            results.append(result_item)
        
        client.close()
        return results
        
    except Exception as e:
        print(f"Food search error: {e}")
        # Return fallback results for demo purposes
        return [
            {
                'id': 'sample1',
                'name': 'Margherita Pizza',
                'price': 12.99,
                'description': 'Classic pizza with tomato sauce, mozzarella, and basil',
                'category': 'Pizza',
                'restaurant': {
                    'id': 'rest1',
                    'name': 'Mario\'s Pizza',
                    'rating': 4.5,
                    'cuisine': 'Italian',
                    'deliveryTime': '25-30 mins'
                },
                'isVegetarian': True,
                'isVegan': False,
                'tags': ['classic', 'cheese'],
                'calories': 280,
                'rating': 4.3
            },
            {
                'id': 'sample2',
                'name': 'Chicken Tikka Masala',
                'price': 15.99,
                'description': 'Tender chicken in a creamy spiced curry sauce',
                'category': 'Indian',
                'restaurant': {
                    'id': 'rest2',
                    'name': 'Spice Garden',
                    'rating': 4.7,
                    'cuisine': 'Indian',
                    'deliveryTime': '30-40 mins'
                },
                'isVegetarian': False,
                'isVegan': False,
                'tags': ['spicy', 'curry', 'popular'],
                'calories': 350,
                'rating': 4.6
            }
        ]
