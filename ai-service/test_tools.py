#!/usr/bin/env python3
"""Test script for search tools"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.tools.food_search import food_search
from src.tools.restaurant_search import restaurant_search

def test_tools():
    print('Testing food_search...')
    try:
        foods = food_search('pizza')
        print(f'Found {len(foods)} food items')
        for food in foods[:3]:
            print(f'- {food.get("name", "Unknown")}')
    except Exception as e:
        print(f'Food search error: {e}')

    print('\nTesting restaurant_search...')
    try:
        restaurants = restaurant_search('italian')
        print(f'Found {len(restaurants)} restaurants')
        for rest in restaurants[:3]:
            print(f'- {rest.get("name", "Unknown")} ({rest.get("cuisine", "Unknown")})')
    except Exception as e:
        print(f'Restaurant search error: {e}')

    print('\nTesting restaurant_search for comfort food...')
    try:
        restaurants = restaurant_search('comfort')
        print(f'Found {len(restaurants)} restaurants')
        for rest in restaurants[:3]:
            print(f'- {rest.get("name", "Unknown")} ({rest.get("cuisine", "Unknown")})')
    except Exception as e:
        print(f'Comfort food search error: {e}')

if __name__ == '__main__':
    test_tools()

from src.tools.restaurant_search import restaurant_search

# Test the restaurant search tool
print("Testing restaurant search tool...")
try:
    results = restaurant_search.invoke({"cuisine": "indian"})
    print(f"Found {len(results)} restaurants:")
    for restaurant in results:
        print(f"- {restaurant['name']} ({restaurant['cuisine']}) - Rating: {restaurant['rating']}")
except Exception as e:
    print(f"Error: {e}")
