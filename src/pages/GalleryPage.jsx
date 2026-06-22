import React, { useState, useEffect } from 'react';
import { getPhotos } from '../services/photosService';
import { getFrases } from '../services/frasesService';
import PhotoCard from '../components/PhotoCard';
import QRCard from '../components/QRCard';
import { Sparkles, Search, SlidersHorizontal, Loader2, X, Printer } from 'lucide-react';

const PRESET_CATEGORIES = ['Todas', 'Artes Plásticas', 'Desenho', 'Fotografia', 'Pintura', 'Escultura', 'Colagem', 'Outro'];

export default function GalleryPage() {
  const [fotos, setFotos] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  
  // QR Modal States
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeFoto, setActiveFoto] = useState(null);

  const siteUrl = window.location.origin;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [photosData, commentsData] = await Promise.all([
        getPhotos(),
        getFrases()
      ]);
      setFotos(photosData);
      setComments(commentsData);
    } catch (e) {
      console.error('Error fetching gallery data:', e);
    } finally {
      setLoading(false);
    }
  };

  const getCommentsCount = (fotoId) => {
    return comments.filter(c => String(c.foto_id) === String(fotoId)).length;
  };

  const handleShowQR = (foto) => {
    setActiveFoto(foto);
    setShowQRModal(true);
  };

  // Filters
  const filteredFotos = fotos.filter(foto => {
    const matchesSearch = foto.titulo.toLowerCase().includes(search.toLowerCase()) || 
      (foto.description || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Todas' || 
      (foto.category || 'Outro') === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8 px-6 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <header className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-full text-violet-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={14} className="fill-violet-400/25" />
          Exposição Interativa
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-4">
          Vozes do Aluno
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Navegue pelas obras de arte dos estudantes. Escaneie os QR codes para deixar seus comentários e opinar sobre os trabalhos!
        </p>
      </header>

      {/* SEARCH AND FILTERS */}
      <section className="mb-10 flex flex-col md:flex-row items-center justify-between gap-5 animate-fade-in">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar obras, conceitos..."
            className="w-full bg-slate-900 border border-slate-800/80 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 rounded-2xl pl-11 pr-4 py-3 text-slate-200 text-sm focus:outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
          <SlidersHorizontal size={14} className="text-slate-500 shrink-0 hidden sm:block mr-2" />
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/10'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </section>

      {/* GALLERY GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
          <Loader2 size={32} className="animate-spin text-violet-500" />
          <span className="text-sm font-semibold">Carregando exposição...</span>
        </div>
      ) : filteredFotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredFotos.map((foto) => (
            <div key={foto.id} className="animate-fade-in">
              <PhotoCard
                foto={foto}
                commentsCount={getCommentsCount(foto.id)}
                onShowQR={handleShowQR}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-950/20 max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-slate-400">Nenhuma obra encontrada</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Tente mudar os filtros de busca ou verifique se novas obras foram adicionadas.
          </p>
        </div>
      )}

      {/* QR CODE DETAIL MODAL */}
      {showQRModal && activeFoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* HEADER TEXT */}
            <h2 className="text-base font-bold text-white mb-6 pr-6">
              QR Code da Obra
            </h2>

            {/* QR CARD */}
            <div className="mb-6">
              <QRCard foto={activeFoto} siteUrl={siteUrl} />
            </div>

            {/* QUICK ACTIONS */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Printer size={14} />
                Imprimir QR
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
