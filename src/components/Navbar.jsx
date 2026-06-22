import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Image, Tv, Trophy, Settings, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Galeria', path: '/', icon: Image },
    { name: 'Telão', path: '/telao', icon: Tv },
    { name: 'Premiação', path: '/premiacao', icon: Trophy },
    { name: 'Admin', path: '/admin', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-500 p-2 rounded-xl text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
              Vozes do Aluno
            </span>
            <span className="block text-[9px] font-medium text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              Exposição Escolar
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-violet-600/15 text-violet-300 border border-violet-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-xl cursor-pointer"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-800/50 flex flex-col gap-2 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-violet-600/15 text-violet-300 border border-violet-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
