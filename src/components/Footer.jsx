import React from 'react';
import { Globe, MessageCircle, Share2, Sparkles } from 'lucide-react';
import './Footer.css';

const Footer = ({ brand }) => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            {brand?.logoUrl ? (
              <img src={brand.logoUrl} alt="Zentra Logo" style={{height: '50px', objectFit: 'contain', filter: 'brightness(0) invert(1)'}} />
            ) : (
              <>
                <span className="logo-icon"><Sparkles size={20} color="var(--primary-color)"/></span>
                <h2>Zentra <span className="logo-subtitle">Propiedades</span></h2>
              </>
            )}
          </div>
          
          <p className="footer-description">
            Tu agencia inmobiliaria digital potenciada por IA. Encontramos la propiedad perfecta para ti de manera rápida, inteligente y segura.
          </p>
          
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Web"><Globe size={20} /></a>
            <a href="#" className="social-icon" aria-label="WhatsApp"><MessageCircle size={20} /></a>
            <a href="#" className="social-icon" aria-label="Compartir"><Share2 size={20} /></a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Zentra Propiedades. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
