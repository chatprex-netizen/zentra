import React, { useState, useEffect } from 'react';
import { Cpu, Target, Users } from 'lucide-react';
import { getAboutSettings } from '../data/db';
import './AboutUs.css';

const AboutUs = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    getAboutSettings().then(setAbout);
  }, []);

  if (!about) return null;

  return (
    <section id="about" className="about-section section-padding">
      <div className="container about-container">
        <div className="about-image-wrapper">
          <img 
            src={about.images[0]} 
            alt="Equipo Zentra" 
            className="about-image animate-fade-in"
          />
          <div className="experience-badge">
            <span className="years">IA</span>
            <span className="text">Impulsando el futuro</span>
          </div>
        </div>
        
        <div className="about-content">
          <h2 className="section-title">{about.title}</h2>
          <p className="about-description">
            {about.subtitle}
          </p>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon"><Cpu size={24} /></div>
              <div>
                <h4>Análisis Predictivo</h4>
                <p>Nuestra IA analiza tendencias del mercado para asegurar tu mejor inversión.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon"><Target size={24} /></div>
              <div>
                <h4>Match Perfecto</h4>
                <p>Encontramos la propiedad ideal basándonos en tu estilo de vida y preferencias.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon"><Users size={24} /></div>
              <div>
                <h4>Asesoría Experta</h4>
                <p>Agentes humanos respaldados por datos para guiarte en cada paso.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
