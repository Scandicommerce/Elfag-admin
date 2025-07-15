# Database Setup Guide

## Fix the Admin Authentication and Statistics Dashboard

The admin authentication requires a custom users table with `is_super_admin` field. Follow these steps:

## Steps to Fix:

### 1. Open Supabase Dashboard
- Go to [supabase.com](https://supabase.com)
- Login to your account
- Select your project

### 2. Open SQL Editor
- In the left sidebar, click on "SQL Editor"
- Click on "New query"

### 3. Run the Database Setup Script
- Copy the entire content from `database-setup.sql` file
- Paste it into the SQL Editor
- Click "Run" button

### 4. Verify Tables Created
- Go to "Table editor" in the left sidebar
- You should see three new tables:
  - `users` - stores user profiles with admin privileges
  - `resources` - stores listings/resources  
  - `messages` - stores user messages/interests

### 5. Create Your Admin User
After running the script, you need to:

1. **First, register a user account** through your app's registration form
2. **Then make that user an admin** by running this SQL in the SQL Editor:

```sql
UPDATE public.users 
SET is_super_admin = true 
WHERE email = 'your-admin-email@example.com';
```

Replace `'your-admin-email@example.com'` with your actual email address.

### 6. Verify Admin Status
To check if your admin user was created correctly, run:

```sql
SELECT email, is_super_admin FROM public.users WHERE is_super_admin = true;
```

### 7. Test Admin Login
- Go to your app's login page
- Enter your admin email and password
- You should now be able to access the admin dashboard

## Database Schema:

### Users Table (NEW)
- `id`: UUID primary key (references auth.users)
- `email`: User's email address
- `is_super_admin`: Boolean flag for admin privileges
- `created_at`: Timestamp when user was created
- `updated_at`: Timestamp when user was last updated

### Resources Table
- `id`: Primary key
- `user_id`: Foreign key to auth.users
- `title`: Resource title
- `description`: Resource description
- `category`: Resource category
- `region`: Geographic region
- `is_taken`: Boolean flag for taken resources
- `taken_at`: Timestamp when taken
- `taken_by`: User who took the resource

### Messages Table
- `id`: Primary key
- `resource_id`: Foreign key to resources table
- `from_user_id`: Sender user ID
- `to_user_id`: Recipient user ID
- `messages`: Message content
- `read_at`: Timestamp when message was read
- `is_interest`: Boolean flag for interest messages
- `status`: Message status (pending, accepted, rejected)

## Expected Results After Setup:
- **Total Listings**: 5 (sample data)
- **Active Users**: 1 (based on sample data)
- **Successful Matches**: 2 (messages with read_at not null AND resource is_taken = true)
- **Pending Connections**: 2 (resources with is_taken = true)
- **Active Listings**: 3 (total - successful matches)
- **Total Interests**: 5 (all messages)

## Troubleshooting:

### Admin Login Issues:
1. **"Database not properly configured"** - Run the database setup script first
2. **"You are not an admin"** - Make sure you updated the users table with your email
3. **"404 Error"** - The users table doesn't exist, run setup script

### If you get 404 errors:
1. Check that the `users` table exists in Supabase Table Editor
2. Verify your environment variables are correct in `.env`
3. Make sure you ran the complete database setup script

### If admin check fails:
1. Verify your user exists in the users table: `SELECT * FROM public.users WHERE email = 'your-email@example.com'`
2. Check if `is_super_admin` is set to `true`
3. Look at browser console for detailed error messages

### If sample data is missing:
The script will only insert sample data if there's at least one user in the auth.users table. Make sure you have registered at least one user through your app.

## Security Notes:
- Row Level Security (RLS) is enabled for all tables
- Admin status checking is allowed without authentication for login verification
- Users can only see their own profile data
- All queries use proper security policies

## Manual Admin Setup (Alternative):
If the automatic trigger doesn't work, you can manually insert a user:

```sql
-- After registering through the app, get your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then manually insert/update in users table
INSERT INTO public.users (id, email, is_super_admin) 
VALUES ('your-user-id-here', 'your-email@example.com', true)
ON CONFLICT (id) 
DO UPDATE SET is_super_admin = true;
``` 