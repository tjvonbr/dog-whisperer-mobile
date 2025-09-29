import { useAuth } from '@/lib/auth';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function AuthGuard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});
