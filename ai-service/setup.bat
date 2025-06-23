@echo off
echo 🚀 Setting up Jarvis Delivers AI Service with CrewAI and Gemini...

REM Create virtual environment
echo 📦 Creating Python virtual environment...
python -m venv ai_env

REM Activate virtual environment (Windows)
echo 🔄 Activating virtual environment...
call ai_env\Scripts\activate.bat

REM Install dependencies
echo 📚 Installing Python dependencies...
pip install -r requirements.txt

echo ✅ Setup complete!
echo.
echo 🔧 Next steps:
echo 1. Add your Gemini API key to .env file
echo 2. Run: python main.py
echo.
echo 🌟 Your AI service will be available at http://localhost:8000
pause
