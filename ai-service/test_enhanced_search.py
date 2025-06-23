#!/usr/bin/env python3
"""Test enhanced search capabilities"""

from src.tools.food_search import food_search
from src.tools.restaurant_search import restaurant_search

def test_enhanced_search():
    print('=== TESTING ENHANCED SEARCH CAPABILITIES ===\n')
    
    # Test comfort food searches
    print('🍔 COMFORT FOOD SEARCHES:')
    
    # Test for pizza (should find items)
    print('\n1. Searching for "pizza":')
    pizza_foods = food_search.invoke({'query': 'pizza'})
    for food in pizza_foods[:3]:
        print(f'   - {food.get("name")} at {food.get("restaurant", {}).get("name", "Unknown")} (${food.get("price", 0)})')
    
    # Test for burger (should find items)
    print('\n2. Searching for "burger":')
    burger_foods = food_search.invoke({'query': 'burger'})
    for food in burger_foods[:3]:
        print(f'   - {food.get("name")} at {food.get("restaurant", {}).get("name", "Unknown")} (${food.get("price", 0)})')
    
    # Test for comfort keywords
    print('\n3. Searching for "comfort":')
    comfort_foods = food_search.invoke({'query': 'comfort'})
    for food in comfort_foods[:3]:
        print(f'   - {food.get("name")} at {food.get("restaurant", {}).get("name", "Unknown")} (${food.get("price", 0)})')
    
    # Test restaurants with comfort
    print('\n🏪 COMFORT RESTAURANTS:')
    comfort_restaurants = restaurant_search.invoke({'query': 'comfort'})
    for rest in comfort_restaurants[:3]:
        print(f'   - {rest.get("name")} ({rest.get("cuisine", "Unknown")}) - Rating: {rest.get("rating", 0)}')
    
    # Test various cuisines
    print('\n🌮 CUISINE SEARCHES:')
    cuisines = ['mexican', 'indian', 'italian', 'asian', 'healthy']
    for cuisine in cuisines:
        restaurants = restaurant_search.invoke({'query': cuisine})
        print(f'\n{cuisine.title()} restaurants: {len(restaurants)}')
        for rest in restaurants[:2]:
            print(f'   - {rest.get("name")} (Rating: {rest.get("rating", 0)})')
    
    # Test specific cravings that agents might search for
    print('\n🔥 SPECIFIC CRAVING SEARCHES:')
    cravings = ['spicy', 'sweet', 'healthy', 'fresh', 'warm']
    for craving in cravings:
        foods = food_search.invoke({'query': craving})
        print(f'\n{craving.title()} foods: {len(foods)}')
        for food in foods[:2]:
            print(f'   - {food.get("name")} (${food.get("price", 0)})')

if __name__ == '__main__':
    test_enhanced_search()
