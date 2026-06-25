import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import { saveLead } from '../data/db';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveLead(formData);
      setSubmitSuccess(true);
      setFormData({ name: '', phone: '', email: '', comments: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container contact-container">
        <div className="contact-info">
          <h2 className="section-title">Contáctanos</h2>
          <p className="section-subtitle">Déjanos tus datos y te ayudaremos a encontrar la propiedad ideal con nuestra tecnología IA.</p>
          
          <div className="info-items">
            <div className="info-item">
              <div className="info-icon"><Phone size={20} /></div>
              <div>
                <h5>Teléfono</h5>
                <p>+51 999 888 777</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><Mail size={20} /></div>
              <div>
                <h5>Email</h5>
                <p>hola@zentra.pe</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><MapPin size={20} /></div>
              <div>
                <h5>Oficina Principal</h5>
                <p>Av. Principal 123, San Isidro, Lima</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {submitSuccess ? (
            <div className="success-message" style={{textAlign: 'center', padding: '3rem 2rem', background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <CheckCircle size={60} color="var(--primary-color)" style={{margin: '0 auto 1rem'}} />
              <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-dark)'}}>¡Gracias por contactarnos!</h3>
              <p style={{color: 'var(--text-light)', lineHeight: '1.6'}}>Hemos recibido tus datos correctamente. Un asesor o nuestro agente de IA se pondrá en contacto contigo en breve para ayudarte a encontrar la propiedad ideal.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Juan Pérez" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                placeholder="+51 999..." 
                value={formData.phone} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="juan@ejemplo.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="comments">Comentarios</label>
              <textarea 
                id="comments" 
                name="comments" 
                rows="4" 
                placeholder="¿Qué tipo de propiedad estás buscando?" 
                value={formData.comments} 
                onChange={handleChange} 
                required 
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'} {!isSubmitting && <Send size={18} />}
            </button>
          </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
