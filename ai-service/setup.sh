#!/bin/bash

echo "🚀 Setting up Jarvis Delivers AI Service with CrewAI and Gemini..."

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python -m venv ai_env

# Activate virtual environment (Windows)
echo "🔄 Activating virtual environment..."
source ai_env/Scripts/activate

# Install dependencies
echo "📚 Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Add your Gemini API key to .env file"
echo "2. Run: python main.py"
echo ""
echo "🌟 Your AI service will be available at http://localhost:8000"
