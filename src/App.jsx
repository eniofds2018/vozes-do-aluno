import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GalleryPage from './pages/GalleryPage';
import StudentPage from './pages/StudentPage';
import AdminPage from './pages/AdminPage';
import TelaoPage from './pages/TelaoPage';
import PremiacaoPage from './pages/PremiacaoPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Telao kiosk projection view runs fullscreen */}
        <Route path="/telao" element={<TelaoPage />} />

        {/* Standard application views run with Navbar header and footer layout */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
              <Navbar />
              
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<GalleryPage />} />
                  <Route path="/foto/:fotoId" element={<StudentPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/premiacao" element={<PremiacaoPage />} />
                </Routes>
              </main>

              <footer className="py-6 text-center text-[9px] font-bold text-slate-550 uppercase tracking-widest border-t border-slate-900/60 bg-slate-950">
                &copy; {new Date().getFullYear()} Mural Interativo - Vozes do Aluno.
              </footer>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
