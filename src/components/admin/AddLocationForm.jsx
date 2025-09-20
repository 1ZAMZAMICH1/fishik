// src/components/admin/AddLocationForm.jsx

import React, { useState } from 'react';

const AddLocationForm = ({ onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    tagline: '',
    title: '',
    description: '',
    image: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.tagline || !formData.title || !formData.description || !formData.image) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }
    const success = await onSave(formData);
    if (success) {
      setFormData({ tagline: '', title: '', description: '', image: '' });
      alert("Локация успешно добавлена!");
    }
  };

  const styles = `
    .add-location-form {
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .add-location-form h3 {
      font-size: 24px;
      color: #1A2E40;
      margin: 0 0 25px 0;
      padding-bottom: 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    .add-location-form .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .add-location-form .full-width {
      grid-column: 1 / -1;
    }
    .add-location-form .form-group label {
      font-weight: 700;
      margin-bottom: 8px;
      color: #4B5563;
      display: block;
      font-size: 14px;
    }
    .add-location-form .form-input,
    .add-location-form .form-textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 15px;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      font-family: 'Montserrat', sans-serif;
      font-size: 16px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .add-location-form .form-input:focus,
    .add-location-form .form-textarea:focus {
      outline: none;
      border-color: #F2994A;
      box-shadow: 0 0 0 3px rgba(242, 153, 74, 0.2);
    }
    .add-location-form .form-textarea {
      min-height: 120px;
      resize: vertical;
    }
    .add-location-form .save-button {
      margin-top: 25px;
      padding: 12px 25px;
      background-color: #F2994A;
      color: #1A2E40;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .add-location-form .save-button:hover {
      background-color: #e88c3a;
    }
    .add-location-form .save-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `;
  
  return (
    <div className="add-location-form">
      <style>{styles}</style>
      <h3>Добавить новую локацию</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Заголовок (tagline)</label>
          <input className="form-input" type="text" name="tagline" value={formData.tagline} onChange={handleInputChange} placeholder="напр. ГЛАВНАЯ АРТЕРИЯ РЕГИОНА" />
        </div>
        <div className="form-group">
          <label>Основной заголовок</label>
          <input className="form-input" type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="напр. РЕКА СЫРДАРЬЯ" />
        </div>
        <div className="form-group full-width">
          <label>Описание</label>
          <textarea className="form-textarea" name="description" value={formData.description} onChange={handleInputChange} placeholder="Краткое описание локации..."></textarea>
        </div>
        <div className="form-group full-width">
          <label>Ссылка (URL) на фото</label>
          <input className="form-input" type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/photo.jpg" />
        </div>
      </div>
      <button className="save-button" onClick={handleSubmit} disabled={isSaving}>
        {isSaving ? 'Добавление...' : 'Добавить локацию'}
      </button>
    </div>
  );
};

export default AddLocationForm;