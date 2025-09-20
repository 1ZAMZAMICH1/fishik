// src/components/admin/EditArticles.jsx

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { updateData } from '../../services/gistService';
// --- ИМПОРТИРУЕМ НОВЫЙ РЕДАКТОР ---
import { Editor } from '@tinymce/tinymce-react';

const EditArticles = () => {
  const { appData, setAppData } = useData();
  const [status, setStatus] = useState('idle');
  const [editingItem, setEditingItem] = useState(null);
  
  const initialFormData = {
    category: '', title: '', preview: '', fullText: '', image: '', author: '', date: new Date().toISOString().split('T')[0]
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработчик для TinyMCE
  const handleEditorChange = (content, editor) => {
    setFormData(prev => ({ ...prev, fullText: content }));
  };

  const handleSave = async (isNew) => {
    // ... логика сохранения остается ТОЧНО ТАКОЙ ЖЕ ...
    setStatus('saving');
    const articlesArray = appData.articlesData || [];
    let updatedArray;
    const currentData = editingItem ? { ...editingItem, ...formData } : formData;
    if (isNew) {
      const newId = articlesArray.length > 0 ? Math.max(...articlesArray.map(a => a.id)) + 1 : 1;
      updatedArray = [...articlesArray, { id: newId, ...currentData }];
    } else {
      updatedArray = articlesArray.map(item => item.id === editingItem.id ? currentData : item);
    }
    const updatedData = { ...appData, articlesData: updatedArray };
    try {
      await updateData(updatedData);
      setAppData(updatedData);
      setStatus('idle');
      if (isNew) {
        setFormData(initialFormData);
        alert('Новая статья успешно добавлена!');
      } else {
        setEditingItem(null);
        setFormData(initialFormData);
        alert('Статья успешно обновлена!');
      }
    } catch (error) {
      setStatus('idle');
      alert(`Ошибка сохранения: ${error.message}`);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData(item);
  };
  
  const handleDelete = async (idToDelete) => {
    // ... логика удаления остается ТОЧНО ТАКОЙ ЖЕ ...
    if(window.confirm('Вы уверены?')) {
        setStatus('saving');
        const updatedArray = appData.articlesData.filter(item => item.id !== idToDelete);
        const updatedData = { ...appData, articlesData: updatedArray };
        try {
            await updateData(updatedData);
            setAppData(updatedData);
            setStatus('idle');
            alert('Статья удалена!');
        } catch (error) {
            setStatus('idle');
            alert(`Ошибка: ${error.message}`);
        }
    }
  };
  
  const styles = `
    .edit-page-container { font-family: 'Montserrat', sans-serif; }
    .page-title { font-size: 36px; font-weight: 900; color: #1A2E40; margin: 0 0 40px 0; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
    .form-container { background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 50px; }
    .form-container h3 { font-size: 24px; color: #1A2E40; margin: 0 0 25px 0; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .full-width { grid-column: 1 / -1; }
    .form-group label { font-weight: 700; margin-bottom: 8px; color: #4B5563; display: block; font-size: 14px; }
    .form-input, .form-textarea { width: 100%; box-sizing: border-box; padding: 12px 15px; border: 1px solid #E5E7EB; border-radius: 6px; font-family: 'Montserrat', sans-serif; font-size: 16px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .form-input:focus, .form-textarea:focus { outline: none; border-color: #F2994A; box-shadow: 0 0 0 3px rgba(242, 153, 74, 0.2); }
    .form-textarea { min-height: 120px; resize: vertical; }
    .save-button { margin-top: 25px; padding: 12px 25px; background-color: #F2994A; color: #1A2E40; border: none; border-radius: 6px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; }
    .save-button:hover { background-color: #e88c3a; }
    .save-button:disabled { background-color: #ccc; cursor: not-allowed; }
    .existing-data-container { background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .existing-data-container h3 { font-size: 24px; color: #1A2E40; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb; }
    .data-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    .data-item { display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
    .data-item strong { color: #1A2E40; font-weight: 700; }
    .item-actions { display: flex; gap: 10px; }
    .action-btn { padding: 8px 15px; font-size: 14px; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; transition: opacity 0.2s ease; }
    .action-btn.edit { background: #1A2E40; color: #fff; }
    .action-btn.delete { background: #F44336; color: #fff; }
    .action-btn:hover { opacity: 0.8; }
  `;
  
  if (!appData) return <div className="status-message">Загрузка данных...</div>;
  const articlesArray = appData.articlesData || [];

  const editForm = (
    <div className="form-container">
      <h3>{editingItem ? 'Редактировать статью' : 'Добавить новую статью'}</h3>
      <div className="form-grid">
        <div className="form-group"><label>Заголовок</label><input className="form-input" type="text" name="title" value={formData.title} onChange={handleInputChange}/></div>
        <div className="form-group"><label>Категория</label><input className="form-input" type="text" name="category" value={formData.category} onChange={handleInputChange}/></div>
        <div className="form-group"><label>Автор</label><input className="form-input" type="text" name="author" value={formData.author} onChange={handleInputChange}/></div>
        <div className="form-group"><label>Дата (ГГГГ-ММ-ДД)</label><input className="form-input" type="date" name="date" value={formData.date} onChange={handleInputChange}/></div>
        <div className="form-group full-width"><label>Ссылка (URL) на заглавное фото</label><input className="form-input" type="text" name="image" value={formData.image} onChange={handleInputChange}/></div>
        <div className="form-group full-width"><label>Превью (короткий текст для карточки)</label><textarea className="form-textarea" name="preview" value={formData.preview} onChange={handleInputChange}></textarea></div>
        
        <div className="form-group full-width">
          <label>Полный текст статьи</label>
          <Editor
            apiKey='soyl5samoxjhzv8xfgw0pm603qgxhtgoizlqsmge1bt55zhs' // <-- ВСТАВЬ СЮДА СВОЙ КЛЮЧ
            value={formData.fullText}
            onEditorChange={handleEditorChange}
            init={{
              height: 400,
              menubar: false,
              plugins: [ 'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount' ],
              toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image link | help',
              content_style: 'body { font-family:Montserrat,sans-serif; font-size:16px } img { max-width: 100%; height: auto; border-radius: 8px; }',
              images_upload_handler: () => Promise.resolve(''), // Простая заглушка, чтобы убрать ворнинг
              automatic_uploads: false,
            }}
          />
        </div>
      </div>
      <button className="save-button" onClick={() => handleSave(!editingItem)} disabled={status === 'saving'}>{status === 'saving' ? 'Сохранение...' : (editingItem ? 'Сохранить изменения' : 'Добавить статью')}</button>
      {editingItem && <button style={{marginLeft: '10px'}} onClick={() => { setEditingItem(null); setFormData(initialFormData); }}>Отмена</button>}
    </div>
  );
  
  return (
    <div className="edit-page-container">
      <style>{styles}</style>
      <h1 className="page-title">Управление Статьями</h1>
      {editForm}
      <div className="existing-data-container">
        <h3>Существующие статьи ({articlesArray.length} шт.)</h3>
        <ul className="data-list">
          {articlesArray.map(item => (
            <li key={item.id} className="data-item">
              <strong>{item.title}</strong>
              <div className="item-actions">
                <button className="action-btn edit" onClick={() => handleEditClick(item)}>Редактировать</button>
                <button className="action-btn delete" onClick={() => handleDelete(item.id)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditArticles;