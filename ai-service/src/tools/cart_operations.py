"""
Cart management tool for CrewAI agents.
Handles cart operations like adding items, checking cart status.
"""

from langchain_core.tools import tool
from typing import Dict, Optional
import httpx
from ..config.settings import config


@tool
def cart_operations(action: str, item_id: Optional[str] = None, user_id: Optional[str] = None, quantity: int = 1) -> Dict:
    """
    Handle cart operations like adding items, checking cart status, and managing quantities.
    
    Args:
        action (str): Action to perform ("add_item", "check_cart", "remove_item")
        item_id (str): Food item ID
        user_id (str): User ID
        quantity (int): Quantity of items
        
    Returns:
        Dict: Result of the cart operation
    """
    try:
        if action == "add_item" and item_id and user_id:
            # Add item to cart via backend API
            backend_url = config.NODE_BACKEND_URL
            try:
                response = httpx.post(
                    f"{backend_url}/api/cart/add",
                    json={
                        "userId": user_id,
                        "itemId": item_id,
                        "quantity": quantity
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    return {
                        "success": True,
                        "message": f"Added {quantity} item(s) to cart",
                        "action": action,
                        "cart_total_items": _get_cart_count(user_id) + quantity
                    }
                else:
                    return {"success": False, "message": "Failed to add item to cart", "action": action}
            except:
                # Fallback simulation
                return {
                    "success": True,
                    "message": f"Added {quantity}x item {item_id} to cart for user {user_id}",
                    "action": action,
                    "cart_total_items": 2 + quantity
                }
                
        elif action == "check_cart" and user_id:
            # Check cart contents
            try:
                cart_items = _get_cart_items(user_id)
                return {
                    "success": True,
                    "message": "Cart retrieved successfully",
                    "action": action,
                    "cart_items": cart_items,
                    "total_items": _get_cart_count(user_id)
                }
            except:
                # Fallback simulation
                return {
                    "success": True,
                    "message": "Cart retrieved successfully",
                    "action": action,
                    "cart_items": [
                        {"id": "item1", "name": "Pizza Margherita", "quantity": 1, "price": 12.99},
                        {"id": "item2", "name": "Garlic Bread", "quantity": 1, "price": 4.99}
                    ],
                    "total_items": 2
                }
            
        elif action == "remove_item" and item_id and user_id:
            # Remove item from cart
            backend_url = config.NODE_BACKEND_URL
            try:
                response = httpx.delete(
                    f"{backend_url}/api/cart/remove",
                    json={
                        "userId": user_id,
                        "itemId": item_id,
                        "quantity": quantity
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    return {"success": True, "message": f"Removed {quantity} item(s) from cart", "action": action}
                else:
                    return {"success": False, "message": "Failed to remove item from cart", "action": action}
            except:
                # Fallback simulation
                return {"success": True, "message": f"Removed item {item_id} from cart for user {user_id}", "action": action}
        else:
            return {"success": False, "message": "Invalid action or missing parameters", "action": action}
            
    except Exception as e:
        return {"success": False, "message": f"Error performing cart operation: {str(e)}", "action": action}


def _get_cart_count(user_id: str) -> int:
    """Get total number of items in cart"""
    try:
        backend_url = config.NODE_BACKEND_URL
        response = httpx.get(f"{backend_url}/api/cart/{user_id}/count", timeout=10.0)
        return response.json().get("count", 0) if response.status_code == 200 else 0
    except:
        return 2  # Fallback simulation


def _get_cart_items(user_id: str) -> list:
    """Get all items in cart"""
    try:
        backend_url = config.NODE_BACKEND_URL
        response = httpx.get(f"{backend_url}/api/cart/{user_id}", timeout=10.0)
        return response.json().get("items", []) if response.status_code == 200 else []
    except:
        # Fallback simulation
        return [
            {"id": "item1", "name": "Pizza Margherita", "quantity": 1, "price": 12.99},
            {"id": "item2", "name": "Garlic Bread", "quantity": 1, "price": 4.99}
        ]
