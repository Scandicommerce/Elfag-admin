# React-Vite Authentication App with Supabase

A modern authentication application built with React, Vite, TypeScript, and Supabase. This app provides user registration, login, and a protected dashboard.

## Features

- ✅ User Registration with email and password
- ✅ User Login with email and password
- ✅ Protected Dashboard
- ✅ User session management
- ✅ Responsive design
- ✅ Modern UI with custom styling
- ✅ TypeScript support
- ✅ Real-time authentication state changes

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd auth-app
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. In your Supabase dashboard, go to Settings > API
3. Copy your `Project URL` and `anon` key

### 3. Configure Environment Variables

Create a `.env` file in the root of your project:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase credentials.

### 4. Enable Email Authentication in Supabase

1. In your Supabase dashboard, go to Authentication > Settings
2. Make sure "Enable email confirmations" is configured as needed
3. Configure any additional authentication settings

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/
│   ├── Login.tsx          # Login form component
│   ├── Register.tsx       # Registration form component
│   └── Dashboard.tsx      # Protected dashboard component
├── supabaseClient.ts      # Supabase client configuration
├── App.tsx               # Main app component with routing
├── App.css               # Custom styling
└── main.tsx              # App entry point
```

## Usage

### Registration
1. Click "Register here" link
2. Enter your email and password
3. Confirm your password
4. Submit the form

### Login
1. Enter your registered email and password
2. Click "Sign In"
3. You'll be redirected to the dashboard

### Dashboard
- View your logged-in email
- Click "Logout" to sign out

## Authentication Flow

1. **Registration**: Creates a new user account in Supabase
2. **Login**: Authenticates user with email/password
3. **Session Management**: Automatically maintains user session
4. **Protected Routes**: Dashboard is only accessible to authenticated users
5. **Logout**: Clears user session and redirects to login

## Customization

### Styling
- Modify `src/App.css` for custom styling
- CSS variables are defined for easy theme customization

### Components
- Extend `Login.tsx` and `Register.tsx` for additional fields
- Customize `Dashboard.tsx` for your app's functionality

### Supabase Integration
- Modify `supabaseClient.ts` for additional Supabase features
- Add database queries as needed

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Supabase** - Backend as a Service
- **CSS3** - Custom styling

## Common Issues

1. **Environment Variables**: Make sure your `.env` file is in the root directory and variables start with `VITE_`
2. **Supabase Configuration**: Verify your Supabase URL and anon key are correct
3. **Email Confirmation**: Check your Supabase authentication settings if registration isn't working

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive configuration
- The anon key is safe to use in frontend applications

## Next Steps

- Add password reset functionality
- Implement user profiles
- Add social authentication providers
- Set up email templates in Supabase
- Add form validation
- Implement role-based access control
