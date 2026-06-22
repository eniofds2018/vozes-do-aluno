import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, QrCode, Calendar } from 'lucide-react';

export default function PhotoCard({ foto, commentsCount = 0, onShowQR }) {
  // Safe date parsing
  const formattedDate = foto.created_at
    ? new Date(foto.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : '';

  return (
    <article className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group">
      
      {/* CARD IMAGE CONTAINER */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-900 border-b border-slate-800/80">
        <img
          src={foto.image_url}
          alt={foto.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
          }}
        />
        
        {/* CATEGORY BADGE */}
        <span className="absolute top-4 left-4 bg-slate-950/70 border border-slate-700/50 backdrop-blur-md text-slate-200 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
          {foto.category || 'Geral'}
        </span>

        {/* DATE OR STAT BADGE */}
        {formattedDate && (
          <span className="absolute top-4 right-4 bg-slate-950/70 border border-slate-700/50 backdrop-blur-md text-slate-350 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Calendar size={10} />
            {formattedDate}
          </span>
        )}
      </div>

      {/* CARD INFO CONTENT */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-white leading-snug group-hover:text-violet-400 transition-colors">
          {foto.titulo}
        </h3>
        
        <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed flex-grow">
          {foto.description || 'Nenhuma descrição fornecida para esta obra.'}
        </p>

        {/* METADATA BLOCK */}
        <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-5">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <MessageSquare size={13} className="text-indigo-400" />
            {commentsCount} {commentsCount === 1 ? 'comentário' : 'comentários'}
          </span>

          <div className="flex items-center gap-2">
            {/* QR Code Action Button */}
            <button
              onClick={() => onShowQR && onShowQR(foto)}
              className="p-2 bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Exibir QR Code da Obra"
            >
              <QrCode size={14} />
            </button>

            {/* Comment Action Link */}
            <Link
              to={`/foto/${foto.id}?img=${encodeURIComponent(foto.image_url)}`}
              className="text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-500 hover:opacity-95 shadow-md shadow-violet-600/10 px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              Comentar
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
