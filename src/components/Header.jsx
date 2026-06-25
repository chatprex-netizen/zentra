import React, { useState, useEffect } from 'react';
import { Building2, Lock, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ brand, forceScrolled = false }) => {
  const [scrolled, setScrolled] = useState(forceScrolled);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (forceScrolled) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [forceScrolled]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <Link to="/" className="logo">
          {brand?.logoUrl || brand?.logoScrolledUrl ? (
            <img 
              src={(scrolled && brand?.logoScrolledUrl) ? brand.logoScrolledUrl : (brand?.logoUrl || brand?.logoScrolledUrl)} 
              alt="Logo" 
              className="logo-icon" 
            />
          ) : (
            <>
              <Building2 className="text-primary" size={28} />
              <span>Zentra</span>
            </>
          )}
        </Link>
        
        <nav className="main-nav">
          <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <a href="/#home" onClick={() => setIsMobileMenuOpen(false)}>Inicio</a>
            <Link to="/propiedades" onClick={() => setIsMobileMenuOpen(false)}>Propiedades</Link>
            <a href="/#about" onClick={() => setIsMobileMenuOpen(false)}>Nosotros</a>
            <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)}>Contacto</a>
          </div>
          <Link to="/login" className="admin-link" title="Agentes">
            <Lock size={18} />
          </Link>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
