# AI Dictionary

AI-powered dictionary with Groq LLM integration.

## Quick Start

### Prerequisites
- Node.js 16+ & Python 3.8+
- Groq API key (optional - works with mock mode)

### Setup

1. **Backend:**
   ```bash
   pip install -r requirements.txt
   python setup_env.py  # Optional: configure API key
   cd backend && python main.py
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access:** `http://localhost:3000`

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind + Vite
- **Backend:** FastAPI + Pydantic + Groq

## API Key Setup

```bash
# Option 1: Use setup script
python setup_env.py

# Option 2: Manual setup
cp groq_env.txt .env
# Edit .env with your Groq API key
```

**Get API key:** https://console.groq.com/keys

## Development

- **Backend:** `http://localhost:8000`
- **Frontend:** `http://localhost:3000`
- **API Docs:** `http://localhost:8000/docs`
