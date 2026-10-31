import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-ivory text-slate-900 font-sans">
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <footer className="bg-burgundy-950 text-champagne-300/80 py-8 px-4 text-center border-t border-champagne-400/20 text-xs">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-serif font-bold text-white tracking-widest text-sm">
                THE ROYAL KNOT &bull; LUXURY WEDDING MANAGEMENT
              </div>
              <div>
                &copy; {new Date().getFullYear()} The Royal Knot Platform. All Rights Reserved.
              </div>
              <div className="flex items-center gap-4 text-[11px] text-champagne-400 font-medium">
                <span>4 Dashboards</span>
                <span>&bull;</span>
                <span>11 PRD Modules</span>
                <span>&bull;</span>
                <span>Full-Stack Spring Boot + React</span>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

