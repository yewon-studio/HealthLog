import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

export function NativeShell() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    void StatusBar.setBackgroundColor({ color: '#2154e8' });
    void StatusBar.setStyle({ style: Style.Light });
    void SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      const atRoot = location.pathname === '/';
      if (!atRoot) {
        if (canGoBack) {
          navigate(-1);
        } else {
          navigate('/');
        }
        return;
      }
      const shouldExit = window.confirm('앱을 종료할까요?');
      if (shouldExit) {
        void CapacitorApp.exitApp();
      }
    });

    return () => {
      void listener.then((handle) => handle.remove());
    };
  }, [location.pathname, navigate]);

  return null;
}
