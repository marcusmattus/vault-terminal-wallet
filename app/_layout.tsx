import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#050505' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="boot" />
        <Stack.Screen name="unlock" />
        <Stack.Screen name="index" />
        <Stack.Screen name="send" />
        <Stack.Screen name="receive" />
        <Stack.Screen name="kyc" />
        <Stack.Screen name="security" />
        <Stack.Screen name="index-multichain" />
        <Stack.Screen name="send-multichain" />
        <Stack.Screen name="receive-multichain" />
      </Stack>
    </>
  );
}
