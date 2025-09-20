import { useAuth } from '@/lib/auth';
import { Redirect } from 'expo-router';

export default function AuthGuard() {
  const { user, loading } = useAuth();

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // If user is not authenticated, redirect to sign-in
  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  // If user is authenticated, redirect to main app
  return <Redirect href="/(app)" />;
}
