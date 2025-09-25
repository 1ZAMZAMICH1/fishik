// src/components/admin/EditMap.jsx

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { updateData } from '../../services/gistService';

const EditMap = () => {
  const { appData, setAppData } = useData();
  const [status, setStatus] = useState('idle');
  const [editingItem, setEditingItem] = useState(null);
  
  const initialFormData = {
    id: '', name: '', center: '', zoom: '', pitch: '', bearing: '', name_en: '', bbox: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Функция для преобразования данных перед сохранением
  const processDataForSave = (data) => {
    const processed = { ...data };
    
    // --- ГЛАВНОЕ ИСПРАВЛЕНИЕ ---
    // 1. Пользователь вставляет "ШИРОТА, ДОЛГОТА" как есть.
    const coords = data.center.split(',').map(s => parseFloat(s.trim()));
    // 2. Мы МЕНЯЕМ ИХ МЕСТАМИ в [долгота, широта] для Mapbox.
    processed.center = [coords[1], coords[0]]; 
    // ---------------------------

    processed.zoom = parseFloat(data.zoom);
    processed.pitch = parseFloat(data.pitch);
    processed.bearing = parseFloat(data.bearing);
    
    if (data.bbox && data.bbox.trim() !== '') {
      processed.bbox = data.bbox.trim();
    } else {
      delete processed.bbox;
    }
    return processed;
  };

  const handleSave = async (isNew) => {
    setStatus('saving');
    const locationsArray = appData.atlasLocationsData || [];
    let updatedLocationsArray;
    
    const processedData = processDataForSave(formData);

    if (isNew) {
      if (locationsArray.some(loc => loc.id === processedData.id)) {
        alert('Ошибка: Локация с таким ID уже существует. Придумайте другой.');
        setStatus('idle');
        return;
      }
      updatedLocationsArray = [...locationsArray, processedData];
    } else {
      updatedLocationsArray = locationsArray.map(loc => loc.id === editingItem.id ? processedData : loc);
    }

    const updatedData = { ...appData, atlasLocationsData: updatedLocationsArray };

    try {
      await updateData(updatedData);
      setAppData(updatedData);
      setStatus('idle');
      setEditingItem(null);
      setFormData(initialFormData);
      alert(isNew ? 'Новая точка успешно добавлена!' : 'Данные точки успешно обновлены!');
    } catch (error) {
      setStatus('idle');
      alert(`Ошибка сохранения: ${error.message}`);
    }
  };
  
  const handleEditClick = (item) => {
    setEditingItem(item);
    const formReadyData = { ...initialFormData, ...item };
    
    // --- ИСПРАВЛЕНИЕ ОТОБРАЖЕНИЯ ---
    // При редактировании мы снова меняем [долгота, широта] на "широта, долгота" для удобства.
    formReadyData.center = [item.center[1], item.center[0]].join(', ');
    // ---------------------------

    if (item.bbox) {
      formReadyData.bbox = item.bbox;
    }
    setFormData(formReadyData);
  };

  const handleDelete = async (idToDelete) => {
    if (window.confirm('Вы уверены, что хотите удалить эту точку с карты?')) {
      setStatus('saving');
      const updatedLocationsArray = appData.atlasLocationsData.filter(loc => loc.id !== idToDelete);
      const updatedData = { ...appData, atlasLocationsData: updatedLocationsArray };
      try {
        await updateData(updatedData);
        setAppData(updatedData);
        setStatus('idle');
        alert('Точка успешно удалена!');
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
    .form-group small { color: #9ca3af; font-size: 12px; }
    .form-input { width: 100%; box-sizing: border-box; padding: 12px 15px; border: 1px solid #E5E7EB; border-radius: 6px; font-family: 'Montserrat', sans-serif; font-size: 16px; }
    .save-button { margin-top: 25px; padding: 12px 25px; background-color: #F2994A; color: #1A2E40; border: none; border-radius: 6px; font-size: 16px; font-weight: 700; cursor: pointer; }
    .existing-data-container { background-color: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .data-item { display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
    .data-item strong { color: #1A2E40; font-weight: 700; }
    .item-actions { display: flex; gap: 10px; }
    .action-btn { padding: 8px 15px; font-size: 14px; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; }
    .action-btn.edit { background: #1A2E40; color: #fff; }
    .action-btn.delete { background: #F44336; color: #fff; }
  `;

  if (!appData) return <div>Загрузка...</div>;
  
  const locationsArray = appData.atlasLocationsData || [];
  
  const formFields = [
    { name: 'id', label: 'ID (уникальный, латиницей)', hint: 'Напр: shardara_dam' },
    { name: 'name', label: 'Название на русском', hint: 'Напр: Шардаринское вдхр.' },
    { name: 'name_en', label: 'Название на английском (для подсветки)', hint: 'Напр: Shardara Reservoir' },
    // --- ИЗМЕНЕНИЕ ПОДСКАЗОК ---
    { name: 'center', label: 'Центр карты (широта, долгота)', hint: 'Просто копируйте как есть из Google/Яндекс Карт' },
    { name: 'zoom', label: 'Приближение (zoom)', hint: 'Напр: 9.5' },
    { name: 'pitch', label: 'Угол наклона (pitch)', hint: 'Напр: 60' },
    { name: 'bearing', label: 'Поворот (bearing)', hint: 'Напр: -30' },
    { name: 'bbox', label: 'Область для рек (bbox, необязательно)', hint: 'Напр: 67.8, 41.8, 68.5, 43.5' },
  ];
  
  return (
    <div className="edit-page-container">
      <style>{styles}</style>
      <h1 className="page-title">Управление точками на карте</h1>
      
      <div className="form-container">
        <h3>{editingItem ? 'Редактировать точку' : 'Добавить новую точку'}</h3>
        <div className="form-grid">
          {formFields.map(field => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              <input className="form-input" type="text" name={field.name} value={formData[field.name]} onChange={handleInputChange} disabled={editingItem && field.name === 'id'} />
              <small>{field.hint}</small>
            </div>
          ))}
        </div>
        <button className="save-button" onClick={() => handleSave(!editingItem)} disabled={status === 'saving'}>
          {status === 'saving' ? 'Сохранение...' : (editingItem ? 'Сохранить изменения' : 'Добавить точку')}
        </button>
        {editingItem && <button style={{marginLeft: '10px'}} onClick={() => { setEditingItem(null); setFormData(initialFormData); }}>Отмена</button>}
      </div>

      <div className="existing-data-container">
        <h3>Существующие точки ({locationsArray.length} шт.)</h3>
        <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {locationsArray.map(loc => (
            <li key={loc.id} className="data-item">
              <strong>{loc.name}</strong>
              <div className="item-actions">
                <button className="action-btn edit" onClick={() => handleEditClick(loc)}>Редактировать</button>
                <button className="action-btn delete" onClick={() => handleDelete(loc.id)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditMap;