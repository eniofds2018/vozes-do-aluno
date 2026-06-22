import React, { useState, useEffect } from 'react';
import { getPhotos, deletePhoto } from '../services/photosService';
import { getFrases, deleteFrase } from '../services/frasesService';
import AdminLogin from '../components/AdminLogin';
import PhotoList from '../components/PhotoList';
import UploadPhotoForm from '../components/UploadPhotoForm';
import MessageCard from '../components/MessageCard';
import QRCard from '../components/QRCard';
import { LayoutDashboard, Image as ImageIcon, MessageSquare, Plus, Award, QrCode, X, Printer, Users } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  const [fotos, setFotos] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form / Modal States
  const [activeTab, setActiveTab] = useState('obras'); // 'obras' | 'comentarios'
  const [showFormModal, setShowFormModal] = useState(false);
  const [editFoto, setEditFoto] = useState(null);
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeFotoQR, setActiveFotoQR] = useState(null);

  const siteUrl = window.location.origin;

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

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

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('admin_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  const handlePhotoSuccess = () => {
    setShowFormModal(false);
    setEditFoto(null);
    fetchData();
  };

  const handleEditPhoto = (foto) => {
    setEditFoto(foto);
    setShowFormModal(true);
  };

  const handleDeletePhoto = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta obra de arte? Isso também apagará o arquivo e todos os comentários dela.')) {
      try {
        await deletePhoto(id);
        fetchData();
      } catch (err) {
        alert('Erro ao deletar: ' + err.message);
      }
    }
  };

  const handleDeleteComment = async (id) => {
    if (window.confirm('Excluir este comentário da exposição permanente?')) {
      try {
        await deleteFrase(id);
        fetchData();
      } catch (err) {
        alert('Erro ao excluir comentário: ' + err.message);
      }
    }
  };

  const handleShowQR = (foto) => {
    setActiveFotoQR(foto);
    setShowQRModal(true);
  };

  // Helper stats
  const totalObras = fotos.length;
  const totalComments = comments.length;
  const avgComments = totalObras > 0 ? (totalComments / totalObras).toFixed(1) : 0;

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen py-8 px-6 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Painel de Controle
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Gerencie as fotos expostas e modere as opiniões em tempo real.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/25 px-4 py-2 rounded-xl transition cursor-pointer"
        >
          Sair do Painel
        </button>
      </header>

      {/* DASHBOARD STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        
        {/* Total Obras */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
            <ImageIcon size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Total de Obras
            </span>
            <span className="text-2xl font-black text-white">{totalObras}</span>
          </div>
        </div>

        {/* Total Comentários */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Comentários Recebidos
            </span>
            <span className="text-2xl font-black text-white">{totalComments}</span>
          </div>
        </div>

        {/* Média por obra */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Média Comentários/Obra
            </span>
            <span className="text-2xl font-black text-white">{avgComments}</span>
          </div>
        </div>

      </section>

      {/* TABS SWITCHER */}
      <section className="flex border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('obras')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'obras'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Obras Expostas ({totalObras})
        </button>
        <button
          onClick={() => setActiveTab('comentarios')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'comentarios'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Moderação de Comentários ({totalComments})
        </button>
      </section>

      {/* ACTIVE PANEL CONTENT */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Sincronizando painel...</span>
        </div>
      ) : activeTab === 'obras' ? (
        <PhotoList
          fotos={fotos}
          comments={comments}
          onEdit={handleEditPhoto}
          onDelete={handleDeletePhoto}
          onShowQR={handleShowQR}
          onAddNew={() => {
            setEditFoto(null);
            setShowFormModal(true);
          }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {comments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comments.map((c) => {
                // Find photo title associated
                const photo = fotos.find((f) => String(f.id) === String(c.foto_id));
                const commentWithTitle = {
                  ...c,
                  foto_titulo: photo ? photo.titulo : 'Obra Desconhecida'
                };
                return (
                  <MessageCard
                    key={c.id}
                    message={commentWithTitle}
                    onDelete={handleDeleteComment}
                    isAdmin={true}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-slate-800 border-dashed rounded-2xl text-slate-500">
              Nenhum comentário recebido para moderação.
            </div>
          )}
        </div>
      )}

      {/* PHOTO FORM MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setShowFormModal(false);
                setEditFoto(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <h2 className="text-lg font-black text-white mb-6">
              {editFoto ? 'Editar Obra Escolar' : 'Cadastrar Nova Obra'}
            </h2>

            <UploadPhotoForm
              editFoto={editFoto}
              onSuccess={handlePhotoSuccess}
              onCancel={() => {
                setShowFormModal(false);
                setEditFoto(null);
              }}
            />
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {showQRModal && activeFotoQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <h2 className="text-base font-bold text-white mb-6 pr-6">
              QR Code Exclusivo
            </h2>

            <div className="mb-6">
              <QRCard foto={activeFotoQR} siteUrl={siteUrl} />
            </div>

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
