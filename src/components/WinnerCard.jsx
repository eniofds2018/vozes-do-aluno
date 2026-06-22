import React from 'react';
import { Trophy, Award, MessageSquare } from 'lucide-react';

export default function WinnerCard({ foto, rank = 1, awardTitle = 'Mais Comentado', commentsCount = 0 }) {
  
  // Custom styling settings for 1st, 2nd, and 3rd rank
  const config = {
    1: {
      medal: '🥇',
      border: 'border-amber-400 shadow-amber-500/10',
      glow: 'shadow-amber-500/10',
      accent: 'from-amber-500 to-yellow-300',
      badge: 'bg-amber-400 text-slate-950 font-bold',
      text: 'text-amber-300',
      badgeLabel: '1º LUGAR',
      bgGlow: 'bg-amber-500/5'
    },
    2: {
      medal: '🥈',
      border: 'border-slate-350 shadow-slate-350/5',
      glow: 'shadow-slate-350/5',
      accent: 'from-slate-400 to-slate-200',
      badge: 'bg-slate-350 text-slate-950 font-bold',
      text: 'text-slate-300',
      badgeLabel: '2º LUGAR',
      bgGlow: 'bg-slate-300/5'
    },
    3: {
      medal: '🥉',
      border: 'border-amber-600 shadow-amber-600/5',
      glow: 'shadow-amber-600/5',
      accent: 'from-amber-700 to-amber-500',
      badge: 'bg-amber-600 text-white font-bold',
      text: 'text-amber-500',
      badgeLabel: '3º LUGAR',
      bgGlow: 'bg-amber-700/5'
    }
  };

  const current = config[rank] || config[1];

  return (
    <div className={`relative glass-card rounded-3xl p-6 border-2 shadow-xl flex flex-col items-center text-center overflow-hidden ${current.border} ${current.bgGlow} animate-float`}>
      
      {/* Decorative radial background light */}
      <div className="absolute -top-24 w-48 h-48 bg-gradient-to-br from-violet-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* WINNER POSITION BADGE */}
      <span className={`px-3 py-1 rounded-full text-[9px] tracking-widest font-black uppercase mb-4 shadow-sm z-10 ${current.badge}`}>
        {current.medal} {current.badgeLabel}
      </span>

      {/* PHOTO IMAGE DISPLAY */}
      <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 mb-5 shadow-inner">
        <img
          src={foto.image_url}
          alt={foto.titulo}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
          }}
        />
      </div>

      {/* TITLES */}
      <div className="z-10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
          {awardTitle}
        </p>
        
        <h4 className="text-xl font-black text-white leading-tight">
          {foto.titulo}
        </h4>
        
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1 mb-4">
          Categoria: {foto.category || 'Geral'}
        </p>
      </div>

      {/* STATS AREA */}
      <div className="mt-auto z-10 w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl py-3 px-4 flex items-center justify-center gap-2">
        <MessageSquare size={14} className="text-indigo-400 animate-pulse" />
        <span className="text-sm font-black text-slate-100">{commentsCount}</span>
        <span className="text-xs text-slate-400 font-medium">comentários dos alunos</span>
      </div>

    </div>
  );
}
