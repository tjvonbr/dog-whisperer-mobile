# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details:
   - Name: `dog-whisperer-mobile`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project"

## 2. Configure Authentication

1. **Enable Email Authentication:**
   - In your Supabase dashboard, go to **Authentication** → **Providers**
   - Enable the **Email** provider
   - Configure email settings as needed

2. **Get Your Project Credentials:**
   - Go to **Settings** → **API**
   - Copy the following values:
     - **Project URL** (looks like: `https://your-project-id.supabase.co`)
     - **anon public** key (starts with `eyJ...`)

## 3. Set Up Environment Variables

Create a `.env` file in your project root with:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Replace the placeholder values with your actual Supabase credentials.

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` and paste it into the editor
3. Click "Run" to execute the SQL

This will create:
- `chat_sessions` table with proper indexes
- Row Level Security (RLS) policies
- Automatic `updated_at` timestamp updates

## 5. Test the Integration

1. Start your Expo development server: `npm start`
2. Open your app and you'll see the authentication screen
3. Create a new account or sign in with existing credentials
4. Once authenticated, try creating a new chat
5. Check the Supabase dashboard → **Table Editor** → `chat_sessions` to see your data
6. Try signing out and signing back in to verify persistence

## Features

✅ **User Authentication**: Complete sign up/sign in flow with email/password
✅ **User-Specific Chats**: Each user only sees their own chat sessions
✅ **Hybrid Storage**: Uses Supabase when available, falls back to AsyncStorage
✅ **Automatic Sync**: All chat operations sync to the cloud
✅ **Offline Support**: Works offline with local storage fallback
✅ **Secure**: Row Level Security (RLS) ensures data privacy
✅ **Session Persistence**: Users stay logged in across app restarts

## Troubleshooting

- **Connection Issues**: Check your environment variables are correct
- **Permission Errors**: Ensure RLS policies are set up correctly
- **Data Not Syncing**: Check the console for Supabase errors
- **Auth Issues**: Verify email provider is enabled in Supabase dashboard
- **Sign Up Issues**: Check if email confirmation is required in Supabase settings

## Next Steps

- Implement real-time chat updates
- Add chat sharing features
- Set up data backup/export functionality
- Add password reset functionality
- Implement social login (Google, Apple, etc.)
