import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// This must be the default export
export default function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
