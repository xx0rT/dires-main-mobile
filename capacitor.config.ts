import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dires.app',
  appName: 'Dires',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      '*.youtube.com',
      '*.youtube-nocookie.com',
      '*.googlevideo.com',
      '*.google.com',
    ],
  },
  ios: {
    contentInset: 'never',
    backgroundColor: '#FFFFFF',
    allowsLinkPreview: false,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
