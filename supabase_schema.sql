-- AI Dictionary App Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Subscription plans
CREATE TABLE public.subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    features JSONB NOT NULL, -- ['jokes', 'captions', 'premium_definitions']
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_provider VARCHAR(50), -- 'stripe', 'paypal', etc.
    payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE public.feature_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    feature_name VARCHAR(50) NOT NULL, -- 'dictionary', 'jokes', 'captions'
    query TEXT NOT NULL,
    response_length INTEGER,
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search history (for analytics)
CREATE TABLE public.search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    query TEXT NOT NULL,
    feature_used VARCHAR(50) NOT NULL,
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- User profiles: users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions: users can only view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Feature usage: users can only view their own usage
CREATE POLICY "Users can view own usage" ON public.feature_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.feature_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Search history: users can only view their own history
CREATE POLICY "Users can view own search history" ON public.search_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history" ON public.search_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price, duration_days, features) VALUES
('Basic', 'Access to dictionary and basic features', 0.00, 30, '["dictionary"]'),
('Premium', 'Access to all features including jokes and captions', 9.99, 30, '["dictionary", "jokes", "captions"]'),
('Pro', 'Unlimited access to all features with priority support', 19.99, 30, '["dictionary", "jokes", "captions", "priority_support"]');

-- Create indexes for better performance
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_feature_usage_user_id ON public.feature_usage(user_id);
CREATE INDEX idx_feature_usage_created_at ON public.feature_usage(created_at);
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX idx_search_history_created_at ON public.search_history(created_at);
