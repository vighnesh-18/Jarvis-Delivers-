"""
Restaurant search tool for CrewAI agents.
Handles searching for restaurants based on location, cuisine, and ratings.
"""

from langchain_core.tools import tool
from typing import Dict, List, Optional
from ..config.settings import config


@tool
def restaurant_search(query: str) -> List[Dict]:
    """
    Search for restaurants from the database based on cuisine, location, and ratings.    
    Args:
        query (str): Search query - can be cuisine type, restaurant name, or food type
        
    Returns:
        List[Dict]: List of restaurants matching the criteria
    """
    try:
        client = config.get_mongo_client()
        db = client[config.DB_NAME]
        
        # Build search query - search in both cuisine and name fields
        search_query = {}
        
        if query:
            # Search in restaurant name and cuisine
            search_query = {
                '$or': [
                    {'name': {'$regex': query, '$options': 'i'}},
                    {'cuisine': {'$regex': query, '$options': 'i'}}
                ]
            }
        
        # Find restaurants
        restaurants = list(db[config.COLLECTIONS['restaurants']].find(search_query)
                         .sort('rating', -1)
                         .limit(config.MAX_RESTAURANT_RESULTS))
        
        # Format results
        results = []
        for restaurant in restaurants:
            results.append({
                'id': str(restaurant['_id']),
                'name': restaurant['name'],
                'cuisine': restaurant.get('cuisine', 'Various'),
                'rating': restaurant.get('rating', 4.0),
                'estimatedDeliveryTime': restaurant.get('estimatedDeliveryTime', '25-35 mins'),
                'address': restaurant.get('address', {}),
                'isOpen': restaurant.get('isOpen', True),
                'deliveryFee': restaurant.get('deliveryFee', 3.99),
                'minimumOrder': restaurant.get('minimumOrder', 15.00),
                'specialOffers': restaurant.get('specialOffers', [])
            })
        
        client.close()
        return results
        
    except Exception as e:
        print(f"Restaurant search error: {e}")
        # Return fallback results for demo purposes
        return [
            {
                'id': 'rest1',
                'name': 'Mario\'s Pizza Palace',
                'cuisine': 'Italian',
                'rating': 4.5,
                'estimatedDeliveryTime': '25-30 mins',
                'address': {'street': '123 Main St', 'city': 'Downtown'},
                'isOpen': True,
                'deliveryFee': 2.99,
                'minimumOrder': 12.00,
                'specialOffers': ['20% off orders over $25']
            },
            {
                'id': 'rest2',
                'name': 'Spice Garden Indian',
                'cuisine': 'Indian',
                'rating': 4.7,
                'estimatedDeliveryTime': '30-40 mins',
                'address': {'street': '456 Curry Lane', 'city': 'Spice District'},
                'isOpen': True,
                'deliveryFee': 3.99,
                'minimumOrder': 15.00,
                'specialOffers': ['Free naan with any curry']
            }
        ]
