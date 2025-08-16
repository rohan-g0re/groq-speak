# Load environment variables FIRST, before any imports
import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq
from typing import Optional, List
from auth.middleware import get_current_user, require_subscription, User

# Enhanced environment variable debugging
print("=== ENVIRONMENT VARIABLES DEBUG ===")
print(f"GROQ_API_KEY: {'SET' if os.getenv('GROQ_API_KEY') else 'NOT SET'}")
if os.getenv('GROQ_API_KEY'):
    groq_key = os.getenv('GROQ_API_KEY')
    print(f"GROQ_API_KEY length: {len(groq_key)}")
    print(f"GROQ_API_KEY starts with: {groq_key[:10]}...")
    print(f"GROQ_API_KEY is placeholder: {'YES' if 'your_groq_api_key_here' in groq_key else 'NO'}")

print(f"SUPABASE_URL: {'SET' if os.getenv('SUPABASE_URL') else 'NOT SET'}")
if os.getenv('SUPABASE_URL'):
    supabase_url = os.getenv('SUPABASE_URL')
    print(f"SUPABASE_URL: {supabase_url}")
    print(f"SUPABASE_URL is placeholder: {'YES' if 'your_supabase_project_url' in supabase_url else 'NO'}")

print(f"SUPABASE_SERVICE_KEY: {'SET' if os.getenv('SUPABASE_SERVICE_KEY') else 'NOT SET'}")
if os.getenv('SUPABASE_SERVICE_KEY'):
    service_key = os.getenv('SUPABASE_SERVICE_KEY')
    print(f"SUPABASE_SERVICE_KEY length: {len(service_key)}")
    print(f"SUPABASE_SERVICE_KEY starts with: {service_key[:10]}...")
    print(f"SUPABASE_SERVICE_KEY is placeholder: {'YES' if 'your_supabase_service_key' in service_key else 'NO'}")

# Check for .env file
env_file_path = os.path.join(os.path.dirname(__file__), '.env')
print(f".env file exists: {'YES' if os.path.exists(env_file_path) else 'NO'}")
if os.path.exists(env_file_path):
    print(f".env file path: {env_file_path}")
    with open(env_file_path, 'r') as f:
        env_content = f.read()
        print(f".env file contains GROQ_API_KEY: {'YES' if 'GROQ_API_KEY' in env_content else 'NO'}")
        print(f".env file contains SUPABASE_URL: {'YES' if 'SUPABASE_URL' in env_content else 'NO'}")
        print(f".env file contains SUPABASE_SERVICE_KEY: {'YES' if 'SUPABASE_SERVICE_KEY' in env_content else 'NO'}")

print("==================================")

app = FastAPI(title="AI Dictionary API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://*.vercel.app",  # Allow all Vercel preview deployments
        "https://groq-speak.vercel.app"  # Your specific Vercel domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client with detailed logging
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key or groq_api_key == "your_groq_api_key_here":
    print("WARNING: GROQ_API_KEY not set or using placeholder value. Real API calls will fail.")
    print(f"GROQ_API_KEY value: {groq_api_key}")
    groq_client = None
else:
    print("SUCCESS: GROQ_API_KEY is properly configured")
    groq_client = Groq(api_key=groq_api_key)

# Pydantic models
class DefinitionRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500, description="Text to define")
    use_mock: bool = Field(default=False, description="Use mock response for testing")

class JokeRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=500, description="Joke prompt")

class CaptionRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=500, description="Caption prompt")

class Example(BaseModel):
    sentence: str
    context: str

class Synonym(BaseModel):
    word: str
    similarity: str

class DefinitionResponse(BaseModel):
    word: str
    part_of_speech: str
    definition: str
    examples: List[Example]
    synonyms: List[Synonym]
    confidence: float

class ErrorResponse(BaseModel):
    error: str
    message: str

