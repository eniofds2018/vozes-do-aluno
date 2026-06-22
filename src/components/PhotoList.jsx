import React, { useState } from 'react';
import { Edit3, Trash2, QrCode, Search, MessageSquare, Plus } from 'lucide-react';

export default function PhotoList({ fotos = [], comments = [], onEdit, onDelete, onShowQR, onAddNew }) {
  const [search, setSearch] = useState('');

  // Get comments count for each photo
  const getCommentsCount = (fotoId) => {
    return comments.filter((c) => String(c.foto_id) === String(fotoId)).length;
  };

  const filteredFotos = fotos.filter((f) =>
    f.titulo.toLowerCase().includes(search.toLowerCase()) ||
    (f.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      
      {/* FILTER & TOP ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar por título ou categoria..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-xl pl-10 pr-4 py-2 text-slate-200 text-xs focus:outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add New Button */}
        <button
          onClick={onAddNew}
          className="w-full sm:w-auto px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow-md shadow-violet-600/15"
        >
          <Plus size={14} />
          Nova Obra
        </button>
      </div>

      {/* PHOTO TABLE GRID */}
      {filteredFotos.length > 0 ? (
        <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-950/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-900/35">
                  <th className="py-4 px-5">Obra</th>
                  <th className="py-4 px-5">Categoria</th>
                  <th className="py-4 px-5">Comentários</th>
                  <th className="py-4 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredFotos.map((foto) => {
                  const commentsCount = getCommentsCount(foto.id);
                  return (
                    <tr key={foto.id} className="hover:bg-slate-900/20 transition-all group">
                      
                      {/* OBRA / PHOTO THUMBNAIL & TITLE */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={foto.image_url}
                            alt={foto.titulo}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-800 shadow-sm shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
                            }}
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-sm text-slate-100 block truncate max-w-[200px] md:max-w-sm">
                              {foto.titulo}
                            </span>
                            <span className="text-[10px] text-slate-500 line-clamp-1 max-w-[200px] md:max-w-sm">
                              {foto.description || 'Sem descrição.'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY BADGE */}
                      <td className="py-3.5 px-5">
                        <span className="inline-block bg-slate-800/60 border border-slate-700/30 text-[10px] font-bold text-slate-350 px-2 py-0.5 rounded-full">
                          {foto.category || 'Geral'}
                        </span>
                      </td>

                      {/* STATS */}
                      <td className="py-3.5 px-5">
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                          <MessageSquare size={12} className="text-indigo-400" />
                          {commentsCount}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* QR CODE ACTION */}
                          <button
                            onClick={() => onShowQR(foto)}
                            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-850 rounded-xl transition cursor-pointer"
                            title="Visualizar QR Code"
                          >
                            <QrCode size={13} />
                          </button>

                          {/* EDIT ACTION */}
                          <button
                            onClick={() => onEdit(foto)}
                            className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-xl transition cursor-pointer"
                            title="Editar Obra"
                          >
                            <Edit3 size={13} />
                          </button>

                          {/* DELETE ACTION */}
                          <button
                            onClick={() => onDelete(foto.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                            title="Excluir Obra"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
          <p className="text-sm font-medium text-slate-500">Nenhuma obra cadastrada.</p>
          <button
            onClick={onAddNew}
            className="mt-3 text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            Adicionar a primeira obra
          </button>
        </div>
      )}

    </div>
  );
}
