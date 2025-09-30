// src/components/admin/EditModals.jsx

import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { updateData } from '../../services/gistService';

// --- ПОЛНАЯ БАЗА ДАННЫХ С ШАБЛОНАМИ ВСЕХ 13 РЫБ ---
const FISH_TEMPLATES = {
  "Сазан": `--Рыба--\nНазвание: Сазан\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759231554/%D1%81%D0%B0%D0%B7%D0%B0%D0%BD_g5um51.png\nСнасти: Карповые или фидерные удилища, донные монтажи\nНаживка: Кукуруза, бойлы, червь, жмых\nКлев: Пики активности ранним утром и поздним вечером\n#СЕЗОН\nЛучшие месяцы: 6, 7, 8\nХорошие месяцы: 5, 9\nНормальные месяцы: 4, 10\n#ПОГОДА (предпочтения рыбы)\nТемпература: 20-28\nДавление: стабильное, падает\nПогода: ясно, облачно\nВремя: утро/вечер, день\nВетер до: 6`,
  "Сом": `--Рыба--\nНазвание: Сом\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759231559/%D1%81%D0%BE%D0%BC_setvfw.png\nСнасти: Мощные донные удилища, квок\nНаживка: Живец, лягушка, пучок червей, печень\nКлев: Преимущественно ночной хищник\n#СЕЗОН\nЛучшие месяцы: 6, 7, 8\nХорошие месяцы: 5, 9\nНормальные месяцы: 4, 10\n#ПОГОДА (предпочтения рыбы)\nТемпература: 18-26\nДавление: падает, стабильное\nПогода: пасмурно, дождь, облачно\nВремя: ночь, вечер\nВетер до: 7`,
  "Судак": `--Рыба--\nНазвание: Судак\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759232177/%D1%81%D1%83%D0%B4%D0%B0%D0%BA_fp4pyv.png\nСнасти: Спиннинг (джиг), донные снасти с живцом\nНаживка: Живец (уклейка, пескарь), силиконовые приманки\nКлев: Сумеречный и ночной хищник\n#СЕЗОН\nЛучшие месяцы: 5, 9, 10\nХорошие месяцы: 4, 6\nНормальные месяцы: 3, 7, 8\n#ПОГОДА (предпочтения рыбы)\nТемпература: 12-20\nДавление: стабильное, растет\nПогода: пасмурно, облачно\nВремя: ночь, вечер, утро/вечер\nВетер до: 8`,
  "Жерех": `--Рыба--\nНазвание: Жерех\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759231555/%D0%B6%D0%B5%D1%80%D0%B5%D1%85_ih1ubn.png\nСнасти: Дальнобойный спиннинг, кастмастеры, пилькеры\nНаживка: Искусственные приманки, имитирующие малька\nКлев: Дневной хищник, охотится 'котлами'\n#СЕЗОН\nЛучшие месяцы: 5, 6, 7, 8\nХорошие месяцы: 4, 9\nНормальные месяцы: 10\n#ПОГОДА (предпочтения рыбы)\nТемпература: 16-25\nДавление: стабильное\nПогода: ясно, облачно\nВремя: день, утро/вечер\nВетер до: 7`,
  "Змееголов": `--Рыба--\nНазвание: Змееголов\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759232119/%D0%B7%D0%BC%D0%B5%D0%B5%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2_ykfrty.png\nСнасти: Мощный спиннинг, поверхностные приманки (лягушки)\nНаживка: Живая лягушка, крупный живец\nКлев: Активен весь световой день\n#СЕЗОН\nЛучшие месяцы: 6, 7, 8\nХорошие месяцы: 5, 9\nНормальные месяцы: 4, 10\n#ПОГОДА (предпочтения рыбы)\nТемпература: 20-30\nДавление: стабильное, падает\nПогода: ясно, облачно\nВремя: утро/вечер, день\nВетер до: 5`,
  "Лещ": `--Рыба--\nНазвание: Лещ\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759232126/%D0%BB%D0%B5%D1%89_vb0qby.png\nСнасти: Фидер, донные снасти, поплавочная удочка\nНаживка: Червь, опарыш, мотыль, кукуруза\nКлев: Часто клюет ночью, а также ранним утром\n#СЕЗОН\nЛучшие месяцы: 5, 6, 9\nХорошие месяцы: 7, 8\nНормальные месяцы: 4, 10\n#ПОГОДА (предпочтения рыбы)\nТемпература: 16-24\nДавление: стабильное, падает\nПогода: облачно, пасмурно\nВремя: ночь, утро/вечер\nВетер до: 5`,
  "Плотва": `--Рыба--\nНазвание: Плотва\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759232179/plotva_wq1zcl.png\nСнасти: Поплавочная удочка, легкий фидер\nНаживка: Опарыш, мотыль, тесто, кукуруза\nКлев: Активна в течение всего дня\n#СЕЗОН\nЛучшие месяцы: 4, 5, 9\nХорошие месяцы: 3, 6, 10\nНормальные месяцы: 2, 7, 8\n#ПОГОДА (предпочтения рыбы)\nТемпература: 10-20\nДавление: стабильное\nПогода: облачно, пасмурно, ясно\nВремя: день, утро/вечер\nВетер до: 6`,
  "Щука": `--Рыба--\nНазвание: Щука\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759232134/%D1%89%D1%83%D0%BA%D0%B0_raxcjt.png\nСнасти: Спиннинг, кружки, жерлицы\nНаживка: Воблеры, блесны, силикон, живец\nКлев: Хищник-засадчик, пики активности утром и вечером\n#СЕЗОН\nЛучшие месяцы: 4, 5, 9, 10\nХорошие месяцы: 3, 6, 11\nНормальные месяцы: 7, 8\n#ПОГОДА (предпочтения рыбы)\nТемпература: 10-18\nДавление: падает, стабильное\nПогода: пасмурно, облачно, дождь\nВремя: утро/вечер, день\nВетер до: 8`,
  "Карась": `--Рыба--\nНазвание: Карась\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759233425/karas_fdaymx.png\nСнасти: Поплавочная удочка, легкая донная снасть\nНаживка: Червь, опарыш, тесто, кукуруза\nКлев: Лучше всего клюет в утренние и вечерние часы\n#СЕЗОН\nЛучшие месяцы: 5, 6, 7, 8\nХорошие месяцы: 4, 9\nНормальные месяцы: 10\n#ПОГОДА (предпочтения рыбы)\nТемпература: 18-26\nДавление: стабильное\nПогода: ясно, облачно\nВремя: утро/вечер, день\nВетер до: 4`,
  "Чехонь": `--Рыба--\nНазвание: Чехонь\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759233428/%D1%87%D0%B5%D1%85%D0%BE%D0%BD%D1%8C_komogt.png\nСнасти: Дальнобойная поплавочная удочка, фидер, 'резинка'\nНаживка: Опарыш, мелкий червь, мотыль\nКлев: Стайная рыба, активна днем\n#СЕЗОН\nЛучшие месяцы: 5, 6\nХорошие месяцы: 4, 7, 8\nНормальные месяцы: 9\n#ПОГОДА (предпочтения рыбы)\nТемпература: 15-24\nДавление: стабильное\nПогода: ясно, облачно\nВремя: день\nВетер до: 7`,
  "Толстолобик": `--Рыба--\nНазвание: Толстолобик\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759233428/tolstolobik_cavayb.png\nСнасти: Специализированные донные снасти, 'убийца толстолоба'\nНаживка: Технопланктон, каши\nКлев: Питается фитопланктоном, ловится в теплые, солнечные дни\n#СЕЗОН\nЛучшие месяцы: 6, 7, 8\nХорошие месяцы: 5, 9\nНормальные месяцы: \n#ПОГОДА (предпочтения рыбы)\nТемпература: 22-30\nДавление: стабильное\nПогода: ясно\nВремя: день\nВетер до: 4`,
  "Вобла": `--Рыба--\nНазвание: Вобла\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759233431/%D0%B2%D0%BE%D0%B1%D0%BB%D0%B0_ofx0mx.png\nСнасти: Поплавочная удочка, донная снасть\nНаживка: Червь, опарыш, кукуруза\nКлев: Стайная рыба, пик хода и клева - весна\n#СЕЗОН\nЛучшие месяцы: 4, 5\nХорошие месяцы: 3, 9, 10\nНормальные месяцы: \n#ПОГОДА (предпочтения рыбы)\nТемпература: 10-18\nДавление: стабильное\nПогода: облачно, ясно\nВремя: день\nВетер до: 8`,
  "Маринка": `--Рыба--\nНазвание: Маринка\nФото: https://res.cloudinary.com/dyuywnfy3/image/upload/v1759233431/marinka_2_hoqalw.png\nСнасти: Поплавочная удочка, донная снасть\nНаживка: Кузнечик, саранча, червь\nКлев: Обитатель рек с каменистым дном\n#СЕЗОН\nЛучшие месяцы: 5, 6, 7, 8\nХорошие месяцы: 4, 9\nНормальные месяцы: 10\n#ПОГОДА (предпочтения рыбы)\nТемпература: 15-22\nДавление: стабильное\nПогода: ясно, облачно\nВремя: день\nВетер до: 6`,
};

