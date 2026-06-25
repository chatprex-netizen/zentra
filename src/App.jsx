import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import SearchSection from './components/SearchSection';
import PopularProperties from './components/PopularProperties';
import AboutUs from './components/AboutUs';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { getProperties, getBrandSettings } from './data/db';
import './App.css';

function App() {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Load brand settings
      const brandData = await getBrandSettings();
      setBrand(brandData);
      
      // Apply Primary Color
      if (brandData.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', brandData.primaryColor);
      }
      
      // Apply Favicon
      if (brandData.faviconUrl) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = brandData.faviconUrl;
      }

      // Load properties from DB
      const propsFromDb = await getProperties();
      setAllProperties(propsFromDb);

      const popularFirst = [...propsFromDb]
        .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
        .slice(0, 6);
      setFilteredProperties(popularFirst);
    };

    fetchData();
  }, []);

  // Handle hash scrolling on mount
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleSearch = (filters) => {
    const hasActiveFilters = Object.values(filters).some(val => val !== '');
    setIsSearchActive(hasActiveFilters);

    let result = allProperties;

    if (hasActiveFilters) {
      if (filters.department) {
        result = result.filter(p => p.department === filters.department);
      }
      if (filters.province) {
        result = result.filter(p => p.province === filters.province);
      }
      if (filters.district) {
        result = result.filter(p => p.district === filters.district);
      }
      if (filters.type) {
        result = result.filter(p => p.type === filters.type);
      }
      if (filters.minPrice) {
        result = result.filter(p => p.price >= parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        result = result.filter(p => p.price <= parseInt(filters.maxPrice));
      }
    } else {
      // Si presiona buscar sin filtros, volvemos al estado inicial (solo 6 destacadas)
      result = [...allProperties]
        .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
        .slice(0, 6);
    }

    setFilteredProperties(result);
    
    // Scroll to properties section
    document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-wrapper">
      <Header brand={brand} />
      <main>
        <HeroSlider />
        <SearchSection onSearch={handleSearch} />
        <PopularProperties properties={filteredProperties} isSearchActive={isSearchActive} />
        <AboutUs />
        <ContactForm />
      </main>
      <Footer brand={brand} />
    </div>
  );
}

export default App;
