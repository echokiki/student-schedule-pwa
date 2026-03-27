import React from 'react';
import styles from './ToolCard.module.css';

export default function ToolCard({ item }) {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.card}>
      <div className={styles.iconWrapper}>
        <span className="material-symbols-outlined">api</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.description}>{item.description}</p>
      </div>
    </a>
  );
}
