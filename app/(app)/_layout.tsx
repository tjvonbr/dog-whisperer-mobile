import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      <Stack.Screen name="calendar" options={{ headerShown: false }} />
    </Stack>
  );
}
