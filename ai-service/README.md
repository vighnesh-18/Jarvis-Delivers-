# Jarvis Delivers AI Service 🤖🍕

This is the Python-based AI service that powers the intelligent chat recommendations for Jarvis Delivers using CrewAI and Google's Gemini API.

## Features

- **CrewAI Multi-Agent System**: Four specialized AI agents working together
  - **Planner Agent**: Analyzes user intent, mood, and preferences
  - **Search Agent**: Finds relevant food items from the database
  - **Evaluator Agent**: Ranks and scores food options
  - **Recommendation Agent**: Creates personalized, engaging responses

- **Google Gemini Integration**: Powered by Google's advanced AI model
- **FastAPI Backend**: RESTful API for seamless integration
- **MongoDB Integration**: Direct database access for food search
- **Conversational AI**: Empathetic, context-aware responses

## Setup

### Prerequisites
- Python 3.8+
- Google Gemini API key
- MongoDB running locally

### Quick Start

1. **Run the setup script:**
   ```bash
   # Windows
   setup.bat
   
   # Linux/Mac
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Configure environment:**
   - Add your Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **Start the service:**
   ```bash
   # Activate virtual environment first
   ai_env\Scripts\activate  # Windows
   source ai_env/bin/activate  # Linux/Mac
   
   # Run the service
   python main.py
   ```

4. **Verify it's working:**
   - Visit: http://localhost:8000
   - Test endpoint: http://localhost:8000/test-crew

## API Endpoints

### `POST /process-chat`
Process user chat messages through the CrewAI pipeline.

**Request:**
```json
{
  "message": "I'm feeling sad and want comfort food",
  "user_context": {
    "id": "user123",
    "name": "John",
    "address": "123 Main St"
  },
  "conversation_history": []
}
```

**Response:**
```json
{
  "message": "Hey John, I feel you! When life gets tough, food should be a warm hug...",
  "recommendations": [
    {
      "id": "item123",
      "name": "Margherita Pizza",
      "price": 12.99,
      "restaurant": "Tony's Pizza",
      "description": "Classic comfort food..."
    }
  ],
  "actionRequired": {
    "type": "add_to_cart",
    "message": "Add to cart?"
  }
}
```

### `POST /add-to-cart`
Add items to cart through the AI service.

### `GET /health`
Health check endpoint.

### `GET /test-crew`
Test the CrewAI functionality.

## Agent Architecture

```
User Message
     ↓
Planner Agent (Intent Analysis)
     ↓
Search Agent (Food Discovery)
     ↓
Evaluator Agent (Ranking & Scoring)
     ↓
Recommendation Agent (Personalized Response)
     ↓
JSON Response
```

## Integration with Node.js Backend

The Node.js backend (`chatController.js`) proxies requests to this Python service:
- Frontend → Node.js Backend → Python AI Service → Database
- Fallback responses if AI service is unavailable
- Seamless error handling

## Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

## Development

### Adding New Agents
1. Create agent class in `crew_ai_agents.py`
2. Add to the crew initialization
3. Update task dependencies

### Customizing Responses
- Modify agent backstories for different personalities
- Adjust scoring logic in `EvaluatorAgent`
- Update response templates in `RecommendationAgent`

## Troubleshooting

### Common Issues
1. **Import errors**: Make sure virtual environment is activated
2. **MongoDB connection**: Ensure MongoDB is running on localhost:27017
3. **Gemini API errors**: Check your API key and quota
4. **Port conflicts**: Change `AI_SERVICE_PORT` in `.env`

### Logs
Check console output for detailed error messages and agent reasoning.

## Future Enhancements

- [ ] Voice input/output with Whisper/TTS
- [ ] Real geolocation and delivery time calculations
- [ ] Advanced conversation memory
- [ ] Multi-language support
- [ ] Custom dietary restriction handling
- [ ] Integration with external food APIs

## License

MIT License - Built with ❤️ for Jarvis Delivers
