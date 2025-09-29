// src/components/admin/EditModals.jsx

import React, { useState, useRef } from 'react'; // <-- ДОБАВЛЕНО useRef
import { useData } from '../../context/DataContext';
import { updateData } from '../../services/gistService';

const EditModals = () => {
  const { appData, setAppData } = useData();
  const [status, setStatus] = useState('idle');
  const [editingItem, setEditingItem] = useState(null);
  const fishTextareaRef = useRef(null); // <-- ДОБАВЛЕН ref для textarea
  
  const initialFormData = {
    title: '', tagline: '', cardTitle: '', description: '', image: '',
    lat: '', lon: '', 
    fish: `--Рыба--
Название: Щука
Фото: https://example.com/shuka.png
Снасти: Спиннинг, воблеры, блесны
Наживка: Живец (карась, плотва)
Клев: Утро, вечер
#СЕЗОН
Лучшие месяцы: 5, 6, 9, 10
Хорошие месяцы: 4, 8
Нормальные месяцы: 3, 11
#ПОГОДА (предпочтения рыбы)
Температура: 12-18
Давление: падает, стабильное
Погода: пасмурно, дождь
Время: утро/вечер
Ветер до: 10`,
    cardPosition: 'center', mapEmbedCode: '',
    waterLevel: '', 
    waterLevelDynamics: '', 
    waterLevelUpdate: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const parseFishData = (fishString) => {
    if (!fishString || typeof fishString !== 'string') return [];
    const fishBlocks = fishString.split('--Рыба--').filter(block => block.trim() !== '');
    
    return fishBlocks.map(block => {
      const fishObject = { preferences: {} };
      const lines = block.trim().split('\n');
      
      lines.forEach(line => {
        if (line.startsWith('#')) return;
        const parts = line.split(':');
        const key = parts[0]?.trim();
        const value = parts.slice(1).join(':').trim();
        if (!key || !value) return;

        const valueArr = value.split(',').map(s => s.trim().toLowerCase());

        switch (key) {
          case 'Название': fishObject.name = value; break;
          case 'Фото': fishObject.image = value; break;
          case 'Снасти': fishObject.tackle = value; break;
          case 'Наживка': fishObject.bait = value; break;
          case 'Клев': fishObject.bitingTime = value; break;
          case 'Лучшие месяцы': fishObject.bestMonths = value.split(',').map(s => parseInt(s.trim(), 10) - 1).filter(n => !isNaN(n)); break;
          case 'Хорошие месяцы': fishObject.goodMonths = value.split(',').map(s => parseInt(s.trim(), 10) - 1).filter(n => !isNaN(n)); break;
          case 'Нормальные месяцы': fishObject.normalMonths = value.split(',').map(s => parseInt(s.trim(), 10) - 1).filter(n => !isNaN(n)); break;
          case 'Температура':
            const temps = value.split('-').map(s => parseInt(s.trim(), 10));
            if (temps.length === 2) fishObject.preferences.temp = { min: temps[0], max: temps[1] };
            break;
          case 'Давление': fishObject.preferences.pressure = valueArr; break;
          case 'Погода': fishObject.preferences.weather = valueArr; break;
          case 'Время': fishObject.preferences.time = valueArr; break;
          case 'Ветер до': fishObject.preferences.wind = parseInt(value, 10); break;
          default: break;
        }
      });
      return fishObject;
    }).filter(fish => fish.name && fish.image);
  };
  
  const formatFishDataForEdit = (fishArray) => {
    if (!fishArray || !Array.isArray(fishArray)) return '';
    return fishArray.map(fish => {
      const prefs = fish.preferences || {};
      const formatMonths = (months) => (months || []).map(m => m + 1).join(', ');
      return `
--Рыба--
Название: ${fish.name || ''}
Фото: ${fish.image || ''}
Снасти: ${fish.tackle || ''}
Наживка: ${fish.bait || ''}
Клев: ${fish.bitingTime || ''}
#СЕЗОН
Лучшие месяцы: ${formatMonths(fish.bestMonths)}
Хорошие месяцы: ${formatMonths(fish.goodMonths)}
Нормальные месяцы: ${formatMonths(fish.normalMonths)}
#ПОГОДА (предпочтения рыбы)
Температура: ${prefs.temp ? `${prefs.temp.min}-${prefs.temp.max}` : ''}
Давление: ${(prefs.pressure || []).join(', ')}
Погода: ${(prefs.weather || []).join(', ')}
Время: ${(prefs.time || []).join(', ')}
Ветер до: ${prefs.wind || ''}
      `.trim();
    }).join('\n\n');
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

  // --- НОВАЯ ФУНКЦИЯ ДЛЯ ВСТАВКИ ТЕКСТА ---
  const insertText = (textToInsert) => {
    const textarea = fishTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    
    // Проверяем, есть ли уже текст и нужно ли добавить запятую
    const textBeforeCursor = currentText.substring(0, start);
    const lastChar = textBeforeCursor.trim().slice(-1);
    const prefix = (lastChar && lastChar !== ':' && lastChar !== '\n') ? ', ' : '';

    const newText = currentText.substring(0, start) + prefix + textToInsert + currentText.substring(end);
    
    setFormData(prev => ({ ...prev, fish: newText }));

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + prefix.length + textToInsert.length;
    }, 0);
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
    .form-textarea { min-height: 300px; resize: vertical; font-family: 'Courier New', Courier, monospace; }
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
    
    /* --- НОВЫЕ СТИЛИ ДЛЯ КНОПОК-ПОДСКАЗОК --- */
    .quick-buttons-container { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e5e7eb; }
    .quick-buttons-group { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .quick-buttons-group strong { font-size: 13px; color: #4B5563; margin-right: 5px; }
    .quick-btn { background: #e9ecef; border: 1px solid #dee2e6; color: #495057; padding: 5px 10px; font-size: 13px; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; }
    .quick-btn:hover { background: #ced4da; }
  `;

  if (!appData) return <div className="status-message">Загрузка данных локаций...</div>;
  
  const locationsArray = appData.locationsData || [];
  
  const formFields = [
    { name: 'title', label: 'Полное название', type: 'text' }, { name: 'cardTitle', label: 'Название на карточке', type: 'text' },
    { name: 'tagline', label: 'Слоган (желтый текст)', type: 'text' }, { name: 'image', label: 'Ссылка (URL) на фото', type: 'text' },
    { name: 'lat', label: 'Широта (для погоды)', type: 'text' }, { name: 'lon', label: 'Долгота (для погоды)', type: 'text' },
    { name: 'waterLevel', label: 'Уровень воды (например, 280 см)', type: 'text' },
    { name: 'waterLevelDynamics', label: 'Динамика (например, +5 см/сутки)', type: 'text' },
    { name: 'waterLevelUpdate', label: 'Дата обновления данных', type: 'text' },
    { name: 'cardPosition', label: 'Позиция фото на карточке', type: 'text' },
    { name: 'description', label: 'Описание', type: 'textarea' },
    { name: 'fish', label: 'Рыбы и их предпочтения (см. пример)', type: 'textarea' },
    { name: 'mapEmbedCode', label: 'HTML-код для вставки карты', type: 'textarea' },
  ];
  
  const editForm = (
    <div className="form-container">
        <h3>{editingItem ? 'Редактировать локацию' : 'Добавить новую локацию'}</h3>
        <div className="form-grid">
          {formFields.map(field => (
            <div className={`form-group ${field.type === 'textarea' ? 'full-width' : ''}`} key={field.name}>
              <label>{field.label}</label>
              {/* --- ИЗМЕНЕНИЕ: ДОБАВЛЯЕМ КНОПКИ ТОЛЬКО ДЛЯ ПОЛЯ 'fish' --- */}
              {field.name === 'fish' ? (
                <>
                  <textarea ref={fishTextareaRef} className="form-textarea" name="fish" value={formData.fish} onChange={handleInputChange}></textarea>
                  <div className="quick-buttons-container">
                    <div className="quick-buttons-group">
                      <strong>Давление:</strong>
                      <button type="button" className="quick-btn" onClick={() => insertText('падает')}>падает</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('стабильное')}>стабильное</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('растет')}>растет</button>
                    </div>
                    <div className="quick-buttons-group">
                      <strong>Погода:</strong>
                      <button type="button" className="quick-btn" onClick={() => insertText('ясно')}>ясно</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('облачно')}>облачно</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('пасмурно')}>пасмурно</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('дождь')}>дождь</button>
                    </div>
                    <div className="quick-buttons-group">
                      <strong>Время:</strong>
                      <button type="button" className="quick-btn" onClick={() => insertText('утро/вечер')}>утро/вечер</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('день')}>день</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('ночь')}>ночь</button>
                    </div>
                  </div>
                </>
              ) : field.type === 'textarea' ? (
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