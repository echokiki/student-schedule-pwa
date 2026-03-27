import React from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({ categories, activeCategory, onSelectCategory }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <span className="material-symbols-outlined">school</span>
        </div>
        <div className={styles.logoTextWrapper}>
          <h1 className={styles.logoText}>Echo导航</h1>
          <span className={styles.logoSubtext}>教育资源集</span>
        </div>
      </div>
      
      <nav className={styles.navigation}>
        {categories.map((cat) => (
          <button 
            key={cat.id}
            className={`${styles.navItem} ${activeCategory === cat.id ? styles.active : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>{cat.icon}</span>
            <span className={styles.navLabel}>{cat.title}</span>
          </button>
        ))}
      </nav>
      
      <div className={styles.bottomSection}>
        <button className={styles.navItem} onClick={() => alert("系统设置面板正在全面重构中！")}>
          <span className={`material-symbols-outlined ${styles.icon}`}>settings</span>
          <span className={styles.navLabel}>系统设置</span>
        </button>
      </div>
    </aside>
  );
}
