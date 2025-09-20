import { useAuth } from '@/lib/auth';
import { Redirect } from 'expo-router';

export default function AuthGuard() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return <Redirect href="/(app)" />;
}
