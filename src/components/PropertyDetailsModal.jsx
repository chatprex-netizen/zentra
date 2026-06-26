import React, { useState, useEffect } from 'react';
import { X, MapPin, Bed, Bath, Square, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import './PropertyDetailsModal.css';

const PropertyDetailsModal = ({ property, onClose }) => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // Prevent scrolling on body when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!property) return null;

  const images = property.images?.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'];

  const currencySymbol = property.currency === 'PEN' ? 'S/' : '$';

  const handleWhatsApp = () => {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '51999999999';
    const message = `Hola, estoy interesado en la propiedad "${property.title}" que vi en su página web. ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
          <X size={24} />
        </button>
        
        <div className="modal-gallery">
          <div className="main-image-container">
            {images.length > 1 && (
              <button 
                className="gallery-nav prev"
                onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1); }}
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <img src={images[activeImage]} alt={property.title} className="main-image animate-fade-in" key={activeImage} />
            {images.length > 1 && (
              <button 
                className="gallery-nav next"
                onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1); }}
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
          {images.length > 1 && (
            <div className="thumbnail-strip">
              {images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`Thumbnail ${idx}`} 
                  className={`thumbnail ${idx === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-info">
          <div className="modal-header">
            <div className="modal-price">
              {currencySymbol}{property.price?.toLocaleString()}
            </div>
            <div className="property-badges" style={{marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              <span className={`badge operation-badge ${property.operation === 'Alquiler' ? 'rent' : 'sale'}`}>
                {property.operation || 'Venta'}
              </span>
              <span className={`badge status-badge ${property.status === 'Vendido' ? 'sold' : property.status === 'Alquilado' ? 'rented' : 'available'}`}>
                {property.status || 'Disponible'}
              </span>
              <span className="badge type-badge" style={{background: 'var(--gray-200)'}}>{property.type}</span>
            </div>
            <h2 className="modal-title">{property.title}</h2>
            <div className="modal-location">
              <MapPin size={18} className="text-primary" />
              {property.district}, {property.province}, {property.department}
            </div>
          </div>
          
          <div className="modal-features">
            <div className="modal-feature">
              <span className="icon"><Bed size={20} /></span>
              <span>{property.beds} Hab</span>
            </div>
            <div className="modal-feature">
              <span className="icon"><Bath size={20} /></span>
              <span>{property.baths} Baños</span>
            </div>
            <div className="modal-feature">
              <span className="icon"><Square size={20} /></span>
              <span>{property.sqft} m²</span>
            </div>
          </div>
          
          <div className="modal-description">
            <h4>Descripción</h4>
            <p>{property.description || 'No hay descripción detallada para esta propiedad.'}</p>
          </div>
          
          <div className="modal-contact">
            <p>¿Te interesa esta propiedad?</p>
            <button className="btn whatsapp-btn" onClick={handleWhatsApp}>
              <MessageCircle size={20} />
              Contactar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
