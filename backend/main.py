from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq
import os
from dotenv import load_dotenv
from typing import Optional, List

# Load environment variables
load_dotenv()

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

# Initialize Groq client
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key or groq_api_key == "your_groq_api_key_here":
    print("WARNING: GROQ_API_KEY not set or using placeholder value. Real API calls will fail.")
    groq_client = None
else:
    groq_client = Groq(api_key=groq_api_key)

# Pydantic models
class DefinitionRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500, description="Text to define")
    use_mock: bool = Field(default=False, description="Use mock response for testing")

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

@app.get("/")
async def root():
    return {"message": "AI Dictionary API", "version": "1.0.0"}

@app.post("/define", response_model=DefinitionResponse)
async def define_text(request: DefinitionRequest):
    """
    Get definition and meaning of the provided text using Groq LLM.
    """
    try:
        # Return mock response if requested or if Groq client is not available
        if request.use_mock or groq_client is None:
            if groq_client is None and not request.use_mock:
                print("Using mock response because GROQ_API_KEY is not configured")
            mock_response = MOCK_RESPONSE.model_copy()
            mock_response.word = request.text
            return mock_response
        
        # Prepare prompt for Groq
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
        except Exception as groq_error:
            print(f"Groq API error: {groq_error}")
            raise HTTPException(
                status_code=500,
                detail=f"Groq API error: {str(groq_error)}"
            )
        
        # Parse the response
        response_text = chat_completion.choices[0].message.content.strip()
        
        # Try to extract JSON from the response
        import json
        try:
            # Remove any markdown formatting
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            response_data = json.loads(response_text)
            return DefinitionResponse(**response_data)
        except (json.JSONDecodeError, ValueError) as e:
            # Fallback response if JSON parsing fails
            return DefinitionResponse(
                word=request.text,
                part_of_speech="unknown",
                definition=response_text,
                examples=[],
                synonyms=[],
                confidence=0.7
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing definition request: {str(e)}"
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Dictionary API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
