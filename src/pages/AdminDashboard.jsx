import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../data/supabaseClient';
import { 
  getBrandSettings, saveBrandSettings, 
  getBannerSettings, saveBannerSettings,
  getAboutSettings, saveAboutSettings,
  getProperties, saveProperty, deleteProperty,
  getLeads, deleteLead
} from '../data/db';
import { LogOut, Save, Plus, Edit2, Trash2, Image as ImageIcon, Home, Palette, Info, Users } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('properties'); // 'brand', 'banner', 'properties'
  const [loading, setLoading] = useState(false);

  // Form states
  const [brandSettings, setBrandSettings] = useState({ primaryColor: '#FCB045', logoUrl: '', logoScrolledUrl: '', faviconUrl: '' });
  const [bannerSettings, setBannerSettings] = useState({ title: '', subtitle: '', images: [] });
  const [aboutSettings, setAboutSettings] = useState({ title: '', subtitle: '', images: [] });
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);

  // File states for uploading
  const [logoFile, setLogoFile] = useState(null);
  const [logoScrolledFile, setLogoScrolledFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [bannerFiles, setBannerFiles] = useState([]); // up to 4
  const [aboutFile, setAboutFile] = useState(null);
  const [propertyFiles, setPropertyFiles] = useState([null, null, null, null]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const brand = await getBrandSettings();
      setBrandSettings(brand);
      
      const banner = await getBannerSettings();
      setBannerSettings(banner);
      
      const about = await getAboutSettings();
      setAboutSettings(about);
      
      const props = await getProperties();
      setProperties(props);
      
      const loadedLeads = await getLeads();
      setLeads(loadedLeads);
    } catch (err) {
      console.error(err);
      alert('Error cargando datos de Supabase');
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (!success) alert('Credenciales incorrectas');
  };

  // --- File Upload Helper ---
  const uploadImageToSupabase = async (file, bucket) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }
    
    // Get public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  // --- Handlers ---
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let newLogoUrl = brandSettings.logoUrl;
      let newLogoScrolledUrl = brandSettings.logoScrolledUrl;
      let newFaviconUrl = brandSettings.faviconUrl;

      if (logoFile) {
        const url = await uploadImageToSupabase(logoFile, 'assets');
        if (url) newLogoUrl = url;
      }
      if (logoScrolledFile) {
        const url = await uploadImageToSupabase(logoScrolledFile, 'assets');
        if (url) newLogoScrolledUrl = url;
      }
      if (faviconFile) {
        const url = await uploadImageToSupabase(faviconFile, 'assets');
        if (url) newFaviconUrl = url;
      }

      const updated = { ...brandSettings, logoUrl: newLogoUrl, logoScrolledUrl: newLogoScrolledUrl, faviconUrl: newFaviconUrl };
      await saveBrandSettings(updated);
      setBrandSettings(updated);
      setLogoFile(null);
      setLogoScrolledFile(null);
      setFaviconFile(null);
      alert('Configuración de marca guardada');
    } catch (err) {
      console.error(err);
      alert('Error al guardar Marca: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newImages = [...bannerSettings.images];
      for (let i = 0; i < bannerFiles.length; i++) {
        if (bannerFiles[i]) {
          const url = await uploadImageToSupabase(bannerFiles[i], 'assets');
          if (url) {
            if (i < newImages.length) newImages[i] = url;
            else newImages.push(url);
          }
        }
      }

      const updated = { ...bannerSettings, images: newImages.filter(Boolean).slice(0, 4) };
      await saveBannerSettings(updated);
      setBannerSettings(updated);
      setBannerFiles([]);
      alert('Banner guardado');
    } catch (err) {
      console.error(err);
      alert('Error al guardar Banner: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newImages = [...aboutSettings.images];
      if (aboutFile) {
        const url = await uploadImageToSupabase(aboutFile, 'assets');
        if (url) {
          newImages[0] = url;
        }
      }

      const updated = { ...aboutSettings, images: newImages.filter(Boolean) };
      await saveAboutSettings(updated);
      setAboutSettings(updated);
      setAboutFile(null);
      alert('Sección Sobre Nosotros guardada');
    } catch (err) {
      console.error(err);
      alert('Error al guardar Sobre Nosotros: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewProperty = () => {
    setEditingProperty({
      title: '', price: 0, currency: 'USD', type: 'Casa', department: '', province: '', district: '',
      beds: 0, baths: 0, sqft: 0, description: '', images: [], isPopular: false, isAiRecommended: false, aiMatch: 95
    });
    setPropertyFiles([null, null, null, null]);
  };

  const handleEditProperty = (prop) => {
    setEditingProperty({ ...prop });
    setPropertyFiles([null, null, null, null]);
  };

  const handlePropertyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProperty(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePropertyFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...propertyFiles];
      newFiles[index] = file;
      setPropertyFiles(newFiles);
    }
  };

  const saveEditedProperty = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [...(editingProperty.images || [])];
      
      for (let i = 0; i < 4; i++) {
        if (propertyFiles[i]) {
          const url = await uploadImageToSupabase(propertyFiles[i], 'property-images');
          if (url) {
            uploadedUrls[i] = url;
          }
        }
      }

      const propToSave = { ...editingProperty, images: uploadedUrls.filter(Boolean) };
      await saveProperty(propToSave);
      
      await loadData();
      setEditingProperty(null);
      alert('Propiedad guardada correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al guardar. ¿Has creado la tabla properties en Supabase?');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta propiedad?')) {
      setLoading(true);
      try {
        await deleteProperty(id);
        await loadData();
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este contacto?')) {
      setLoading(true);
      try {
        await deleteLead(id);
        await loadData();
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="admin-login-container">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2>Acceso a Zentra</h2>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">Zentra Admin</div>
        <nav className="admin-nav">
          <button className={activeTab === 'properties' ? 'active' : ''} onClick={() => {setActiveTab('properties'); setEditingProperty(null);}}>
            <Home size={20} />
            <span className="nav-text">Propiedades</span>
          </button>
          <button className={activeTab === 'brand' ? 'active' : ''} onClick={() => setActiveTab('brand')}>
            <Palette size={20} />
            <span className="nav-text">Marca & Colores</span>
          </button>
          <button className={activeTab === 'banner' ? 'active' : ''} onClick={() => setActiveTab('banner')}>
            <ImageIcon size={20} />
            <span className="nav-text">Banner Principal</span>
          </button>
          <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>
            <Info size={20} />
            <span className="nav-text">Sobre Nosotros</span>
          </button>
          <button className={activeTab === 'leads' ? 'active' : ''} onClick={() => {setActiveTab('leads'); setEditingProperty(null);}}>
            <Users size={20} />
            <span className="nav-text">Contactos</span>
          </button>
        </nav>
        <button className="btn admin-logout" onClick={logout}>
          <LogOut size={20}/> 
          <span className="nav-text">Salir</span>
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h2>Panel de Control</h2>
          {loading && <span className="loading-spinner">Cargando...</span>}
        </div>
        
        <div className="admin-content">
          {/* BRAND TAB */}
          {activeTab === 'brand' && (
            <div className="admin-card">
              <h3>Configuración de Marca</h3>
              <form onSubmit={handleBrandSubmit}>
                <div className="form-group">
                  <label>Color Principal (Hex)</label>
                  <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <input type="color" className="color-picker" value={brandSettings.primaryColor} onChange={e => setBrandSettings({...brandSettings, primaryColor: e.target.value})} />
                    <input type="text" value={brandSettings.primaryColor} onChange={e => setBrandSettings({...brandSettings, primaryColor: e.target.value})} style={{flex: 1}}/>
                  </div>
                </div>
                <div className="form-group">
                  <label>Subir Nuevo Logo (Barra Transparente)</label>
                  <small className="help-text">Recomendado: Formato PNG transparente (color blanco), tamaño aprox. 250x100px. Se mostrará cuando la página esté arriba.</small>
                  <input type="file" accept="image/png, image/jpeg, image/svg+xml, image/webp" onChange={e => setLogoFile(e.target.files[0])} />
                  {(logoFile || brandSettings.logoUrl) && (
                    <div style={{background: '#333', padding: '10px', borderRadius: '8px', display: 'inline-block', marginTop: '10px'}}>
                      <img src={logoFile ? URL.createObjectURL(logoFile) : brandSettings.logoUrl} alt="Logo Preview" style={{height: '50px', width: 'auto', maxWidth: '100%', objectFit: 'contain'}}/>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Subir Nuevo Logo (Barra Blanca al deslizar)</label>
                  <small className="help-text">Recomendado: Formato PNG transparente (color oscuro/primario). Se mostrará cuando el usuario baje por la página.</small>
                  <input type="file" accept="image/png, image/jpeg, image/svg+xml, image/webp" onChange={e => setLogoScrolledFile(e.target.files[0])} />
                  {(logoScrolledFile || brandSettings.logoScrolledUrl) && (
                    <div style={{background: '#f8f9fa', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', display: 'inline-block', marginTop: '10px'}}>
                      <img src={logoScrolledFile ? URL.createObjectURL(logoScrolledFile) : brandSettings.logoScrolledUrl} alt="Logo Scrolled Preview" style={{height: '50px', width: 'auto', maxWidth: '100%', objectFit: 'contain'}}/>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Subir Nuevo Favicon</label>
                  <small className="help-text">Recomendado: Formato PNG o ICO, tamaño exacto 32x32px.</small>
                  <input type="file" accept="image/png, image/x-icon" onChange={e => setFaviconFile(e.target.files[0])} />
                  {(faviconFile || brandSettings.faviconUrl) && (
                    <img src={faviconFile ? URL.createObjectURL(faviconFile) : brandSettings.faviconUrl} alt="Favicon Preview" style={{maxHeight: '32px', marginTop: '10px'}}/>
                  )}
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Save size={18}/> {loading ? 'Guardando...' : 'Guardar Marca'}
                </button>
              </form>
            </div>
          )}

          {/* BANNER TAB */}
          {activeTab === 'banner' && (
            <div className="admin-card">
              <h3>Configuración del Banner</h3>
              <form onSubmit={handleBannerSubmit}>
                <div className="form-group">
                  <label>Título Principal</label>
                  <input type="text" value={bannerSettings.title} onChange={e => setBannerSettings({...bannerSettings, title: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Subtítulo</label>
                  <input type="text" value={bannerSettings.subtitle} onChange={e => setBannerSettings({...bannerSettings, subtitle: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Imágenes del Banner (Hasta 4)</label>
                  <small className="help-text">Recomendado: Formato WEBP o JPG, resolución 1280x720px para carga rápida.</small>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    {[0,1,2,3].map(i => {
                      const previewUrl = bannerFiles[i] ? URL.createObjectURL(bannerFiles[i]) : bannerSettings.images[i];
                      return (
                        <div key={i} style={{border: '1px dashed var(--gray-200)', padding: '10px', borderRadius: 'var(--radius-sm)'}}>
                          <input type="file" accept="image/jpeg, image/png, image/webp" onChange={e => {
                            const newFiles = [...bannerFiles];
                            newFiles[i] = e.target.files[0];
                            setBannerFiles(newFiles);
                          }} style={{width: '100%', fontSize: '0.8rem'}}/>
                          {previewUrl && <img src={previewUrl} alt="Banner Preview" style={{width: '100%', height: '120px', objectFit: 'contain', marginTop: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--gray-100)', padding: '5px'}}/>}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Save size={18}/> {loading ? 'Guardando...' : 'Guardar Banner'}
                </button>
              </form>
            </div>
          )}

          {/* ABOUT US TAB */}
          {activeTab === 'about' && (
            <div className="admin-card">
              <h3>Configuración de Sobre Nosotros</h3>
              <form onSubmit={handleAboutSubmit}>
                <div className="form-group">
                  <label>Título de la Sección</label>
                  <input type="text" value={aboutSettings.title} onChange={e => setAboutSettings({...aboutSettings, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Descripción / Texto Principal</label>
                  <textarea rows="5" value={aboutSettings.subtitle} onChange={e => setAboutSettings({...aboutSettings, subtitle: e.target.value})} required></textarea>
                </div>
                <div className="form-group">
                  <label>Imagen Destacada</label>
                  <small className="help-text">Recomendado: Formato WEBP o JPG, resolución ideal 800x800px o similar.</small>
                  <input type="file" accept="image/jpeg, image/png, image/webp" onChange={e => setAboutFile(e.target.files[0])} />
                  {(aboutFile || (aboutSettings.images && aboutSettings.images[0])) && (
                    <img 
                      src={aboutFile ? URL.createObjectURL(aboutFile) : aboutSettings.images[0]} 
                      alt="About Preview" 
                      style={{maxWidth: '200px', marginTop: '10px', borderRadius: 'var(--radius-sm)'}}
                    />
                  )}
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Save size={18}/> {loading ? 'Guardando...' : 'Guardar Sobre Nosotros'}
                </button>
              </form>
            </div>
          )}

          {/* PROPERTIES TAB */}
          {activeTab === 'properties' && !editingProperty && (
            <>
              <button className="btn btn-primary" onClick={handleAddNewProperty} style={{marginBottom: '1rem'}}>
                <Plus size={18} /> Añadir Propiedad
              </button>
              <div className="admin-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Título</th>
                      <th>Tipo</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Destacada</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(p => (
                      <tr key={p.id}>
                        <td><img src={p.images?.[0]} alt={p.title} className="img-preview-micro" /></td>
                        <td>{p.title}</td>
                        <td>{p.operation || 'Venta'} - {p.type}</td>
                        <td>{p.currency === 'PEN' ? 'S/' : '$'}{p.price?.toLocaleString()}</td>
                        <td>{p.status || 'Disponible'}</td>
                        <td>{p.isPopular ? 'Sí' : 'No'}</td>
                        <td>
                          <button className="action-btn edit" onClick={() => handleEditProperty(p)}><Edit2 size={16}/></button>
                          <button className="action-btn delete" onClick={() => handleDeleteProperty(p.id)}><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* EDIT/ADD PROPERTY FORM */}
          {activeTab === 'properties' && editingProperty && (
            <div className="admin-card">
              <h3>{editingProperty.id ? 'Editar Propiedad' : 'Nueva Propiedad'}</h3>
              <form className="property-form" onSubmit={saveEditedProperty}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Título</label>
                    <input type="text" name="title" value={editingProperty.title} onChange={handlePropertyChange} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Precio</label>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <select name="currency" value={editingProperty.currency || 'USD'} onChange={handlePropertyChange} style={{width: 'auto'}}>
                        <option value="USD">USD ($)</option>
                        <option value="PEN">PEN (S/)</option>
                      </select>
                      <input type="number" name="price" value={editingProperty.price} onChange={handlePropertyChange} required style={{flex: 1}} />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo</label>
                    <select name="type" value={editingProperty.type} onChange={handlePropertyChange}>
                      <option value="Casa">Casa</option>
                      <option value="Departamento">Departamento</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Oficina">Oficina</option>
                      <option value="Cochera">Cochera</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Operación</label>
                    <select name="operation" value={editingProperty.operation || 'Venta'} onChange={handlePropertyChange}>
                      <option value="Venta">Venta</option>
                      <option value="Alquiler">Alquiler</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select name="status" value={editingProperty.status || 'Disponible'} onChange={handlePropertyChange}>
                      <option value="Disponible">Disponible</option>
                      <option value="Vendido">Vendido</option>
                      <option value="Alquilado">Alquilado</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Departamento (Región)</label>
                    <input type="text" name="department" value={editingProperty.department} onChange={handlePropertyChange} required />
                  </div>
                  <div className="form-group">
                    <label>Provincia</label>
                    <input type="text" name="province" value={editingProperty.province} onChange={handlePropertyChange} required />
                  </div>
                  <div className="form-group">
                    <label>Distrito</label>
                    <input type="text" name="district" value={editingProperty.district} onChange={handlePropertyChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Habitaciones</label>
                    <input type="number" name="beds" value={editingProperty.beds} onChange={handlePropertyChange} />
                  </div>
                  <div className="form-group">
                    <label>Baños</label>
                    <input type="number" name="baths" value={editingProperty.baths} onChange={handlePropertyChange} />
                  </div>
                  <div className="form-group">
                    <label>Área (m²)</label>
                    <input type="number" name="sqft" value={editingProperty.sqft} onChange={handlePropertyChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción Detallada</label>
                  <textarea name="description" value={editingProperty.description} onChange={handlePropertyChange} rows="4"></textarea>
                </div>

                <div className="form-group">
                  <label>Imágenes de la Propiedad (Hasta 4)</label>
                  <small className="help-text">Recomendado: Formato WEBP o JPG, resolución ideal 800x600px para carga rápida.</small>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    {[0,1,2,3].map(idx => {
                      const previewUrl = propertyFiles[idx] ? URL.createObjectURL(propertyFiles[idx]) : (editingProperty.images && editingProperty.images[idx]);
                      return (
                        <div key={idx} style={{border: '1px dashed var(--gray-200)', padding: '1rem', textAlign: 'center', borderRadius: 'var(--radius-md)'}}>
                          <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => handlePropertyFileChange(e, idx)} style={{marginBottom: '10px', width: '100%', fontSize: '0.8rem'}}/>
                          {previewUrl && (
                            <img src={previewUrl} alt={`Property Preview ${idx}`} style={{width: '100%', height: '150px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--gray-100)', padding: '5px'}}/>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="isPopular" name="isPopular" checked={editingProperty.isPopular} onChange={handlePropertyChange} />
                    <label htmlFor="isPopular">Destacar Propiedad</label>
                  </div>
                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="isAiRecommended" name="isAiRecommended" checked={editingProperty.isAiRecommended} onChange={handlePropertyChange} />
                    <label htmlFor="isAiRecommended">Etiqueta "Recomendado por IA"</label>
                  </div>
                </div>

                {editingProperty.isAiRecommended && (
                  <div className="form-group">
                    <label>Porcentaje Match IA (%)</label>
                    <input type="number" name="aiMatch" value={editingProperty.aiMatch} onChange={handlePropertyChange} />
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn" onClick={() => setEditingProperty(null)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    <Save size={18}/> {loading ? 'Guardando...' : 'Guardar Propiedad'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LEADS TAB */}
          {activeTab === 'leads' && (
            <div className="admin-card">
              <h3>Contactos Registrados ({leads.length})</h3>
              {leads.length === 0 ? (
                <p>No hay contactos registrados aún.</p>
              ) : (
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
                    <thead>
                      <tr style={{background: 'var(--gray-100)', textAlign: 'left', borderBottom: '2px solid var(--gray-200)'}}>
                        <th style={{padding: '12px'}}>Fecha</th>
                        <th style={{padding: '12px'}}>Nombre</th>
                        <th style={{padding: '12px'}}>Teléfono</th>
                        <th style={{padding: '12px'}}>Email</th>
                        <th style={{padding: '12px'}}>Comentarios</th>
                        <th style={{padding: '12px'}}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(lead => (
                        <tr key={lead.id} style={{borderBottom: '1px solid var(--gray-200)'}}>
                          <td style={{padding: '12px', fontSize: '0.9rem'}}>{new Date(lead.created_at).toLocaleDateString()}</td>
                          <td style={{padding: '12px', fontWeight: '500'}}>{lead.name}</td>
                          <td style={{padding: '12px'}}>{lead.phone}</td>
                          <td style={{padding: '12px'}}>{lead.email}</td>
                          <td style={{padding: '12px', fontSize: '0.9rem', maxWidth: '300px'}}>{lead.comments}</td>
                          <td style={{padding: '12px'}}>
                            <button className="btn-icon danger" onClick={() => handleDeleteLead(lead.id)} title="Eliminar Contacto">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
