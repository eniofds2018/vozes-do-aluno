import React from 'react';
import { MessageSquare, Star, Award } from 'lucide-react';

export default function AwardList({ sortedFotos = [], comments = [] }) {
  
  // Calculate comments count for a photo
  const getCommentsCount = (fotoId) => {
    return comments.filter((c) => String(c.foto_id) === String(fotoId)).length;
  };

  // Select top photos with at least one comment, or just the top overall
  const items = sortedFotos
    .map(foto => ({
      ...foto,
      count: getCommentsCount(foto.id)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Show top 5

  return (
    <div className="flex flex-col gap-3.5">
      <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
        <Award size={15} className="text-violet-400" />
        Ranking de Participação (Top 5)
      </h3>

      {items.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {items.map((item, index) => {
            const isTop3 = index < 3;
            const medalColors = [
              'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/20', // Gold
              'bg-slate-350 text-slate-950 border-slate-200 shadow-slate-350/20', // Silver
              'bg-amber-600 text-white border-amber-500 shadow-amber-600/20',     // Bronze
            ];

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-3.5 flex items-center justify-between gap-4 border border-slate-800/80 hover:bg-slate-800/25 transition-all"
              >
                
                {/* RANK & PHOTO INFO */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Rank number badge */}
                  <span className={`w-6 h-6 rounded-lg border font-bold text-xs flex items-center justify-center shrink-0 shadow-md ${
                    isTop3 
                      ? medalColors[index]
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    {index + 1}
                  </span>

                  {/* Thumbnail */}
                  <img
                    src={item.image_url}
                    alt={item.titulo}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-800 shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
                    }}
                  />

                  {/* Name and category */}
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-slate-100 block truncate max-w-[150px] sm:max-w-xs">
                      {item.titulo}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                      {item.category || 'Geral'}
                    </span>
                  </div>
                </div>

                {/* COUNT STAT */}
                <div className="flex items-center gap-1.5 shrink-0 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-xl">
                  <MessageSquare size={13} className="text-violet-400" />
                  <span className="text-xs font-bold text-slate-200">
                    {item.count}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 border border-slate-850 rounded-2xl text-slate-500 text-xs">
          Nenhum dado de votação disponível ainda.
        </div>
      )}

    </div>
  );
}
