# 🚀 AI Dictionary - Complete Setup Instructions

## **Overview**
This guide will help you set up the complete AI Dictionary application with user authentication, subscription management, and premium features (jokes and captions generators).

## **Prerequisites**
- Node.js 16+ & Python 3.11+
- Supabase account and project
- Groq API key (optional - works with mock mode)

## **Step 1: Supabase Setup**

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys

### 1.2 Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the complete schema from `supabase_schema.sql` file
4. This creates all necessary tables and security policies

### 1.3 Authentication Configuration
1. Go to Authentication > Settings in your Supabase dashboard
2. Add your site URLs:
   - Site URL: `https://your-vercel-app.vercel.app`
   - Redirect URLs: 
     - `http://localhost:5173`
     - `https://your-vercel-app.vercel.app`

## **Step 2: Frontend Setup**

### 2.1 Environment Variables
Create `frontend/.env.local`:
```bash
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2.2 Install Dependencies
```bash
cd frontend
npm install
```

### 2.3 Start Development Server
```bash
npm run dev
```

## **Step 3: Backend Setup**

### 3.1 Environment Variables
Create `backend/.env`:
```bash
GROQ_API_KEY=your_groq_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### 3.2 Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3.3 Start Backend Server
```bash
python main.py
```

## **Step 4: Testing the Application**

### 4.1 Test User Registration
1. Go to `http://localhost:5173/signup`
2. Create a new account with username, email, and password
3. Check your email for verification (if enabled)

### 4.2 Test Authentication
1. Go to `http://localhost:5173/signin`
2. Sign in with your credentials
3. You should be redirected to the dashboard

### 4.3 Test Dictionary Feature
1. Go to the home page (`http://localhost:5173`)
2. Try searching for a word
3. You should see the definition (requires authentication)

### 4.4 Test Premium Features
1. Go to `/jokes` or `/captions`
2. Try generating content
3. These features require subscription (currently bypassed for testing)

## **Step 5: Deployment**

### 5.1 Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (pointing to your backend)

### 5.2 Backend (Render)
1. Connect your repository to Render
2. Set environment variables:
   - `GROQ_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
3. Build command: `pip install -r requirements.txt`
4. Start command: `python main.py`

## **Features Implemented**

### ✅ Authentication System
- User registration with username, email, password
- User login/logout
- Protected routes
- JWT token management

### ✅ User Management
- User profiles stored in Supabase
- Dashboard with user information
- Profile management

### ✅ Subscription System
- Database schema for subscription plans
- User subscription tracking
- Premium feature access control

### ✅ Premium Features
- Jokes Generator (requires subscription)
- Instagram Caption Generator (requires subscription)
- Usage tracking and analytics

### ✅ Security
- Row Level Security (RLS) in Supabase
- JWT token validation
- Protected API endpoints

## **File Structure**
```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── SignUpForm.tsx
│   │   │   ├── SignInForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Navigation.tsx
│   │   ├── JokesGenerator.tsx
│   │   ├── CaptionGenerator.tsx
│   │   └── DictionaryApp.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   └── supabase.ts
│   └── services/
│       └── api.ts

backend/
├── auth/
│   ├── __init__.py
│   └── middleware.py
├── main.py
└── requirements.txt

supabase_schema.sql
```

## **Troubleshooting**

### Common Issues

1. **Authentication Errors**
   - Check Supabase environment variables
   - Verify redirect URLs in Supabase dashboard
   - Ensure email verification is configured

2. **API Connection Issues**
   - Verify backend is running on port 8000
   - Check CORS configuration
   - Ensure authentication headers are being sent

3. **Database Errors**
   - Run the schema SQL in Supabase
   - Check RLS policies
   - Verify table permissions

4. **Premium Feature Access**
   - Check subscription status in database
   - Verify `requireSubscription` middleware
   - Test with mock data first

## **Next Steps**

1. **Payment Integration**
   - Integrate Stripe for subscription payments
   - Implement webhook handling
   - Add subscription management UI

2. **Enhanced Features**
   - User search history
   - Favorite words
   - Social features
   - Advanced analytics

3. **Performance Optimization**
   - Implement caching
   - Add rate limiting
   - Optimize database queries

## **Support**
For issues or questions, check the project documentation or create an issue in the repository.