const EditModals = () => {
  const { appData, setAppData } = useData();
  const [status, setStatus] = useState('idle');
  const [editingItem, setEditingItem] = useState(null);
  const fishTextareaRef = useRef(null);
  
  const initialFormData = {
    title: '', tagline: '', cardTitle: '', description: '', image: '',
    lat: '', lon: '', 
    fish: '',
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

  const insertText = (textToInsert) => {
    const textarea = fishTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
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

  const addFishTemplate = (fishName) => {
    const template = FISH_TEMPLATES[fishName];
    if (!template) return;
    const textarea = fishTextareaRef.current;
    const currentText = textarea.value;
    const textToInsert = (currentText.trim() === '' ? '' : '\n\n') + template;
    const newText = currentText + textToInsert;
    setFormData(prev => ({ ...prev, fish: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.scrollTop = textarea.scrollHeight;
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
    
    .quick-buttons-container { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e5e7eb; }
    .quick-buttons-group { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .quick-buttons-group strong { font-size: 13px; color: #4B5563; margin-right: 5px; }
    .quick-btn { background: #e9ecef; border: 1px solid #dee2e6; color: #495057; padding: 5px 10px; font-size: 13px; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; }
    .quick-btn:hover { background: #ced4da; }
    .fish-template-btn { background: #007bff; color: white; font-weight: 700; }
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
              {field.name === 'fish' ? (
                <>
                  <textarea ref={fishTextareaRef} className="form-textarea" name="fish" value={formData.fish} onChange={handleInputChange}></textarea>
                  <div className="quick-buttons-container">
                    <div className="quick-buttons-group">
                      <strong>Добавить рыбу:</strong>
                      {Object.keys(FISH_TEMPLATES).map(fishName => (
                        <button key={fishName} type="button" className="quick-btn fish-template-btn" onClick={() => addFishTemplate(fishName)}>
                          + {fishName}
                        </button>
                      ))}
                    </div>
                    <div className="quick-buttons-group">
                      <strong>Подсказки:</strong>
                      <button type="button" className="quick-btn" onClick={() => insertText('падает')}>падает</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('стабильное')}>стабильное</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('растет')}>растет</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('ясно')}>ясно</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('облачно')}>облачно</button>
                      <button type="button" className="quick-btn" onClick={() => insertText('пасмурно')}>пасмурно</button>
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