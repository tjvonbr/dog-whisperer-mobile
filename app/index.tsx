import LoginScreen from '@/components/login-screen';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  return (
    <SafeAreaView className="h-full bg-white">
      <LoginScreen />
    </SafeAreaView>
  )
}
