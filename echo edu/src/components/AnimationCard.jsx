import React from 'react';
import styles from './AnimationCard.module.css';

export default function AnimationCard({ item }) {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.card}>
      <div className={styles.thumbnailContainer}>
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} className={styles.thumbnail} />
        ) : item.url && item.url.includes('.html') ? (
          <div className={styles.iframeWrapper}>
            <iframe src={item.url} title={item.title} className={styles.iframePreview} tabIndex="-1" />
            <div className={styles.iframeOverlay}></div>
          </div>
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <span className="material-symbols-outlined">play_circle</span>
          </div>
        )}
        <div className={styles.tagContainer}>
          {item.tags?.map((tag, idx) => (
            <span key={idx} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.description}>{item.description}</p>
      </div>
    </a>
  );
}
