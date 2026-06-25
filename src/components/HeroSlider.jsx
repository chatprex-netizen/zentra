import React, { useState, useEffect } from 'react';
import './HeroSlider.css';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBannerSettings } from '../data/db';

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    let interval;
    getBannerSettings().then(loadedBanner => {
      setBanner(loadedBanner);
      if (loadedBanner && loadedBanner.images.length > 1) {
        interval = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % loadedBanner.images.length);
        }, 6000);
      }
    });

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (!banner) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banner.images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banner.images.length - 1 : prev - 1));
  };

  return (
    <section id="home" className="hero-section">
      {banner.images.map((img, index) => (
        img && (
          <div key={index} className={`hero-slide ${index === currentIndex ? 'active' : ''}`}>
            <img src={img} alt={`Zentra Property ${index}`} className="hero-image" />
          </div>
        )
      ))}
      
      <div className="hero-overlay">
        <div className="container hero-content">
          <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-color)', color: 'var(--white)', padding: '6px 16px', borderRadius: '30px', backdropFilter: 'blur(10px)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600'}}>
            <Sparkles size={16} />
            <span>Agencia Digital</span>
          </div>
          <h2 className="hero-title" style={{color: 'var(--primary-color)'}}>{banner.title}</h2>
          <p className="hero-subtitle">{banner.subtitle}</p>
        </div>
      </div>

      {banner.images.length > 1 && (
        <div className="slider-controls">
          <button className="control-btn" onClick={prevSlide} aria-label="Anterior">
            <ChevronLeft size={24} />
          </button>
          <button className="control-btn" onClick={nextSlide} aria-label="Siguiente">
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
