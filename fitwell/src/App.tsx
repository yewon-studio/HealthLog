import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { NativeShell } from './native/NativeShell';
import { CalendarPage } from './pages/Calendar';
import { HomePage } from './pages/Home';
import { SettingsPage } from './pages/Settings';
import { StatisticsPage } from './pages/Statistics';
import { AppStoreProvider } from './store/AppStore';

export default function App() {
  return (
    <AppStoreProvider>
      <BrowserRouter>
        <NativeShell />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="statistics" element={<StatisticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStoreProvider>
  );
}
