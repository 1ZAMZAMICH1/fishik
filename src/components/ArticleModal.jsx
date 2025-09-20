// src/components/ArticleModal.jsx

import React from 'react';
import { motion } from 'framer-motion';

const ArticleModal = ({ article, onClose }) => {
  const styles = `
    .article-modal-backdrop { 
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.85); z-index: 100; 
      display: flex; justify-content: center; align-items: center; 
    }
    .article-modal-content { 
      background: #fff; width: 90%; max-width: 56.25rem; /* 900px */ 
      height: 90vh; max-height: 43.75rem; /* 700px */ 
      border-radius: 0.5rem; /* 8px */ overflow: hidden; 
      display: flex; flex-direction: column; position: relative; 
    }
    .article-modal-image-container { 
      width: 100%; height: 40%; background-color: #e5e7eb; 
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; 
    }
    .article-modal-image { 
      width: 100%; height: 100%; object-fit: contain; 
    }
    .article-modal-close { 
      position: absolute; top: 0.9375rem; /* 15px */ right: 0.9375rem; /* 15px */ 
      background: rgba(0,0,0,0.5); color: white; border: none; 
      border-radius: 50%; width: 2.5rem; /* 40px */ height: 2.5rem; /* 40px */ 
      font-size: 1.5rem; /* 24px */ cursor: pointer; display: flex; 
      justify-content: center; align-items: center; transition: background 0.3s ease; 
    }
    .article-modal-close:hover { background: #F2994A; }
    .article-modal-body { 
      padding: 2.5rem; /* 40px */ overflow-y: auto; 
      font-family: 'Montserrat', sans-serif; color: #1A2E40; 
    }
    .article-meta { 
      display: flex; align-items: center; gap: 1.25rem; /* 20px */ 
      margin-bottom: 1.5625rem; /* 25px */ font-size: 0.875rem; /* 14px */ 
      color: #6B7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.9375rem; /* 15px */ 
    }
    .article-meta strong { color: #1A2E40; }
    .article-modal-body h2 { 
      font-size: 2.25rem; /* 36px */ font-weight: 900; margin: 0 0 0.9375rem 0; /* 15px */ 
    }
    /* Стили для контента из редактора */
    .article-text-content p { 
      font-size: 1rem; /* 16px */ line-height: 1.8; color: #4B5563; margin-bottom: 1em; 
    }
    .article-text-content img { 
      max-width: 100%; height: auto; border-radius: 0.5rem; /* 8px */ margin: 1.25rem 0; /* 20px */ 
    }
    .article-text-content strong { font-weight: 700; color: #1A2E40; }
    .article-text-content em { font-style: italic; }
  `;

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <>
      <style>{styles}</style>
      <motion.div className="article-modal-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="article-modal-content" onClick={(e) => e.stopPropagation()} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
          <div className="article-modal-image-container">
            <img src={article.image} alt={article.title} className="article-modal-image" />
          </div>
          <button className="article-modal-close" onClick={onClose}>×</button>
          <div className="article-modal-body">
            <h2>{article.title}</h2>
            <div className="article-meta">
              <div>Автор: <strong>{article.author}</strong></div>
              <div>Дата: <strong>{formatDate(article.date)}</strong></div>
            </div>
            <div className="article-text-content" dangerouslySetInnerHTML={{ __html: article.fullText }} />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ArticleModal;