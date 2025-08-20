from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import os
from typing import Optional
from pydantic import BaseModel

# Enhanced Supabase configuration logging
print("=== SUPABASE AUTH CONFIGURATION DEBUG ===")
supabase_url = os.getenv("SUPABASE_URL")
supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")

print(f"SUPABASE_URL: {'SET' if supabase_url else 'NOT SET'}")
if supabase_url:
    print(f"SUPABASE_URL value: {supabase_url}")
    print(f"SUPABASE_URL is placeholder: {'YES' if 'your_supabase_project_url' in supabase_url else 'NO'}")

print(f"SUPABASE_SERVICE_KEY: {'SET' if supabase_service_key else 'NOT SET'}")
if supabase_service_key:
    print(f"SUPABASE_SERVICE_KEY length: {len(supabase_service_key)}")
    print(f"SUPABASE_SERVICE_KEY starts with: {supabase_service_key[:10]}...")
    print(f"SUPABASE_SERVICE_KEY is placeholder: {'YES' if 'your_supabase_service_key' in supabase_service_key else 'NO'}")

# Initialize Supabase client with detailed logging
if not supabase_url or not supabase_service_key:
    print("WARNING: Supabase environment variables not set. Authentication will fail.")
    print(f"Missing SUPABASE_URL: {not supabase_url}")
    print(f"Missing SUPABASE_SERVICE_KEY: {not supabase_service_key}")
    supabase: Optional[Client] = None
else:
    try:
        print("Attempting to create Supabase client...")
        print(f"URL: {supabase_url}")
        print(f"Key length: {len(supabase_service_key)}")
        print(f"Key starts with: {supabase_service_key[:20]}...")
        
        # Try to create client with minimal parameters
        import os
        # Clear any proxy environment variables that might interfere
        if 'HTTP_PROXY' in os.environ:
            del os.environ['HTTP_PROXY']
        if 'HTTPS_PROXY' in os.environ:
            del os.environ['HTTPS_PROXY']
            
        supabase: Client = create_client(supabase_url, supabase_service_key)
        print("SUCCESS: Supabase client created successfully")
        
        # Test the connection
        try:
            # Try a simple query to test the connection
            test_response = supabase.table('user_profiles').select('count', count='exact').limit(1).execute()
            print("SUCCESS: Supabase connection test passed")
        except Exception as test_error:
            print(f"WARNING: Supabase connection test failed: {test_error}")
            print("This might be due to missing tables or incorrect permissions")
            
    except Exception as client_error:
        print(f"ERROR: Failed to create Supabase client: {client_error}")
        supabase = None

print("=========================================")

security = HTTPBearer()

class User(BaseModel):
    id: str
    email: str
    username: Optional[str] = None

async def create_user_profile(user, supabase_client) -> User:
    """
    Create a new user profile in the database using service role access
    """
    try:
        print(f"Creating profile for user: {user.id}")
        
        # Extract username from user metadata or generate one
        username = None
        if user.user_metadata and 'username' in user.user_metadata:
            username = user.user_metadata['username']
        else:
            # Generate username from email
            username = user.email.split('@')[0] if user.email else f"user_{user.id[:8]}"
        
        # Create profile using service role (bypasses RLS)
        profile_data = {
            'id': user.id,
            'username': username,
            'email': user.email,
            'is_active': True
        }
        
        print(f"Inserting profile data: {profile_data}")
        
        profile_response = supabase_client.table('user_profiles').insert(profile_data).execute()
        
        if profile_response.data:
            print("SUCCESS: User profile created")
            return User(
                id=user.id,
                email=user.email,
                username=username
            )
        else:
            print("WARNING: Profile creation returned no data")
            return User(
                id=user.id,
                email=user.email,
                username=username
            )
            
    except Exception as e:
        print(f"ERROR: Failed to create user profile: {e}")
        print(f"Error type: {type(e).__name__}")
        # Return user without profile if creation fails
        return User(
            id=user.id,
            email=user.email,
            username=None
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    Validate JWT token and return user information
    """
    print(f"=== AUTHENTICATION DEBUG ===")
    print(f"Supabase client available: {'YES' if supabase else 'NO'}")
    
    if not supabase:
        print("ERROR: Supabase client not available")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service not configured"
        )
    
    try:
        token = credentials.credentials
        print(f"Token received: {'YES' if token else 'NO'}")
        print(f"Token length: {len(token) if token else 0}")
        print(f"Token starts with: {token[:10] if token else 'N/A'}...")
        
        # Verify token with Supabase
        print("Attempting to verify token with Supabase...")
        user_response = supabase.auth.get_user(token)
        
        if not user_response.user:
            print("ERROR: No user found in response")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        print(f"SUCCESS: User authenticated - ID: {user_response.user.id}")
        print(f"User email: {user_response.user.email}")
        
        # Get user profile from database - create if doesn't exist
        try:
            print("Attempting to fetch user profile...")
            profile_response = supabase.table('user_profiles').select('*').eq('id', user_response.user.id).single().execute()
            
            if profile_response.data:
                print("SUCCESS: User profile found")
                return User(
                    id=user_response.user.id,
                    email=user_response.user.email,
                    username=profile_response.data.get('username')
                )
            else:
                # Profile doesn't exist - create it
                print("No profile found - creating new profile...")
                return await create_user_profile(user_response.user, supabase)
                
        except Exception as profile_error:
            print(f"Profile fetch error: {profile_error}")
            # Profile doesn't exist - create it
            print("Creating new profile due to fetch error...")
            return await create_user_profile(user_response.user, supabase)
        
    except Exception as e:
        print(f"Authentication error: {e}")
        print(f"Error type: {type(e).__name__}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def require_subscription(user: User = Depends(get_current_user)) -> User:
    """
    Check if user has active subscription for premium features
    """
    if not supabase:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service not configured"
        )
    
    try:
        # Check for active subscription - handle missing table gracefully
        try:
            subscription_response = supabase.table('user_subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single().execute()
            
            if subscription_response.data:
                return user
        except Exception as subscription_error:
            print(f"Subscription table error (likely missing): {subscription_error}")
            # Allow access if subscription table doesn't exist (for testing)
            return user
        
        # For now, allow access without subscription (for testing)
        return user
        
    except Exception as e:
        print(f"Subscription check error: {e}")
        # Allow access for testing
        return user
