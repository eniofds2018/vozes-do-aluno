import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Sparkles, Printer } from 'lucide-react';

export default function QRCard({ foto, siteUrl }) {
  // Since we use BrowserRouter and have vercel.json rewrites, we navigate directly to the path
  const targetUrl = `${siteUrl}/foto/${foto.id}?img=${encodeURIComponent(foto.image_url)}`;

  return (
    <div className="bg-white text-slate-900 p-6 rounded-2xl border-2 border-dashed border-slate-200 shadow-lg flex flex-col items-center text-center relative print:break-inside-avoid print:shadow-none print:border-slate-350 max-w-sm mx-auto">
      
      {/* EXPOSITION LOGO ON TOP OF THE PRINT CARD */}
      <div className="flex items-center gap-1.5 mb-3 text-violet-600">
        <Sparkles size={14} className="fill-violet-100" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest">Vozes do Aluno</span>
      </div>

      {/* PHOTO PREVIEW */}
      <div className="w-full aspect-16/10 rounded-xl overflow-hidden mb-4 border border-slate-100 bg-slate-50 print:hidden">
        <img
          src={foto.image_url}
          alt={foto.titulo}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
          }}
        />
      </div>

      {/* ART TITLE */}
      <h3 className="font-black text-xl text-slate-800 leading-tight">
        {foto.titulo}
      </h3>
      
      <p className="text-slate-500 text-[11px] font-semibold mt-1 mb-5 uppercase tracking-wide">
        Categoria: {foto.category || 'Geral'}
      </p>

      {/* QR CODE CONTAINER */}
      <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200 print:bg-white print:border-slate-300">
        <QRCodeSVG value={targetUrl} size={160} level="H" includeMargin={true} />
      </div>

      {/* INSTRUCTIONS */}
      <p className="mt-5 font-bold text-violet-600 text-sm leading-snug print:text-slate-800">
        Escaneie para deixar seu comentário!
      </p>
      
      <p className="text-[10px] text-slate-400 mt-1 print:text-slate-500">
        Sua opinião aparecerá no telão da exposição.
      </p>

      {/* DASHED SCISSORS INDICATOR (FOR PRINT CUTOUT) */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 print:hidden">
        ✂️ Cortar aqui
      </div>

    </div>
  );
}
