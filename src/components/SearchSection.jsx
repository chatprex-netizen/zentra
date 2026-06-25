import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchSection.css';

const SearchSection = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    department: '',
    province: '',
    district: '',
    type: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <section className="search-section" id="buscar">
      <div className="container">
        <div className="search-container animate-fade-in">
          <form className="search-form" onSubmit={handleSubmit}>
            
            <div className="search-field">
              <label>Ubicación</label>
              <input 
                type="text" 
                name="department" 
                placeholder="Departamento o Región" 
                value={filters.department} 
                onChange={handleChange}
              />
            </div>

            <div className="search-field">
              <label>Ciudad</label>
              <input 
                type="text" 
                name="district" 
                placeholder="Distrito específico" 
                value={filters.district} 
                onChange={handleChange}
              />
            </div>

            <div className="search-field">
              <label>Tipo</label>
              <select name="type" value={filters.type} onChange={handleChange}>
                <option value="">Cualquier tipo</option>
                <option value="Casa">Casa</option>
                <option value="Departamento">Departamento</option>
                <option value="Terreno">Terreno</option>
                <option value="Oficina">Oficina</option>
                <option value="Cochera">Cochera</option>
              </select>
            </div>

            <div className="search-field">
              <label>Precio (USD/PEN)</label>
              <div className="price-inputs">
                <input 
                  type="number" 
                  name="minPrice" 
                  placeholder="Min" 
                  value={filters.minPrice} 
                  onChange={handleChange}
                />
                <span>-</span>
                <input 
                  type="number" 
                  name="maxPrice" 
                  placeholder="Max" 
                  value={filters.maxPrice} 
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="search-btn" aria-label="Buscar propiedades">
              <Search size={22} strokeWidth={2.5} />
            </button>
            
          </form>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
