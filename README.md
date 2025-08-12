# AI Dictionary Application

A modern dictionary application that provides AI-powered definitions using Groq LLM, featuring a clean BMW-inspired minimalist design.

## Features

- 🤖 **AI-Powered Definitions**: Get comprehensive word definitions using Groq's language model
- 🎨 **BMW-Inspired UI**: Clean, minimalist design with modern aesthetics
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast Performance**: Built with React and TypeScript for optimal performance
- 🔧 **Developer Friendly**: Mock responses for development and testing

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **FastAPI** with Python
- **Pydantic** for data validation
- **Groq** for LLM integration
- **CORS** middleware for cross-origin requests

## Project Structure

```
Dict_app_2/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # FastAPI backend
│   └── main.py             # Main server file
├── requirements.txt         # Python dependencies
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/yarn
- Python 3.8+
- Groq API key

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Run the backend server:**
   ```bash
   cd backend
   python main.py
   ```
   
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   The frontend will connect to `http://localhost:8000` by default.

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:3000`

## Usage

1. **Start both servers** (backend on :8000, frontend on :3000)
2. **Open your browser** to `http://localhost:3000`
3. **Enter a word or phrase** in the search box
4. **Toggle "Use mock response"** for testing without API calls
5. **Click "Define"** to get the AI-powered definition

## API Endpoints

### `POST /define`
Get a definition for the provided text.

**Request:**
```json
{
  "text": "what next brotha",
  "use_mock": false
}
```

**Response:**
```json
{
  "word": "what next brotha",
  "part_of_speech": "phrase",
  "definition": "A colloquial expression...",
  "examples": [
    {
      "sentence": "Example sentence here",
      "context": "Context description"
    }
  ],
  "synonyms": [
    {
      "word": "synonym",
      "similarity": "high"
    }
  ],
  "confidence": 0.95
}
```

### `GET /health`
Health check endpoint.

## Development

### Mock Mode
Enable mock responses for development by toggling the "Use mock response" switch. This allows you to test the UI without making actual API calls.

### Environment Variables

**Backend (.env):**
```
GROQ_API_KEY=your_groq_api_key_here
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
```

## Design Philosophy

The application follows a BMW-inspired design language with:
- **Minimalist aesthetics** with clean lines and ample white space
- **High contrast** for excellent readability
- **Subtle animations** for smooth user interactions
- **Responsive layout** that works on all screen sizes
- **Consistent typography** with a modern font stack

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
