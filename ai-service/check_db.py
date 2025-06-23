#!/usr/bin/env python3
"""Check database contents"""

from src.tools.food_search import food_search
from src.tools.restaurant_search import restaurant_search

print('=== TESTING WHAT IS IN THE DATABASE ===')
print()
print('1. Testing broad restaurant search:')
try:
    restaurants = restaurant_search.invoke({'query': ''})
    print(f'Found {len(restaurants)} restaurants total')
    for r in restaurants[:5]:
        print(f'- {r.get("name", "Unknown")} | Cuisine: {r.get("cuisine", "Unknown")}')
except Exception as e:
    print(f'Restaurant search error: {e}')

print()
print('2. Testing broad food search:')
try:
    foods = food_search.invoke({'query': ''})
    print(f'Found {len(foods)} food items total')
    for f in foods[:5]:
        rest_name = f.get('restaurant', {}).get('name', 'Unknown') if isinstance(f.get('restaurant'), dict) else str(f.get('restaurant', 'Unknown'))
        print(f'- {f.get("name", "Unknown")} | Restaurant: {rest_name}')
except Exception as e:
    print(f'Food search error: {e}')

print()
print('3. Testing specific searches that agents tried:')
try:
    mac_foods = food_search.invoke({'query': 'mac'})
    print(f'Mac-related foods: {len(mac_foods)}')
    
    comfort_rest = restaurant_search.invoke({'query': 'comfort'})
    print(f'Comfort restaurants: {len(comfort_rest)}')
    
    italian_rest = restaurant_search.invoke({'query': 'italian'})
    print(f'Italian restaurants: {len(italian_rest)}')
    for r in italian_rest:
        print(f'- {r.get("name", "Unknown")}')
        
except Exception as e:
    print(f'Specific search error: {e}')