# Mock response for testing
MOCK_RESPONSE = DefinitionResponse(
    word="what next brotha",
    part_of_speech="noun",
    definition="A concise, structured explanation generated in mock mode for demonstration purposes.",
    examples=[
        Example(
            sentence="The term 'what next brotha' is used frequently in modern AI discussions.",
            context="Researchers defined 'what next brotha' in multiple ways."
        ),
        Example(
            sentence="Understanding 'what next brotha' improves product clarity.",
            context="Understanding 'what next brotha' improves product clarity."
        )
    ],
    synonyms=[
        Synonym(word="concept", similarity="high"),
        Synonym(word="notion", similarity="medium"),
        Synonym(word="idea", similarity="medium"),
        Synonym(word="term", similarity="low"),
        Synonym(word="expression", similarity="low")
    ],
    confidence=0.95
)

async def log_feature_usage(user_id: str, feature_name: str, query: str):
    """
    Log feature usage to Supabase
    """
    try:
        from supabase import create_client, Client
        
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if supabase_url and supabase_service_key:
            supabase: Client = create_client(supabase_url, supabase_service_key)
            
            try:
                supabase.table('feature_usage').insert({
                    'user_id': user_id,
                    'feature_name': feature_name,
                    'query': query,
                    'response_length': len(query),  # Placeholder
                    'tokens_used': 0  # Placeholder
                }).execute()
            except Exception as table_error:
                print(f"Feature usage table error (likely missing): {table_error}")
                # Continue without logging if table doesn't exist
        
    except Exception as e:
        print(f"Error logging usage: {e}")
        # Continue without logging

@app.get("/")
async def root():
    return {"message": "AI Dictionary API", "version": "1.0.0"}

