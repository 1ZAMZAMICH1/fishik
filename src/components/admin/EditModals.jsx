// src/components/admin/EditModals.jsx

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { updateData } from '../../services/gistService';

const EditModals = () => {
  const { appData, setAppData } = useData();
  const [status, setStatus] = useState('idle');
  const [editingItem, setEditingItem] = useState(null);
  
  const initialFormData = {
    title: '', tagline: '', cardTitle: '', description: '', image: '',
    lat: '', lon: '', fish: 'Название1, ссылка1.png\nНазвание2, ссылка2.png',
    cardPosition: 'center', mapEmbedCode: '',
    // --- ИЗМЕНЕННЫЕ ПОЛЯ ---
    waterLevel: '', 
    waterLevelDynamics: '', 
    waterLevelUpdate: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  // ... (остальные функции остаются без изменений) ...
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const parseFishData = (fishString) => {
    if (!fishString || typeof fishString !== 'string') return [];
    return fishString.split('\n').map(line => line.trim()).filter(line => line).map(line => {
      const parts = line.split(',');
      return { name: parts[0]?.trim(), image: parts[1]?.trim() };
    }).filter(fish => fish.name && fish.image);
  };
  
  const formatFishDataForEdit = (fishArray) => {
    if (!fishArray || !Array.isArray(fishArray)) return '';
    return fishArray.map(fish => `${fish.name}, ${fish.image}`).join('\n');
  };

  const handleSave = async (isNew) => {
    setStatus('saving');
    const locationsArray = appData.locationsData || [];
    let updatedLocationsArray;
    
    const currentData = editingItem ? { ...editingItem, ...formData } : formData;
    const processedData = { ...currentData, fish: parseFishData(currentData.fish), };

    if (isNew) {
      const newId = locationsArray.length > 0 ? Math.max(...locationsArray.map(loc => loc.id)) + 1 : 1;
      updatedLocationsArray = [...locationsArray, { id: newId, ...processedData }];
    } else {
      updatedLocationsArray = locationsArray.map(loc => loc.id === editingItem.id ? processedData : loc);
    }

    const updatedData = { ...appData, locationsData: updatedLocationsArray };

    try {
      await updateData(updatedData);
      setAppData(updatedData);
      setStatus('idle');
      if (isNew) {
        setFormData(initialFormData);
        alert('Новая локация успешно добавлена!');
      } else {
        setEditingItem(null);
        setFormData(initialFormData);
        alert('Данные о локации успешно обновлены!');
      }
    } catch (error) {
      setStatus('idle');
      alert(`Ошибка сохранения: ${error.message}`);
    }
  };
  
  const handleEditClick = (item) => {
    setEditingItem(item);
    // Важно: обеспечиваем, чтобы все поля были в форме, даже если их нет в старых данных
    setFormData({ ...initialFormData, ...item, fish: formatFishDataForEdit(item.fish) });
  };

  const handleDeleteLocation = async (idToDelete) => {
    if (window.confirm('Вы уверены, что хотите удалить эту локацию?')) {
      setStatus('saving');
      const updatedLocationsArray = appData.locationsData.filter(loc => loc.id !== idToDelete);
      const updatedData = { ...appData, locationsData: updatedLocationsArray };
      try {
        await updateData(updatedData);
        setAppData(updatedData);
        setStatus('idle');
        alert('Локация успешно удалена!');
      } catch (error) {
        setStatus('idle');
        alert(`Ошибка удаления: ${error.message}`);
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
    .existing-data-container { background-color: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .existing-data-container h3 { font-size: 24px; color: #1A2E40; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb; }
    .data-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    .data-item { display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
    .data-item strong { color: #1A2E40; font-weight: 700; }
    .item-actions { display: flex; gap: 10px; }
    .action-btn { padding: 8px 15px; font-size: 14px; border: none; border-radius: 6px; cursor: pointer; transition: opacity 0.2s ease; font-weight: 700; }
    .action-btn.edit { background: #1A2E40; color: #fff; }
    .action-btn.delete { background: #F44336; color: #fff; }
    .action-btn:hover { opacity: 0.8; }
    .status-message { font-size: 18px; font-weight: 700; color: #6B7280; }
  `;

  if (!appData) return <div className="status-message">Загрузка данных локаций...</div>;
  
  const locationsArray = appData.locationsData || [];
  
  const formFields = [
    { name: 'title', label: 'Полное название', type: 'text' }, { name: 'cardTitle', label: 'Название на карточке', type: 'text' },
    { name: 'tagline', label: 'Слоган (желтый текст)', type: 'text' }, { name: 'image', label: 'Ссылка (URL) на фото', type: 'text' },
    { name: 'lat', label: 'Широта (для погоды)', type: 'text' }, { name: 'lon', label: 'Долгота (для погоды)', type: 'text' },
    // --- НОВЫЕ ПОЛЯ ДЛЯ УРОВНЯ ВОДЫ ---
    { name: 'waterLevel', label: 'Уровень воды (например, 280 см)', type: 'text' },
    { name: 'waterLevelDynamics', label: 'Динамика (например, +5 см/сутки)', type: 'text' },
    { name: 'waterLevelUpdate', label: 'Дата обновления данных', type: 'text' },
    // ------------------------------------
    { name: 'cardPosition', label: 'Позиция фото на карточке', type: 'text' },
    { name: 'description', label: 'Описание', type: 'textarea' },
    { name: 'fish', label: 'Рыбы (каждая с новой строки, формат: Название, ссылка.png)', type: 'textarea' },
    { name: 'mapEmbedCode', label: 'HTML-код для вставки карты', type: 'textarea' },
  ];
  
  const editForm = (
    <div className="form-container">
        <h3>{editingItem ? 'Редактировать локацию' : 'Добавить новую локацию'}</h3>
        <div className="form-grid">
          {formFields.map(field => (
            <div className={`form-group ${field.type === 'textarea' ? 'full-width' : ''}`} key={field.name}>
              <label>{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea className="form-textarea" name={field.name} value={formData[field.name]} onChange={handleInputChange}></textarea>
              ) : (
                <input className="form-input" type="text" name={field.name} value={formData[field.name]} onChange={handleInputChange} />
              )}
            </div>
          ))}
        </div>
        <button className="save-button" onClick={() => handleSave(!editingItem)} disabled={status === 'saving'}>{status === 'saving' ? 'Сохранение...' : (editingItem ? 'Сохранить изменения' : 'Добавить локацию')}</button>
        {editingItem && <button style={{marginLeft: '10px'}} onClick={() => { setEditingItem(null); setFormData(initialFormData); }}>Отмена</button>}
    </div>
  );

  return (
    <div className="edit-page-container">
      <style>{styles}</style>
      <h1 className="page-title">Управление Локациями (для Модальных окон)</h1>
      {editForm}
      <div className="existing-data-container">
        <h3>Существующие локации ({locationsArray.length} шт.)</h3>
        <ul className="data-list">
          {locationsArray.map(loc => (
            <li key={loc.id} className="data-item">
              <strong>{loc.title.replace('\\n', ' ')}</strong>
              <div className="item-actions">
                <button className="action-btn edit" onClick={() => handleEditClick(loc)}>Редактировать</button>
                <button className="action-btn delete" onClick={() => handleDeleteLocation(loc.id)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditModals;