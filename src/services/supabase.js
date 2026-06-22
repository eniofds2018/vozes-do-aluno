import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// Pre-populated initial mock data
const INITIAL_FOTOS = [
  {
    id: '1',
    titulo: 'Neon Cyberpunk City',
    description: 'Vista futurista do horizonte de uma metrópole cyberpunk com iluminação neon vibrante em tons rosa e azul, refletindo no asfalto molhado.',
    category: 'Cidade',
    image_url: '/gallery_neon_city.png',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    favorite: true
  },
  {
    id: '2',
    titulo: 'Cabana Nevoada',
    description: 'Uma cabana aconchegante de madeira cercada por pinheiros altos no meio de uma densa neblina matinal nas montanhas.',
    category: 'Natureza',
    image_url: '/gallery_foggy_forest.png',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    favorite: false
  },
  {
    id: '3',
    titulo: 'Fluido Abstrato',
    description: 'Pintura fluida acrílica contemporânea misturando tons metálicos de cobre, azul profundo, verde-azulado e espirais douradas reluzentes.',
    category: 'Abstrato',
    image_url: '/gallery_abstract_fluid.png',
    created_at: new Date().toISOString(),
    favorite: true
  }
];

const INITIAL_COMENTARIOS = [
  {
    id: 'c1',
    foto_id: '1',
    aluno: 'Ana Souza',
    texto: 'Adorei as cores neon! Parece o cenário de um jogo do futuro.',
    created_at: new Date(Date.now() - 3600000 * 23).toISOString()
  },
  {
    id: 'c2',
    foto_id: '1',
    aluno: 'Lucas Lima',
    texto: 'Ficou sensacional o reflexo das luzes na chuva.',
    created_at: new Date(Date.now() - 3600000 * 22).toISOString()
  },
  {
    id: 'c3',
    foto_id: '2',
    aluno: 'Mateus Rocha',
    texto: 'Passa uma sensação de muita paz e frio. Lindo!',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  }
];

// Helper functions for LocalStorage management
const getLocalData = (key, initial) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return initial;
  }
};

const saveLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const mockSupabase = {
  from: (table) => {
    return {
      select: (columns = '*') => {
        const order = (field, { ascending } = { ascending: true }) => {
          const list = table === 'fotos' 
            ? getLocalData('ag_gallery_images', INITIAL_FOTOS)
            : getLocalData('mock_comments', INITIAL_COMENTARIOS);

          const sorted = [...list].sort((a, b) => {
            const valA = a[field] || '';
            const valB = b[field] || '';
            if (valA === valB) return 0;
            return ascending 
              ? (valA > valB ? 1 : -1) 
              : (valA < valB ? 1 : -1);
          });

          return Promise.resolve({ data: sorted, error: null });
        };

        const eq = (field, value) => {
          const list = table === 'fotos' 
            ? getLocalData('ag_gallery_images', INITIAL_FOTOS)
            : getLocalData('mock_comments', INITIAL_COMENTARIOS);
          
          const filtered = list.filter(item => String(item[field]) === String(value));
          
          return {
            single: () => Promise.resolve({ data: filtered[0] || null, error: filtered[0] ? null : new Error('Not found') }),
            order: (orderField, { ascending } = { ascending: true }) => {
              const sorted = [...filtered].sort((a, b) => {
                const valA = a[orderField] || '';
                const valB = b[orderField] || '';
                return ascending 
                  ? (valA > valB ? 1 : -1) 
                  : (valA < valB ? 1 : -1);
              });
              return Promise.resolve({ data: sorted, error: null });
            },
            then: (resolve) => resolve({ data: filtered, error: null })
          };
        };

        const result = {
          order,
          eq,
          then: (callback) => {
            const list = table === 'fotos' 
              ? getLocalData('ag_gallery_images', INITIAL_FOTOS)
              : getLocalData('mock_comments', INITIAL_COMENTARIOS);
            callback({ data: list, error: null });
          }
        };

        return result;
      },

      insert: (rows) => {
        const listKey = table === 'fotos' ? 'ag_gallery_images' : 'mock_comments';
        const initial = table === 'fotos' ? INITIAL_FOTOS : INITIAL_COMENTARIOS;
        const list = getLocalData(listKey, initial);

        const newRows = (Array.isArray(rows) ? rows : [rows]).map(row => ({
          id: row.id || Date.now().toString() + Math.random().toString().substring(2, 7),
          created_at: row.created_at || new Date().toISOString(),
          ...(table === 'fotos' ? { favorite: false, description: '', category: 'Geral' } : {}),
          ...row
        }));

        const updated = [...newRows, ...list];
        saveLocalData(listKey, updated);

        return Promise.resolve({ data: newRows, error: null });
      },

      update: (values) => {
        return {
          eq: (field, value) => {
            const listKey = table === 'fotos' ? 'ag_gallery_images' : 'mock_comments';
            const initial = table === 'fotos' ? INITIAL_FOTOS : INITIAL_COMENTARIOS;
            const list = getLocalData(listKey, initial);

            const updated = list.map(item => {
              if (String(item[field]) === String(value)) {
                return { ...item, ...values };
              }
              return item;
            });

            saveLocalData(listKey, updated);
            return Promise.resolve({ data: updated.filter(item => String(item[field]) === String(value)), error: null });
          }
        };
      },

      delete: () => {
        return {
          eq: (field, value) => {
            const listKey = table === 'fotos' ? 'ag_gallery_images' : 'mock_comments';
            const initial = table === 'fotos' ? INITIAL_FOTOS : INITIAL_COMENTARIOS;
            const list = getLocalData(listKey, initial);

            const deleted = list.filter(item => String(item[field]) === String(value));
            const remaining = list.filter(item => String(item[field]) !== String(value));
            
            saveLocalData(listKey, remaining);
            return Promise.resolve({ data: deleted, error: null });
          }
        };
      }
    };
  },

  storage: {
    from: (bucket) => {
      return {
        upload: async (path, file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result;
              const key = `mock_storage_${bucket}_${path}`;
              localStorage.setItem(key, base64data);
              resolve({ data: { path }, error: null });
            };
            reader.readAsDataURL(file);
          });
        },

        getPublicUrl: (path) => {
          const key = `mock_storage_${bucket}_${path}`;
          const base64data = localStorage.getItem(key);
          if (base64data) {
            return { data: { publicUrl: base64data } };
          }
          // Default asset placeholders
          if (path.includes('gallery_neon_city')) return { data: { publicUrl: '/gallery_neon_city.png' } };
          if (path.includes('gallery_foggy_forest')) return { data: { publicUrl: '/gallery_foggy_forest.png' } };
          if (path.includes('gallery_abstract_fluid')) return { data: { publicUrl: '/gallery_abstract_fluid.png' } };
          return { data: { publicUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' } };
        },

        remove: async (paths) => {
          const arr = Array.isArray(paths) ? paths : [paths];
          arr.forEach(path => {
            const key = `mock_storage_${bucket}_${path}`;
            localStorage.removeItem(key);
          });
          return Promise.resolve({ data: {}, error: null });
        }
      };
    }
  }
};

let client;
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'SEU_SUPABASE_URL_AQUI') {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Real Supabase client loaded.');
  } catch (e) {
    console.error('Failed to initialize real Supabase client, falling back to Mock:', e);
    client = mockSupabase;
  }
} else {
  console.log('Using LocalStorage Mock Supabase client. (Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use a real database)');
  client = mockSupabase;
}

export const supabase = client;
export default supabase;
