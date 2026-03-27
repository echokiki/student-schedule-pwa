import React, { useState } from 'react';
import styles from './UploadModal.module.css';
import siteData from '../data/content.json';

export default function UploadModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: siteData.categories[0]?.id || '',
    tags: '',
    htmlCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/save-animation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        setFormData({ ...formData, title: '', description: '', tags: '', htmlCode: '' });
        onClose();
        // Since content.json modifies, Vite's native HMR will likely reload the module auto-magically.
        // It's a nice local server perk!
      } else {
        alert("保存失败：" + result.error);
      }
    } catch(err) {
      alert("网络错误，可能是 Vite 服务遇到了问题：" + err.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>上传新卡片动画</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>动画标题</label>
              <input 
                type="text" 
                required 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="例如：万有引力实验"
              />
            </div>
            <div className={styles.formGroup}>
              <label>所属分类</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {siteData.categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>描述</label>
              <input 
                type="text" 
                required 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="一句话简要介绍..."
              />
            </div>
            <div className={styles.formGroup}>
              <label>标签 (逗号分隔)</label>
              <input 
                type="text" 
                value={formData.tags} 
                onChange={e => setFormData({...formData, tags: e.target.value})}
                placeholder="例如：物理, 互动"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>互动 HTML 源码</label>
            <textarea 
              required
              rows="8"
              value={formData.htmlCode} 
              onChange={e => setFormData({...formData, htmlCode: e.target.value})}
              placeholder="在这里粘贴您的完整 HTML 代码（包含 <style> 和 <script> 等）。点击提交后它会自动变成一个供查看的静态动画网页。"
            ></textarea>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSubmitting}>取消</button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? '正在处理部署...' : '确认发布'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
