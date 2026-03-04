import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dires.app',
  appName: 'Dires',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#000000',
  },
};

export default config;
