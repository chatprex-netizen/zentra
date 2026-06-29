import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { MapPin, Bed, Bath, Square, Sparkles, Filter, X, Search } from 'lucide-react';
import { getProperties, getBrandSettings } from '../data/db';
import '../components/PopularProperties.css';
import './PropertiesPage.css';

const PropertiesPage = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    operation: '',
    type: '',
    department: '',
    status: '',
    minPrice: '',
    maxPrice: ''
  });

  // Handle scrolling to hash when navigating from another page
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const brandData = await getBrandSettings();
      setBrand(brandData);
      
      if (brandData.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', brandData.primaryColor);
      }
      
      const propsFromDb = await getProperties();
      setAllProperties(propsFromDb);
      setFilteredProperties(propsFromDb);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = allProperties;

    if (filters.operation) {
      result = result.filter(p => p.operation === filters.operation);
    }
    if (filters.type) {
      result = result.filter(p => p.type === filters.type);
    }
    if (filters.department) {
      result = result.filter(p => p.department.toLowerCase().includes(filters.department.toLowerCase()));
    }
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseInt(filters.maxPrice));
    }

    setFilteredProperties(result);
  }, [filters, allProperties]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      operation: '',
      type: '',
      department: '',
      status: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <div className="properties-page">
      <Header brand={brand} forceScrolled={true} />

      <div className="container properties-content">
        <main className="properties-main">
          <div className="properties-filter-bar">

          <div className="filter-group">
            <label>Operación</label>
            <select name="operation" value={filters.operation} onChange={handleFilterChange}>
              <option value="">Todas</option>
              <option value="Venta">Venta</option>
              <option value="Alquiler">Alquiler</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Tipo de Propiedad</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">Todos los tipos</option>
              <option value="Casa">Casa</option>
              <option value="Departamento">Departamento</option>
              <option value="Terreno">Terreno</option>
              <option value="Oficina">Oficina</option>
              <option value="Cochera">Cochera</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Ubicación (Región/Ciudad)</label>
            <input 
              type="text" 
              name="department" 
              placeholder="Ej. Lima, Arequipa..." 
              value={filters.department} 
              onChange={handleFilterChange} 
            />
          </div>

          <div className="filter-group">
            <label>Estado</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="Disponible">Disponible</option>
              <option value="Vendido">Vendido</option>
              <option value="Alquilado">Alquilado</option>
            </select>
          </div>

          <div className="filter-group price-range">
            <label>Rango de Precio</label>
            <div className="price-inputs">
              <input 
                type="number" 
                name="minPrice" 
                placeholder="Mínimo" 
                value={filters.minPrice} 
                onChange={handleFilterChange} 
              />
              <span>-</span>
              <input 
                type="number" 
                name="maxPrice" 
                placeholder="Máximo" 
                value={filters.maxPrice} 
                onChange={handleFilterChange} 
              />
            </div>
          </div>

          <div className="filter-group filter-actions" style={{display: 'flex', gap: '0.5rem', flex: '0 0 auto', marginLeft: 'auto'}}>
            <button className="btn btn-outline clear-filters-btn" onClick={clearFilters} style={{height: '38px'}}>
              Limpiar
            </button>
            <button className="btn btn-primary" onClick={() => setShowMobileFilters(false)} style={{height: '38px', display: 'flex', alignItems: 'center', gap: '5px'}}>
              <Search size={16} /> Buscar
            </button>
          </div>

          </div>

          <div className="results-header">
            <p>Mostrando {filteredProperties.length} propiedades</p>
          </div>

          {loading ? (
            <div className="loading-state">Cargando propiedades...</div>
          ) : filteredProperties.length === 0 ? (
            <div className="no-results text-center">
              <p>No se encontraron propiedades con los filtros seleccionados.</p>
              <button className="btn btn-primary" onClick={clearFilters} style={{marginTop: '1rem'}}>Ver todas</button>
            </div>
          ) : (
            <div className="properties-page-grid">
              {filteredProperties.map(property => (
                <div key={property.id} className="property-card animate-fade-in">
                  <div className="property-image-wrapper">
                    <img src={property.images?.[0] || property.image} alt={property.title} className="property-image" />
                    <div className="property-badges">
                      <span className={`badge status-badge ${property.status === 'Vendido' ? 'sold' : property.status === 'Alquilado' ? 'rented' : 'available'}`}>
                        {property.status || 'Disponible'}
                      </span>
                    </div>
                    <div className="badges-bottom-left">
                      <span className="badge type-badge">{property.type}</span>
                    </div>
                    <div className="badges-bottom-right">
                      <span className={`badge operation-badge ${property.operation === 'Alquiler' ? 'rent' : 'sale'}`}>
                        {property.operation || 'Venta'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="property-content">
                    <h3 className="property-title">{property.title}</h3>
                    <p className="property-location">
                      <MapPin size={14} /> {property.district}, {property.province}
                    </p>
                    
                    <div className="property-features">
                      {property.beds > 0 && (
                        <span className="feature"><Bed size={16} /> {property.beds} Hab</span>
                      )}
                      {property.baths > 0 && (
                        <span className="feature"><Bath size={16} /> {property.baths} Bañ</span>
                      )}
                      {property.sqft > 0 && (
                        <span className="feature"><Square size={16} /> {property.sqft} m²</span>
                      )}
                    </div>
                    
                    <div className="property-footer" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem'}}>
                      <span className="property-price" style={{marginBottom: 0, alignSelf: 'flex-start'}}>
                        {property.currency === 'PEN' ? 'S/' : '$'}{property.price.toLocaleString('en-US')}
                      </span>
                      <button className="btn btn-primary btn-sm" style={{width: '100%', maxWidth: '200px', margin: '0 auto'}} onClick={() => setSelectedProperty(property)}>Detalles</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer brand={brand} />

      {selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </div>
  );
};

export default PropertiesPage;
