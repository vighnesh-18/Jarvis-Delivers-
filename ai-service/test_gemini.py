#!/usr/bin/env python3
"""
Simple test script to verify Gemini API and CrewAI configuration
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_environment_vars():
    """Test that environment variables are properly loaded"""
    print("🔍 Testing Environment Variables:")
    print(f"GEMINI_API_KEY: {'✅ Set' if os.getenv('GEMINI_API_KEY') else '❌ Missing'}")
    print(f"GOOGLE_API_KEY: {'✅ Set' if os.getenv('GOOGLE_API_KEY') else '❌ Missing'}")
    print(f"OPENAI_API_KEY: {os.getenv('OPENAI_API_KEY', 'Not set')}")
    print(f"OTEL_SDK_DISABLED: {os.getenv('OTEL_SDK_DISABLED', 'Not set')}")
    print()

def test_gemini_direct():
    """Test direct Gemini API access"""
    try:
        print("🤖 Testing Direct Gemini API:")
        import google.generativeai as genai
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("❌ No Gemini API key found")
            return False
            
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        response = model.generate_content("Say hello in one word")
        print(f"✅ Direct Gemini API working: {response.text.strip()}")
        return True
        
    except Exception as e:
        print(f"❌ Direct Gemini API failed: {e}")
        return False

def test_crewai_llm():
    """Test CrewAI LLM configuration"""
    try:
        print("🚀 Testing CrewAI LLM Configuration:")
        from crewai import LLM
        
        # Set the API key in environment
        os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY", "")
        
        llm = LLM(
            model="gemini/gemini-1.5-flash",
            api_key=os.getenv("GEMINI_API_KEY"),
            temperature=0.7
        )
        
        print(f"✅ CrewAI LLM created successfully: {llm}")
        return True
        
    except Exception as e:
        print(f"❌ CrewAI LLM configuration failed: {e}")
        return False

def test_simple_agent():
    """Test a simple CrewAI agent"""
    try:
        print("🎯 Testing Simple CrewAI Agent:")
        from crewai import Agent, Task, Crew, Process
        
        # Set the API key in environment
        os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY", "")
        
        # Create LLM
        from crewai import LLM
        llm = LLM(
            model="gemini/gemini-2.5-flash",
            api_key=os.getenv("GEMINI_API_KEY"),
            temperature=0.7
        )
        
        # Create a simple agent
        agent = Agent(
            role="Test Assistant",
            goal="Tell which llm are you and what do people generally call you",
            backstory="You are a helpful assistant that provides clear and concise answers.",
            llm=llm,
            verbose=True
        )
        
        # Create a simple task
        task = Task(
            description="Say which llm are you in a friendly way",
            expected_output="Your model exact name, I mean which llm exactly are you? All llm's will be having their own names right? Tell me that",
            agent=agent
        )
        
        # Create and run crew
        crew = Crew(
            agents=[agent],
            tasks=[task],
            process=Process.sequential,
            verbose=True
        )
        
        print("Executing crew...")
        result = crew.kickoff()
        print(f"✅ CrewAI Agent working: {result}")
        return True
        
    except Exception as e:
        print(f"❌ CrewAI Agent test failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 JARVIS DELIVERS AI SERVICE TEST")
    print("=" * 60)
    
    # Run all tests
    test_environment_vars()
    
    gemini_works = test_gemini_direct()
    llm_works = test_crewai_llm()
    agent_works = test_simple_agent()
    
    print("=" * 60)
    print("📊 TEST RESULTS:")
    print(f"Direct Gemini API: {'✅ PASS' if gemini_works else '❌ FAIL'}")
    print(f"CrewAI LLM Config: {'✅ PASS' if llm_works else '❌ FAIL'}")
    print(f"CrewAI Agent Test: {'✅ PASS' if agent_works else '❌ FAIL'}")
    
    if gemini_works and llm_works and agent_works:
        print("\n🎉 All tests passed! Your AI service should work now.")
    else:
        print("\n⚠️ Some tests failed. Check the error messages above.")
    print("=" * 60)
