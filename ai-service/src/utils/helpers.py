"""
Utility functions for the AI service.
Common helper functions and data validation.
"""

import re
import json
from typing import Dict, Any, Optional
from datetime import datetime


def validate_user_message(message: str) -> bool:
    """
    Validate user message input
    
    Args:
        message (str): User message to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not message or not isinstance(message, str):
        return False
    
    # Check length
    if len(message.strip()) < 1 or len(message) > 1000:
        return False
    
    return True


def validate_user_context(context: Dict[str, Any]) -> bool:
    """
    Validate user context data
    
    Args:
        context (Dict): User context to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not context or not isinstance(context, dict):
        return False
    
    # Required fields
    if 'id' not in context:
        return False
    
    return True


def extract_json_from_text(text: str) -> Optional[Dict[str, Any]]:
    """
    Extract JSON object from text string
    
    Args:
        text (str): Text containing JSON
        
    Returns:
        Optional[Dict]: Extracted JSON object or None
    """
    try:
        # Try to find JSON in the text
        json_pattern = r'\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}'
        matches = re.findall(json_pattern, text, re.DOTALL)
        
        for match in matches:
            try:
                return json.loads(match)
            except json.JSONDecodeError:
                continue
        
        # If no valid JSON found, try the entire text
        return json.loads(text)
        
    except json.JSONDecodeError:
        return None


def sanitize_string(text: str, max_length: int = 500) -> str:
    """
    Sanitize string input for safe processing
    
    Args:
        text (str): Text to sanitize
        max_length (int): Maximum allowed length
        
    Returns:
        str: Sanitized text
    """
    if not isinstance(text, str):
        return ""
      # Remove potentially harmful characters
    sanitized = re.sub(r'[<>"\'\\]', '', text)
    
    # Limit length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length] + "..."
    
    return sanitized.strip()


def format_price(price: float) -> str:
    """
    Format price for display
    
    Args:
        price (float): Price value
        
    Returns:
        str: Formatted price string
    """
    return f"${price:.2f}"


def format_rating(rating: float) -> str:
    """
    Format rating for display
    
    Args:
        rating (float): Rating value
        
    Returns:
        str: Formatted rating string
    """
    if rating >= 4.5:
        return f"⭐ {rating:.1f}"
    elif rating >= 4.0:
        return f"🌟 {rating:.1f}"
    else:
        return f"⭐ {rating:.1f}"


def get_timestamp() -> str:
    """
    Get current ISO timestamp
    
    Returns:
        str: ISO formatted timestamp
    """
    return datetime.now().isoformat()


def log_crew_activity(activity: str, details: Dict[str, Any] = None) -> None:
    """
    Log crew activity for debugging and monitoring
    
    Args:
        activity (str): Activity description
        details (Dict): Additional details
    """
    timestamp = get_timestamp()
    log_entry = {
        "timestamp": timestamp,
        "activity": activity,
        "details": details or {}
    }
    
    # In production, this would go to a proper logging system
    print(f"🤖 [{timestamp}] {activity}")
    if details:
        print(f"   Details: {details}")


def create_error_response(message: str, error_code: str = "GENERAL_ERROR") -> Dict[str, Any]:
    """
    Create standardized error response
    
    Args:
        message (str): Error message
        error_code (str): Error code for categorization
        
    Returns:
        Dict: Standardized error response
    """
    return {
        "error": True,
        "error_code": error_code,
        "message": message,
        "timestamp": get_timestamp(),
        "recommendations": [],
        "actionRequired": None
    }
