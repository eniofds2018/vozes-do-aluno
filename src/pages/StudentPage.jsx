import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getPhotoById } from '../services/photosService';
import { addFrase } from '../services/frasesService';
import { MessageSquare, User, Send, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function StudentPage() {
  const { fotoId } = useParams();
  const [searchParams] = useSearchParams();
  const [nome, setNome] = useState('');
  const [texto, setTexto] = useState('');
  const [foto, setFoto] = useState(null);
  
  // States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  // Fallback img URL from query search
  const fallbackImgUrl = searchParams.get('img');

  useEffect(() => {
    fetchPhoto();
  }, [fotoId]);

  const fetchPhoto = async () => {
    try {
      setLoading(true);
      const data = await getPhotoById(fotoId);
      if (data) setFoto(data);
    } catch (e) {
      console.warn('Failed to load photo metadata. Using query string fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !texto.trim()) {
      return setError('Preencha seu nome e a sua frase!');
    }

    setSubmitting(true);
    setError('');

    try {
      await addFrase(fotoId, nome, texto);
      setEnviado(true);
      setTexto('');
    } catch (err) {
      console.error(err);
      setError('Houve um erro ao enviar seu comentário. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* BACK TO GALLERY */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-6 transition cursor-pointer">
          <ArrowLeft size={12} />
          Voltar para a Galeria
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
            <Loader2 size={24} className="animate-spin text-violet-500" />
            <span className="text-xs font-semibold">Carregando obra...</span>
          </div>
        ) : (
          <>
            {/* WORK PREVIEW */}
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/60 mb-6">
              <img
                src={foto?.image_url || fallbackImgUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'}
                alt="Obra selecionada"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-4">
                <div className="w-full">
                  <span className="text-[9px] font-black uppercase text-violet-300 tracking-wider">
                    {foto?.category || 'Geral'}
                  </span>
                  <h2 className="text-base font-extrabold text-white leading-tight mt-0.5">
                    {foto?.titulo || 'Obra Escolar'}
                  </h2>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-xs font-semibold text-red-300">
                {error}
              </div>
            )}

            {enviado ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-5 shadow-lg shadow-emerald-500/10">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-100">Mensagem Enviada!</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-[250px] mx-auto leading-relaxed">
                  Parabéns! Sua opinião foi enviada e agora aparecerá no telão interativo da exposição.
                </p>
                
                <div className="flex flex-col gap-2 mt-8">
                  <button
                    onClick={() => setEnviado(false)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Escrever outro comentário
                  </button>
                  <Link
                    to="/"
                    className="w-full py-2.5 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl text-center transition"
                  >
                    Explorar outras obras
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
                
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <User size={12} className="text-violet-400" /> Seu Nome completo ou apelido
                  </label>
                  <input
                    type="text"
                    placeholder="Como gostaria de se identificar?"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-3 text-slate-150 text-sm focus:outline-none transition-all"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <MessageSquare size={12} className="text-indigo-400" /> O que você achou dessa obra?
                  </label>
                  <textarea
                    placeholder="Escreva seu comentário, crítica ou pergunta sobre o trabalho..."
                    rows="4"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-3 text-slate-150 text-sm focus:outline-none transition-all resize-none"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 hover:opacity-95 shadow-lg shadow-violet-500/20 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50 mt-3"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={13} /> Enviar Comentário
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
}
