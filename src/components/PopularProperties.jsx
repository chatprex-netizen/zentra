import React, { useState } from 'react';
import { MapPin, Bed, Bath, Square, Sparkles } from 'lucide-react';
import './PopularProperties.css';
import PropertyDetailsModal from './PropertyDetailsModal';

const PopularProperties = ({ properties, isSearchActive }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  return (
    <section id="properties" className="properties-section section-padding">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">
            {isSearchActive ? 'Resultados de Búsqueda' : 'Propiedades Destacadas'}
          </h2>
          <p className="section-subtitle">
            {isSearchActive 
              ? `Encontramos ${properties.length} propiedades para ti` 
              : 'Las mejores opciones seleccionadas para ti'}
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="no-results text-center">
            <p>No se encontraron propiedades con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map(property => (
              <div key={property.id} className="property-card animate-fade-in">
                <div className="property-image-wrapper">
                  <img src={property.images?.[0] || property.image} alt={property.title} className="property-image" />
                  <div className="property-badges">
                    <span className={`badge status-badge ${property.status === 'Vendido' ? 'sold' : property.status === 'Alquilado' ? 'rented' : 'available'}`}>
                      {property.status || 'Disponible'}
                    </span>
                    {property.isAiRecommended && (
                      <span className="badge ai-badge-small">
                        <Sparkles size={12} /> Match IA: {property.aiMatch}%
                      </span>
                    )}
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
                    <button className="btn btn-primary" style={{width: '100%', maxWidth: '200px', margin: '0 auto'}} onClick={() => setSelectedProperty(property)}>Detalles</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </section>
  );
};

export default PopularProperties;
