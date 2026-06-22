import React, { useState, useEffect } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import { uploadPhoto, updatePhoto } from '../services/photosService';

const CATEGORIES = ['Artes Plásticas', 'Desenho', 'Fotografia', 'Pintura', 'Escultura', 'Colagem', 'Outro'];

export default function UploadPhotoForm({ editFoto = null, onSuccess, onCancel }) {
  const [titulo, setTitulo] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Outro');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hydrate fields if we are editing
  useEffect(() => {
    if (editFoto) {
      setTitulo(editFoto.titulo || '');
      setDescription(editFoto.description || '');
      setCategory(editFoto.category || 'Outro');
      setFilePreview(editFoto.image_url || '');
      setFile(null);
    } else {
      setTitulo('');
      setDescription('');
      setCategory('Outro');
      setFile(null);
      setFilePreview('');
    }
    setError('');
  }, [editFoto]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return setError('O título da obra é obrigatório.');
    if (!editFoto && !file) return setError('Selecione uma imagem para a obra.');

    setLoading(true);
    setError('');

    try {
      let result = null;
      if (editFoto) {
        // Edit mode
        result = await updatePhoto(editFoto.id, { titulo, description, category, image_url: editFoto.image_url }, file);
      } else {
        // Add mode
        result = await uploadPhoto(titulo, description, category, file);
      }
      // Pass result to parent so it can show a confirmation if desired
      onSuccess(result);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao salvar a obra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl mx-auto">
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-xs font-semibold text-red-300">
          {error}
        </div>
      )}

      {/* TWO COLUMN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: UPLOAD AND PREVIEW */}
        <div className="flex flex-col gap-3">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Imagem da Obra
          </label>
          
          <div className="relative aspect-16/10 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-800 hover:border-violet-500/40 overflow-hidden flex flex-col items-center justify-center group transition-all">
            {filePreview ? (
              <>
                <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <label className="bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer transition">
                    Alterar Imagem
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-violet-400 group-hover:bg-slate-750 transition-colors mb-3">
                  <Upload size={20} />
                </div>
                <span className="text-xs font-bold text-slate-200">Escolha o arquivo da foto</span>
                <span className="text-[10px] text-slate-500 mt-1">JPEG, PNG ou WEBP até 10MB</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              Título da Obra
            </label>
            <input
              type="text"
              placeholder="Ex: Pôr do sol no pátio..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none transition"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              Categoria
            </label>
            <select
              className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none transition cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
          Descrição / Conceito da Obra (Opcional)
        </label>
        <textarea
          placeholder="Conte sobre os detalhes, o que inspirou esta obra ou quem a criou..."
          rows="3"
          className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none transition resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-800/80 pt-5 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 text-xs font-bold transition cursor-pointer"
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-500 hover:opacity-95 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-violet-500/10 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Check size={14} />
              {editFoto ? 'Salvar Alterações' : 'Publicar Obra'}
            </>
          )}
        </button>
      </div>

    </form>
  );
}
