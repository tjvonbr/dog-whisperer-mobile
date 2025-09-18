# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details:
   - Name: `dog-whisperer-mobile`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
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
2. Open your app and try creating a new chat
3. Check the Supabase dashboard → **Table Editor** → `chat_sessions` to see your data

## Features

✅ **Hybrid Storage**: Uses Supabase when available, falls back to AsyncStorage
✅ **Automatic Sync**: All chat operations sync to the cloud
✅ **Offline Support**: Works offline with local storage fallback
✅ **Real-time Ready**: Schema supports future real-time features
✅ **User Authentication Ready**: Includes `user_id` field for future auth

## Troubleshooting

- **Connection Issues**: Check your environment variables are correct
- **Permission Errors**: Ensure RLS policies are set up correctly
- **Data Not Syncing**: Check the console for Supabase errors

## Next Steps

- Add user authentication for multi-user support
- Implement real-time chat updates
- Add chat sharing features
- Set up data backup/export functionality
