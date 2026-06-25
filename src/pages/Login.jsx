import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowLeft } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas. (Pista: admin@zentra.pe / admin123)');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Volver a la web
        </button>
        
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <Lock size={32} />
            </div>
            <h2>Acceso Agentes</h2>
            <p>Ingresa tus credenciales para administrar el portal.</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <div className="input-with-icon">
                <User size={18} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="admin@zentra.pe"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Contraseña</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary login-btn">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
