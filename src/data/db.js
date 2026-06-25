import { supabase } from './supabaseClient';

// --- Brand Settings ---
export const getBrandSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('tipo', 'brand')
      .single();
      
    if (error) throw error;
    return {
      primaryColor: data.primaryColor || '#FCB045',
      logoUrl: data.logoUrl || '',
      logoScrolledUrl: data.logoScrolledUrl || '',
      faviconUrl: data.faviconUrl || ''
    };
  } catch (error) {
    console.error('Error fetching brand settings:', error);
    return { primaryColor: '#FCB045', logoUrl: '', logoScrolledUrl: '', faviconUrl: '' };
  }
};

export const saveBrandSettings = async (settings) => {
  // Try to update first
  const { data: existing, error: checkError } = await supabase
    .from('settings')
    .select('tipo')
    .eq('tipo', 'brand')
    .single();

  const payload = {
    tipo: 'brand',
    primaryColor: settings.primaryColor,
    logoUrl: settings.logoUrl,
    logoScrolledUrl: settings.logoScrolledUrl,
    faviconUrl: settings.faviconUrl
  };

  if (existing) {
    const { error } = await supabase.from('settings').update(payload).eq('tipo', 'brand');
    if (error) throw error;
  } else {
    const { error } = await supabase.from('settings').insert([payload]);
    if (error) throw error;
  }
  return settings;
};

// --- Banner Settings ---
export const getBannerSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('tipo', 'banner')
      .single();
      
    if (error) throw error;
    return {
      title: data.title || 'Encuentra tu Lugar Ideal',
      subtitle: data.subtitle || 'La agencia inmobiliaria digital del futuro.',
      images: data.images && data.images.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
      ]
    };
  } catch (error) {
    console.error('Error fetching banner settings:', error);
    return {
      title: 'Encuentra tu Lugar Ideal',
      subtitle: 'La agencia inmobiliaria digital del futuro.',
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80']
    };
  }
};

export const saveBannerSettings = async (settings) => {
  const { data: existing, error: checkError } = await supabase
    .from('settings')
    .select('tipo')
    .eq('tipo', 'banner')
    .single();

  const payload = {
    tipo: 'banner',
    title: settings.title,
    subtitle: settings.subtitle,
    images: settings.images
  };

  if (existing) {
    const { error } = await supabase.from('settings').update(payload).eq('tipo', 'banner');
    if (error) throw error;
  } else {
    const { error } = await supabase.from('settings').insert([payload]);
    if (error) throw error;
  }
  return settings;
};

// --- About Settings ---
export const getAboutSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('tipo', 'about')
      .single();
      
    if (error) throw error;
    return {
      title: data.title || 'Quiénes Somos',
      subtitle: data.subtitle || 'En Zentra Propiedades, revolucionamos la manera en que encuentras tu hogar o inversión. Combinamos nuestra vasta experiencia en el sector inmobiliario con tecnología de Inteligencia Artificial de vanguardia para ofrecerte recomendaciones personalizadas, precisas y rápidas.',
      images: data.images && data.images.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
      ]
    };
  } catch (error) {
    console.error('Error fetching about settings:', error);
    return {
      title: 'Quiénes Somos',
      subtitle: 'En Zentra Propiedades, revolucionamos la manera en que encuentras tu hogar o inversión. Combinamos nuestra vasta experiencia en el sector inmobiliario con tecnología de Inteligencia Artificial de vanguardia para ofrecerte recomendaciones personalizadas, precisas y rápidas.',
      images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80']
    };
  }
};

export const saveAboutSettings = async (settings) => {
  const { data: existing } = await supabase
    .from('settings')
    .select('tipo')
    .eq('tipo', 'about')
    .single();

  const payload = {
    tipo: 'about',
    title: settings.title,
    subtitle: settings.subtitle,
    images: settings.images
  };

  if (existing) {
    const { error } = await supabase.from('settings').update(payload).eq('tipo', 'about');
    if (error) throw error;
  } else {
    const { error } = await supabase.from('settings').insert([payload]);
    if (error) throw error;
  }
  return settings;
};

// --- Properties ---
export const getProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data.map(p => ({
      ...p,
      price: Number(p.price),
      beds: Number(p.beds),
      baths: Number(p.baths),
      sqft: Number(p.sqft),
      aiMatch: Number(p.aiMatch)
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

export const saveProperty = async (property) => {
  // If property has an ID, update it, otherwise insert it
  const isUpdate = !!property.id;
  
  const payload = {
    title: property.title,
    price: Number(property.price),
    currency: property.currency,
    type: property.type,
    department: property.department,
    province: property.province,
    district: property.district,
    beds: Number(property.beds),
    baths: Number(property.baths),
    sqft: Number(property.sqft),
    description: property.description,
    images: property.images,
    isPopular: property.isPopular,
    isAiRecommended: property.isAiRecommended,
    aiMatch: Number(property.aiMatch),
    operation: property.operation || 'Venta',
    status: property.status || 'Disponible'
  };

  try {
    if (isUpdate) {
      const { data, error } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', property.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('properties')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving property:', error);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting property:', error);
  }
};

// --- Leads ---
export const saveLead = async (leadData) => {
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      comments: leadData.comments
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const getLeads = async () => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

export const deleteLead = async (id) => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
