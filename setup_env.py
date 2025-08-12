#!/usr/bin/env python3
"""
Setup script to configure the Groq API key for the AI Dictionary application.
"""

import os

def setup_environment():
    print("🤖 AI Dictionary - Environment Setup")
    print("=" * 40)
    
    # Check if .env file exists
    env_file = ".env"
    if os.path.exists(env_file):
        print(f"✅ Found existing {env_file} file")
        with open(env_file, 'r') as f:
            content = f.read()
            if "GROQ_API_KEY=your_groq_api_key_here" in content:
                print("⚠️  WARNING: .env file contains placeholder API key")
            elif "GROQ_API_KEY=" in content:
                print("✅ .env file appears to have a Groq API key configured")
            else:
                print("⚠️  WARNING: No GROQ_API_KEY found in .env file")
    else:
        print(f"📝 Creating {env_file} file...")
        
    # Get API key from user
    print("\n🔑 Groq API Key Setup:")
    print("1. Go to https://console.groq.com/keys")
    print("2. Create a new API key")
    print("3. Copy the API key")
    print()
    
    api_key = input("Enter your Groq API key (or press Enter to skip): ").strip()
    
    if api_key:
        # Create or update .env file
        env_content = f"""# Groq API Configuration
GROQ_API_KEY={api_key}

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Development
DEBUG=True
"""
        
        with open(env_file, 'w') as f:
            f.write(env_content)
        
        print(f"✅ Created {env_file} with your API key")
        print("\n🚀 You can now run the application:")
        print("   Backend: python backend/main.py")
        print("   Frontend: cd frontend && npm run dev")
    else:
        print("⏭️  Skipped API key setup")
        print("💡 You can manually edit the .env file later")
        print("   or use mock responses for testing")

if __name__ == "__main__":
    setup_environment()
