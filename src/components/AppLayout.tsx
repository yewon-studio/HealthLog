import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="brand">Fitwell</p>
          <p className="brand-sub">Pilates × Gym</p>
        </div>
        <Navigation className="sidebar-nav" />
      </aside>
      <div className="main">
        <Outlet />
      </div>
      <Navigation className="bottom-nav" />
    </div>
  );
}
