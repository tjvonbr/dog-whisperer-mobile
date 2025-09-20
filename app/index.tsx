import LoginScreen from '@/components/login-screen';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import './globals.css';

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return <LoginScreen />
}
