import React, { useState, useEffect } from 'react';
import { getPhotos } from '../services/photosService';
import { getFrases } from '../services/frasesService';
import { Play, Pause, ChevronLeft, ChevronRight, MessageSquare, Clock, Sparkles } from 'lucide-react';

export default function TelaoPage() {
  const [fotos, setFotos] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Refresh database comments/photos every 5 seconds to simulate real-time updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Automatic slideshow transition
  useEffect(() => {
    if (!isPlaying || fotos.length <= 1) return;
    const slideInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % fotos.length);
    }, 7000); // Transitions slide every 7 seconds
    return () => clearInterval(slideInterval);
  }, [isPlaying, fotos]);

  const fetchData = async () => {
    try {
      const [photosData, commentsData] = await Promise.all([
        getPhotos(),
        getFrases()
      ]);
      setFotos(photosData || []);
      setComentarios(commentsData || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching telao data:', err);
    }
  };

  const handlePrev = () => {
    if (fotos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  const handleNext = () => {
    if (fotos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % fotos.length);
  };

  const currentFoto = fotos[currentIndex];
  
  // Filter comments for active photo
  const currentComentarios = comentarios.filter(
    (c) => String(c.foto_id) === String(currentFoto?.id)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* HEADER CONTROLS BAR */}
      <header className="bg-slate-900/40 border-b border-slate-900/80 backdrop-blur-md px-6 py-4 flex justify-between items-center z-10">
        <h1 className="text-lg font-black bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles size={16} className="text-violet-400 fill-violet-400/10" /> 
          Mural Digital Interativo
        </h1>
        
        {/* PLAYER CONTROLS */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800/80 px-3 py-1 rounded-xl">
            <Clock size={12} className="text-slate-400" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Giro Automático
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl cursor-pointer transition text-slate-350"
              title="Foto anterior"
            >
              <ChevronLeft size={15} />
            </button>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-white cursor-pointer transition shadow-md shadow-violet-600/15"
              title={isPlaying ? 'Pausar apresentação' : 'Iniciar apresentação'}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>
            
            <button
              onClick={handleNext}
              className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl cursor-pointer transition text-slate-355"
              title="Próxima foto"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* VIEW GRID */}
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Iniciando exibição...</span>
        </div>
      ) : currentFoto ? (
        <main className="flex-grow grid grid-cols-1 lg:grid-cols-5 p-6 md:p-8 gap-8 items-stretch overflow-hidden">
          
          {/* Left panel: Image display */}
          <section className="lg:col-span-3 flex flex-col justify-between bg-slate-900/20 border border-slate-900/60 rounded-3xl p-5 shadow-2xl relative">
            <div className="relative flex-grow rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-900 flex items-center justify-center max-h-[60vh] md:max-h-[66vh] shadow-inner">
              <img
                src={currentFoto.image_url}
                alt={currentFoto.titulo}
                className="w-full h-full object-contain animate-fade-in"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
                }}
              />
              <div className="absolute top-4 left-4 bg-violet-600/90 border border-violet-400/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase">
                {currentFoto.category || 'Geral'}
              </div>
            </div>
            
            <div className="mt-5">
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                {currentFoto.titulo}
              </h2>
              {currentFoto.description && (
                <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-2xl">
                  {currentFoto.description}
                </p>
              )}
            </div>
          </section>

          {/* Right panel: Comments feed */}
          <section className="lg:col-span-2 flex flex-col bg-slate-900/20 border border-slate-900/60 rounded-3xl p-5 shadow-2xl max-h-[80vh] overflow-hidden">
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2 mb-5 border-b border-slate-900 pb-3">
              <MessageSquare size={16} className="text-violet-400" />
              Opinião dos Visitantes ({currentComentarios.length})
            </h3>

            <div className="flex-grow overflow-y-auto pr-1.5 flex flex-col gap-3.5 scrollbar-thin">
              {currentComentarios.length > 0 ? (
                currentComentarios.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-900/50 border border-slate-850 rounded-2xl p-4 shadow-sm animate-fade-in"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-violet-300 truncate">
                          👤 {c.aluno || 'Aluno Anônimo'}
                        </span>
                        {c.turma && (
                          <div className="text-[10px] text-slate-500 truncate">{c.turma}</div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 font-semibold">
                        {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed break-words">
                      {c.texto}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500 py-12">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center mb-4 text-slate-600">
                    <MessageSquare size={20} />
                  </div>
                  <p className="text-xs font-bold">Nenhum comentário enviado ainda.</p>
                  <p className="text-[10px] text-slate-600 mt-1 max-w-[180px] mx-auto leading-relaxed">
                    Escaneie o QR Code associado a esta obra para enviar seu comentário!
                  </p>
                </div>
              )}
            </div>
          </section>

        </main>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-slate-500 text-center p-12 gap-3">
          <Play size={40} className="text-slate-800 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-400">Nenhuma obra no mural</h3>
          <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
            Adicione obras através da página de administração para vê-las listadas no slideshow.
          </p>
        </div>
      )}
    </div>
  );
}
