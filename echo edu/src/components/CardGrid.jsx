import React from 'react';
import styles from './CardGrid.module.css';
import AnimationCard from './AnimationCard';
import ToolCard from './ToolCard';

export default function CardGrid({ category }) {
  if (!category || !category.items || category.items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className="material-symbols-outlined">inbox</span>
        <p>暂无内容</p>
      </div>
    );
  }

  // Determine layout style: If the first item has a thumbnail, use vertical AnimationCard layout
  const hasThumbnails = category.items.some(item => item.thumbnail);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle} id={category.id}>{category.title}</h2>
      <div className={hasThumbnails ? styles.animationGrid : styles.toolGrid}>
        {category.items.map((item, idx) => (
          hasThumbnails 
            ? <AnimationCard key={idx} item={item} />
            : <ToolCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}
