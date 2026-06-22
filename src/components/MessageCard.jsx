import React from 'react';
import { Trash2, MessageSquare, Clock } from 'lucide-react';

export default function MessageCard({ message, onDelete, isAdmin = false }) {
  // Generate a seed-based avatar background color from student name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-red-500/20 text-red-300 border-red-500/30',
      'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'bg-amber-500/20 text-amber-300 border-amber-500/30',
      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'bg-teal-500/20 text-teal-300 border-teal-500/30',
      'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      'bg-violet-500/20 text-violet-300 border-violet-500/30',
      'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
      'bg-pink-500/20 text-pink-300 border-pink-500/30',
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const nameInitial = message.aluno ? message.aluno.trim().charAt(0).toUpperCase() : 'A';
  const avatarStyle = getAvatarColor(message.aluno || 'Aluno');

  // Format date
  const formattedTime = message.created_at
    ? new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : '';
  const formattedDate = message.created_at
    ? new Date(message.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    : '';

  return (
    <div className="glass-card rounded-2xl p-4 flex gap-4 items-start animate-fade-in relative group border border-slate-800/80">
      
      {/* AVATAR ICON */}
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${avatarStyle}`}>
        {nameInitial}
      </div>

      {/* BODY CONTENT */}
      <div className="flex-grow min-w-0 pr-6">
        <div className="flex items-baseline justify-between flex-wrap gap-x-2">
          <div className="min-w-0">
            <span className="font-bold text-sm text-slate-100 truncate">
              {message.aluno || 'Aluno Anônimo'}
            </span>
            {message.turma && (
              <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{message.turma}</div>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
            <Clock size={10} />
            {formattedDate} {formattedTime}
          </span>
        </div>

        <p className="text-slate-300 text-xs mt-1.5 leading-relaxed break-words whitespace-pre-line">
          {message.texto}
        </p>

        {/* ASSOCIATED IMAGE TITLE (IF APPLICABLE) */}
        {message.foto_titulo && (
          <div className="mt-3 flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            <MessageSquare size={10} />
            <span>Sobre: {message.foto_titulo}</span>
          </div>
        )}
      </div>

      {/* MODERATOR CONTROL */}
      {isAdmin && onDelete && (
        <button
          onClick={() => onDelete(message.id)}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 bg-slate-900/40 hover:bg-red-500/10 border border-slate-800/50 hover:border-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 cursor-pointer"
          title="Excluir Comentário (Moderação)"
        >
          <Trash2 size={13} />
        </button>
      )}

    </div>
  );
}
