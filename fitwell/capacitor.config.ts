import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yewonstudio.healthlog',
  appName: 'HealthLog',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      backgroundColor: '#2154e8',
      style: 'LIGHT',
    },
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#f6f1e8',
      showSpinner: false,
    },
  },
};

export default config;