@app.post("/define", response_model=DefinitionResponse)
async def define_text(
    request: DefinitionRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Get definition and meaning of the provided text using Groq LLM.
    Requires authentication.
    """
    print(f"=== /define ENDPOINT DEBUG ===")
    print(f"Request received: {request.text}")
    print(f"Use mock: {request.use_mock}")
    print(f"Current user: {current_user.email}")
    print(f"Groq client available: {'YES' if groq_client else 'NO'}")
    
    try:
        # Log usage
        print("Attempting to log feature usage...")
        await log_feature_usage(current_user.id, "dictionary", request.text)
        print("Feature usage logged successfully")
        
        # Return mock response if requested or if Groq client is not available
        if request.use_mock or groq_client is None:
            if groq_client is None and not request.use_mock:
                print("Using mock response because GROQ_API_KEY is not configured")
            print("Returning mock response")
            mock_response = MOCK_RESPONSE.model_copy()
            mock_response.word = request.text
            return mock_response
        
        # Prepare prompt for Groq
        print("Preparing Groq API call...")
        prompt = f"""
        Define the following text/phrase: "{request.text}"
        
        Provide a comprehensive definition including:
        1. The main definition/meaning
        2. Part of speech (if applicable)
        3. 2-3 example sentences showing usage
        4. 3-5 synonyms with similarity levels
        5. A confidence score (0-1) for your definition
        
        Format your response as JSON with the following structure:
        {{
            "word": "{request.text}",
            "part_of_speech": "noun/verb/adjective/phrase/etc",
            "definition": "Clear, concise definition",
            "examples": [
                {{"sentence": "Example sentence", "context": "Brief context"}},
                {{"sentence": "Another example", "context": "Brief context"}}
            ],
            "synonyms": [
                {{"word": "synonym1", "similarity": "high/medium/low"}},
                {{"word": "synonym2", "similarity": "high/medium/low"}}
            ],
            "confidence": 0.9
        }}
        """
        
        # Make API call to Groq
        try:
            print("Making Groq API call...")
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful dictionary assistant. Provide accurate, concise definitions in the exact JSON format requested. Always respond with valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.3,
                max_tokens=1000,
            )
            print("Groq API call successful")
        except Exception as groq_error:
            print(f"Groq API error: {groq_error}")
            print(f"Error type: {type(groq_error).__name__}")
            raise HTTPException(
                status_code=500,
                detail=f"Groq API error: {str(groq_error)}"
            )
        
        # Parse the response
        print("Parsing Groq response...")
        response_text = chat_completion.choices[0].message.content.strip()
        print(f"Response length: {len(response_text)}")
        print(f"Response preview: {response_text[:100]}...")
        
        # Try to extract JSON from the response
        import json
        try:
            # Remove any markdown formatting
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            response_data = json.loads(response_text)
            print("JSON parsing successful")
            return DefinitionResponse(**response_data)
        except (json.JSONDecodeError, ValueError) as e:
            print(f"JSON parsing error: {e}")
            # Fallback response if JSON parsing fails
            print("Using fallback response due to JSON parsing error")
            return DefinitionResponse(
                word=request.text,
                part_of_speech="unknown",
                definition=response_text,
                examples=[],
                synonyms=[],
                confidence=0.7
            )
    
    except Exception as e:
        print(f"Unexpected error in /define endpoint: {e}")
        print(f"Error type: {type(e).__name__}")
        print(f"Error details: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing definition request: {str(e)}"
        )

@app.post("/jokes/generate")
async def generate_joke(
    request: JokeRequest,
    current_user: User = Depends(require_subscription)
):
    """
    Generate jokes using Groq LLM.
    Requires active subscription.
    """
    print(f"=== /jokes/generate ENDPOINT DEBUG ===")
    print(f"Request received: {request.prompt}")
    print(f"Current user: {current_user.email}")
    print(f"Groq client available: {'YES' if groq_client else 'NO'}")
    
    try:
        # Log usage
        print("Attempting to log feature usage...")
        await log_feature_usage(current_user.id, "jokes", request.prompt)
        print("Feature usage logged successfully")
        
        if groq_client is None:
            print("Groq client not available, returning mock joke")
            return {"joke": "Why did the AI go to therapy? Because it had too many deep learning issues! 🤖"}
        
        # Generate joke using Groq
        print("Preparing Groq API call for joke generation...")
        prompt = f"Generate a funny joke based on: {request.prompt}"
        
        try:
            print("Making Groq API call for joke...")
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a funny comedian. Generate humorous jokes based on the given prompt."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.7,
                max_tokens=200,
            )
            print("Groq API call for joke successful")
        except Exception as groq_error:
            print(f"Groq API error for joke: {groq_error}")
            print(f"Error type: {type(groq_error).__name__}")
            raise HTTPException(
                status_code=500,
                detail=f"Groq API error: {str(groq_error)}"
            )
        
        joke = chat_completion.choices[0].message.content.strip()
        print(f"Generated joke length: {len(joke)}")
        print(f"Generated joke: {joke}")
        return {"joke": joke}
        
    except Exception as e:
        print(f"Unexpected error in /jokes/generate endpoint: {e}")
        print(f"Error type: {type(e).__name__}")
        print(f"Error details: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating joke: {str(e)}"
        )

@app.post("/captions/generate")
async def generate_caption(
    request: CaptionRequest,
    current_user: User = Depends(require_subscription)
):
    """
    Generate Instagram captions using Groq LLM.
    Requires active subscription.
    """
    try:
        # Log usage
        await log_feature_usage(current_user.id, "captions", request.prompt)
        
        if groq_client is None:
            return {"caption": "Living my best life! ✨ #vibes #lifestyle"}
        
        # Generate caption using Groq
        prompt = f"Generate an engaging Instagram caption for: {request.prompt}"
        
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a social media expert. Generate engaging Instagram captions with relevant hashtags."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.6,
            max_tokens=300,
        )
        
        caption = chat_completion.choices[0].message.content.strip()
        return {"caption": caption}
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating caption: {str(e)}"
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Dictionary API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
