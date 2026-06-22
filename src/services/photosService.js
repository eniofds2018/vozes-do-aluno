import { supabase } from './supabase';

export const getPhotos = async () => {
  const { data, error } = await supabase
    .from('fotos')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Compatibility helper: convert category/categoria or other keys if they differ
  return (data || []).map(foto => ({
    ...foto,
    category: foto.category || foto.categoria || 'Geral',
    description: foto.description || foto.descricao || ''
  }));
};

export const getPhotoById = async (id) => {
  const { data, error } = await supabase
    .from('fotos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    category: data.category || data.categoria || 'Geral',
    description: data.description || data.descricao || ''
  };
};

export const uploadPhoto = async (titulo, description, category, file) => {
  if (!titulo.trim()) throw new Error('O título é obrigatório.');
  if (!file) throw new Error('A imagem é obrigatória.');

  // 1. Upload file to Supabase Storage bucket 'fotos-exposicao'
  const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('fotos-exposicao')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // 2. Fetch the public URL
  const { data: urlData } = supabase.storage
    .from('fotos-exposicao')
    .getPublicUrl(filePath);

  const image_url = urlData?.publicUrl || '';

  // 3. Insert record in 'fotos'
  const { data, error } = await supabase
    .from('fotos')
    .insert([
      {
        titulo,
        description,
        category,
        image_url,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) throw error;
  return data;
};

export const updatePhoto = async (id, updateData, newFile = null) => {
  let image_url = updateData.image_url;

  // 1. If a new file is uploaded, upload it and get URL
  if (newFile) {
    const fileExt = newFile.name ? newFile.name.split('.').pop() : 'jpg';
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('fotos-exposicao')
      .upload(filePath, newFile);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('fotos-exposicao')
      .getPublicUrl(filePath);

    image_url = urlData?.publicUrl || '';
  }

  // 2. Update record in DB
  const fieldsToUpdate = {
    titulo: updateData.titulo,
    description: updateData.description,
    category: updateData.category,
    image_url
  };

  const { data, error } = await supabase
    .from('fotos')
    .update(fieldsToUpdate)
    .eq('id', id);

  if (error) throw error;
  return data;
};

export const deletePhoto = async (id) => {
  // 1. Fetch photo to get image URL path to delete from storage if possible
  const { data: photo } = await supabase
    .from('fotos')
    .select('image_url')
    .eq('id', id)
    .single();

  if (photo && photo.image_url) {
    try {
      // Extract file name from public URL
      const pathParts = photo.image_url.split('/');
      const fileName = pathParts[pathParts.length - 1];
      await supabase.storage.from('fotos-exposicao').remove([fileName]);
    } catch (e) {
      console.warn('Could not remove file from storage', e);
    }
  }

  // 2. Delete comments of this photo first (cascade delete emulation for mock)
  try {
    await supabase.from('comentarios').delete().eq('foto_id', id);
  } catch (e) {
    console.warn('Could not remove comments associated with photo', e);
  }

  // 3. Delete database record
  const { data, error } = await supabase
    .from('fotos')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return data;
};
