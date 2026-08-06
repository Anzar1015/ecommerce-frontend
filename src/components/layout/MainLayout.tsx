import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
