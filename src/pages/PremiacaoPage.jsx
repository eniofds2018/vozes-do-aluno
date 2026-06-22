import React, { useState, useEffect } from 'react';
import { getPhotos } from '../services/photosService';
import { getFrases } from '../services/frasesService';
import WinnerCard from '../components/WinnerCard';
import AwardList from '../components/AwardList';
import { Trophy, Sparkles, Award, BarChart3, Loader2 } from 'lucide-react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

export default function PremiacaoPage() {
  const [fotos, setFotos] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Window size state for Confetti responsiveness
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    fetchData();

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Get comment count for photo
  const getCommentsCount = (fotoId) => {
    return comments.filter((c) => String(c.foto_id) === String(fotoId)).length;
  };

  // Sort photos by engagement
  const rankedPhotos = [...fotos]
    .map(foto => ({
      ...foto,
      commentsCount: getCommentsCount(foto.id)
    }))
    .sort((a, b) => b.commentsCount - a.commentsCount);

  // Split podium
  const firstPlace = rankedPhotos[0] && rankedPhotos[0].commentsCount > 0 ? rankedPhotos[0] : null;
  const secondPlace = rankedPhotos[1] && rankedPhotos[1].commentsCount > 0 ? rankedPhotos[1] : null;
  const thirdPlace = rankedPhotos[2] && rankedPhotos[2].commentsCount > 0 ? rankedPhotos[2] : null;

  // Category stats calculation
  const getCategoryStats = () => {
    const categoryCounts = {};
    comments.forEach(c => {
      const photo = fotos.find(f => String(f.id) === String(c.foto_id));
      if (photo) {
        const cat = photo.category || 'Geral';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    });

    return Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen py-8 px-6 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* CELEBRATORY CONFETTI */}
      {firstPlace && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.12}
        />
      )}

      {/* HEADER SECTION */}
      <header className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Trophy size={13} className="fill-yellow-500/10" />
          Destaques & Engajamento
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Galeria de Premiações
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Celebrando os trabalhos escolares que mais despertaram discussões, opiniões e sentimentos nos visitantes da exposição.
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <Loader2 size={30} className="animate-spin text-violet-500" />
          <span className="text-sm font-semibold">Consolidando resultados...</span>
        </div>
      ) : rankedPhotos.length > 0 && comments.length > 0 ? (
        <div className="flex flex-col gap-14">
          
          {/* PODIUM SECTION */}
          {firstPlace && (
            <section>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-6 text-center flex items-center justify-center gap-2">
                <Sparkles size={14} className="text-yellow-400 fill-yellow-400/10" />
                Pódio de Obra Mais Comentada
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto px-4">
                
                {/* 2nd Place (Left) */}
                {secondPlace ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 16 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
                    className="order-2 md:order-1"
                  >
                    <WinnerCard
                      foto={secondPlace}
                      rank={2}
                      awardTitle="Excelente Diálogo"
                      commentsCount={secondPlace.commentsCount}
                    />
                  </motion.div>
                ) : (
                  <div className="order-2 md:order-1 hidden md:block" />
                )}

                {/* 1st Place (Center) */}
                <motion.div 
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="order-1 md:order-2 z-10 scale-100 md:scale-105"
                >
                  <WinnerCard
                    foto={firstPlace}
                    rank={1}
                    awardTitle="Grande Destaque do Público"
                    commentsCount={firstPlace.commentsCount}
                  />
                </motion.div>

                {/* 3rd Place (Right) */}
                {thirdPlace ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 24 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
                    className="order-3"
                  >
                    <WinnerCard
                      foto={thirdPlace}
                      rank={3}
                      awardTitle="Ampla Discussão"
                      commentsCount={thirdPlace.commentsCount}
                    />
                  </motion.div>
                ) : (
                  <div className="order-3 hidden md:block" />
                )}

              </div>
            </section>
          )}

          {/* LOWER GRID: LEADERBOARDS & STATS */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto w-full items-start">
            
            {/* RANKING LIST */}
            <div className="lg:col-span-3">
              <AwardList sortedFotos={fotos} comments={comments} />
            </div>

            {/* STATISTICS */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                <BarChart3 size={15} className="text-indigo-400" />
                Comentários por Categoria
              </h3>

              <div className="glass-card rounded-2xl p-5 border border-slate-800/80 flex flex-col gap-4">
                {categoryStats.length > 0 ? (
                  categoryStats.map((stat, i) => {
                    const maxVal = categoryStats[0].count;
                    const percent = Math.round((stat.count / maxVal) * 100);

                    return (
                      <div key={stat.name} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-semibold text-slate-300">
                          <span>{stat.name}</span>
                          <span className="text-indigo-300">{stat.count} coms</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                          <div
                            className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-550"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    Nenhuma estatística disponível.
                  </div>
                )}
              </div>
            </div>

          </section>

        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-950/20 max-w-xl mx-auto gap-3 flex flex-col items-center">
          <Trophy size={40} className="text-slate-800 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-400">Resultados pendentes</h3>
          <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
            As estatísticas e o pódio de engajamento estarão disponíveis quando os visitantes começarem a enviar comentários sobre as obras.
          </p>
        </div>
      )}

    </div>
  );
}
