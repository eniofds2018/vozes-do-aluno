import { supabase } from './supabase';

export const getFrases = async () => {
  const { data, error } = await supabase
    .from('comentarios')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getFrasesByPhotoId = async (fotoId) => {
  const { data, error } = await supabase
    .from('comentarios')
    .select('*')
    .eq('foto_id', fotoId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addFrase = async (fotoId, aluno, texto) => {
  if (!aluno.trim() || !texto.trim()) {
    throw new Error('Nome e frase são campos obrigatórios.');
  }

  const { data, error } = await supabase
    .from('comentarios')
    .insert([
      {
        foto_id: fotoId,
        aluno,
        texto,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) throw error;
  return data;
};

export const deleteFrase = async (id) => {
  const { data, error } = await supabase
    .from('comentarios')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return data;
};
