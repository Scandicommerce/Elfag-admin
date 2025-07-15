# Setup Instructions for Supabase Authentication

## Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to Settings > API
4. Copy your Project URL and anon/public key

## Step 2: Create .env File

Create a `.env` file in the `auth-app` directory with your actual Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

**Important:** 
- Replace `your-project-id` with your actual project ID
- Replace `your-actual-anon-key` with your actual anon key
- Never commit the `.env` file to version control (it's already in `.gitignore`)

## Step 3: Enable Email Authentication in Supabase

1. In your Supabase Dashboard, go to Authentication > Settings
2. Make sure "Enable email confirmations" is configured as needed
3. Configure your email templates if desired

## Step 4: Run the Application

```bash
cd auth-app
npm install
npm run dev
```

## Features Implemented

✅ **Login/Register Forms** - Complete with Supabase authentication
✅ **Protected Routes** - Dashboard is only accessible when logged in
✅ **Public Routes** - Login/Register redirect to dashboard if already logged in
✅ **Authentication Context** - Manages user state across the app
✅ **Sign Out Functionality** - Logout button in the dashboard
✅ **Error Handling** - Proper error messages for auth failures
✅ **Loading States** - Loading indicators during auth operations
✅ **Form Validation** - Password length and confirmation matching

## Usage

1. Navigate to `/login` or `/register` to authenticate
2. After successful login, you'll be redirected to the admin dashboard
3. The dashboard shows user email and has a sign out button
4. All routes are protected - you'll be redirected to login if not authenticated

## Troubleshooting

- If you see "Using temporary Supabase credentials" in the console, make sure your `.env` file is properly configured
- Make sure your Supabase project has email authentication enabled
- Check the browser console for any error messages 