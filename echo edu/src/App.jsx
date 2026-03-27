import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CardGrid from './components/CardGrid';
import UploadModal from './components/UploadModal';
import siteData from './data/content.json';
import styles from './App.module.css';

function App() {
  const [activeCategory, setActiveCategory] = useState(siteData.categories[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle smooth scrolling when a category is selected
  const handleSelectCategory = (id) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 85; // Height of header + gap
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Intersection Observer to update active category on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    
    siteData.categories.forEach(cat => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.appContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar 
          categories={siteData.categories} 
          activeCategory={activeCategory} 
          onSelectCategory={handleSelectCategory} 
        />
      </div>
      <div className={styles.mainContent}>
        <Header onUploadClick={() => setIsModalOpen(true)} />
        <main className={styles.pageContent}>
          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>{siteData.siteName}</h1>
            <p className={styles.heroDesc}>{siteData.siteDescription}</p>
          </div>
          
          {siteData.categories.map(category => (
            <CardGrid key={category.id} category={category} />
          ))}
        </main>
      </div>
      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
