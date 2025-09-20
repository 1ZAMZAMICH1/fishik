// src/components/admin/EditBanner.jsx

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { updateData } from '../../services/gistService';

const EditBanner = () => {
  const { appData, setAppData } = useData();
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({
    spawning: { title: '', text: '' },
    cleanup: { title: '', text: '' }
  });

  useEffect(() => {
    if (appData && appData.bannerData) {
      setFormData(appData.bannerData);
    }
  }, [appData]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setStatus('saving');
    const updatedData = { ...appData, bannerData: formData };
    try {
      await updateData(updatedData);
      setAppData(updatedData);
      setStatus('idle');
      alert('Информационный баннер успешно обновлен!');
    } catch (error) {
      setStatus('idle');
      alert(`Ошибка обновления: ${error.message}`);
    }
  };
  
  const styles = `
    .edit-page-container { font-family: 'Montserrat', sans-serif; }
    .page-title { font-size: 36px; font-weight: 900; color: #1A2E40; margin: 0 0 40px 0; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
    .form-container { background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .form-container h3 { font-size: 20px; color: #1A2E40; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .form-group label { font-weight: 700; margin-bottom: 8px; color: #4B5563; display: block; font-size: 14px; }
    .form-input, .form-textarea { width: 100%; box-sizing: border-box; padding: 12px 15px; border: 1px solid #E5E7EB; border-radius: 6px; font-family: 'Montserrat', sans-serif; font-size: 16px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .form-input:focus, .form-textarea:focus { outline: none; border-color: #F2994A; box-shadow: 0 0 0 3px rgba(242, 153, 74, 0.2); }
    .form-textarea { min-height: 120px; resize: vertical; }
    .save-button-container { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 30px; }
    .save-button { padding: 12px 25px; background-color: #F2994A; color: #1A2E40; border: none; border-radius: 6px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; }
    .save-button:hover { background-color: #e88c3a; }
    .save-button:disabled { background-color: #ccc; cursor: not-allowed; }
    .status-message { font-size: 18px; font-weight: 700; color: #6B7280; }
  `;
  
  if (!appData) return <div className="status-message">Загрузка данных...</div>;

  return (
    <div className="edit-page-container">
      <style>{styles}</style>
      <h1 className="page-title">Редактирование Инфо-баннера</h1>
      <div className="form-container">
        <div className="form-grid">
          <div>
            <h3>Блок "Нерестовый Запрет"</h3>
            <div className="form-group">
              <label>Заголовок</label>
              <input className="form-input" type="text" value={formData.spawning.title} onChange={(e) => handleInputChange('spawning', 'title', e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Текст</label>
              <textarea className="form-textarea" value={formData.spawning.text} onChange={(e) => handleInputChange('spawning', 'text', e.target.value)}></textarea>
            </div>
          </div>
          <div>
            <h3>Блок "Сохраняйте Чистоту"</h3>
            <div className="form-group">
              <label>Заголовок</label>
              <input className="form-input" type="text" value={formData.cleanup.title} onChange={(e) => handleInputChange('cleanup', 'title', e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Текст</label>
              <textarea className="form-textarea" value={formData.cleanup.text} onChange={(e) => handleInputChange('cleanup', 'text', e.target.value)}></textarea>
            </div>
          </div>
        </div>
        <div className="save-button-container">
          <button className="save-button" onClick={handleSave} disabled={status === 'saving'}>
            {status === 'saving' ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBanner;