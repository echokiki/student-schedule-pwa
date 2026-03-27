import React from 'react';
import styles from './Header.module.css';

export default function Header({ onUploadClick }) {
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <header className={styles.header}>
      <div className={styles.searchBar}>
        <span className="material-symbols-outlined">search</span>
        <input 
          type="text" 
          placeholder="搜索教学资源、动画、工具..." 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className={styles.headerRight}>
        <button className={styles.uploadBtn} onClick={onUploadClick}>
          <span className="material-symbols-outlined">add</span>
          上传新建
        </button>
        <button className={styles.actionBtn}>
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className={styles.userProfile}>
          <span className="material-symbols-outlined">person</span>
        </div>
      </div>
    </header>
  );
}
