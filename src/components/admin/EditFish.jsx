// src/components/admin/EditFish.jsx
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { saveData, updateData } from '../../services/gistService';
import EditFormModal from './EditFormModal';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { FiSunrise, FiSun, FiSunset, FiMoon } from 'react-icons/fi';

const EditFish = () => {
  const { appData, setAppData } = useData();
  const [status, setStatus] = useState('idle');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', habitat: '', tackle: '', bait: '', image: '',
    difficulty: 1, peakTime: [], biteMonths: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDifficultyChange = (level) => { setFormData(prev => ({ ...prev, difficulty: level })); };
  const handlePeakTimeChange = (time) => { setFormData(prev => ({ ...prev, peakTime: prev.peakTime.includes(time) ? prev.peakTime.filter(t => t !== time) : [...prev.peakTime, time] })); };
  const handleBiteMonthChange = (month) => { setFormData(prev => ({ ...prev, biteMonths: prev.biteMonths.includes(month) ? prev.biteMonths.filter(m => m !== month) : [...prev.biteMonths, month] })); };

  const handleAddNewFish = async () => {
    for (const key in formData) { if (!formData[key]) { alert(`Пожалуйста, заполните поле "${key}"`); return; } }
    setStatus('saving');
    const fishArray = appData.fishData || [];
    const newId = fishArray.length > 0 ? Math.max(...fishArray.map(f => f.id)) + 1 : 1;
    const newFish = { id: newId, title: formData.name, ...formData };
    const updatedData = { ...appData, fishData: [...fishArray, newFish] };
    try {
      await saveData(updatedData);
      setAppData(updatedData);
      setFormData({ name: '', description: '', habitat: '', tackle: '', bait: '', image: '', difficulty: 1, peakTime: [], biteMonths: [] });
      setStatus('idle');
      alert('Новая рыба успешно добавлена!');
    } catch (error) {
      setStatus('idle');
      alert(`Ошибка сохранения: ${error.message}`);
    }
  };

  const handleUpdateFish = async (updatedFish) => {
    setStatus('saving');
    const updatedFishArray = appData.fishData.map(f => f.id === updatedFish.id ? updatedFish : f);
    const updatedData = { ...appData, fishData: updatedFishArray };
    try {
      await updateData(updatedData);
      setAppData(updatedData);
      setStatus('idle');
      setEditingItem(null);
      alert('Данные о рыбе успешно обновлены!');
    } catch (error) {
      setStatus('idle');
      alert(`Ошибка обновления: ${error.message}`);
    }
  };

  const handleDeleteFish = async (idToDelete) => {
    if (window.confirm('Вы уверены, что хотите удалить этот вид рыбы?')) {
      setStatus('saving');
      const updatedFishArray = appData.fishData.filter(fish => fish.id !== idToDelete);
      const updatedData = { ...appData, fishData: updatedFishArray };
      try {
        await updateData(updatedData);
        setAppData(updatedData);
        setStatus('idle');
        alert('Вид рыбы успешно удален!');
      } catch (error) {
        setStatus('idle');
        alert(`Ошибка удаления: ${error.message}`);
      }
    }
  };

  const fishFields = [
    { name: 'name', label: 'Название', type: 'text' },
    { name: 'image', label: 'Ссылка (URL) на фото', type: 'text' },
    { name: 'description', label: 'Описание', type: 'textarea' },
    { name: 'habitat', label: 'Среда обитания', type: 'textarea' },
    { name: 'tackle', label: 'Снасти', type: 'textarea' },
    { name: 'bait', label: 'Наживка', type: 'textarea' },
  ];

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
    .form-textarea { min-height: 100px; resize: vertical; }
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
    .widget-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .widget-editor .stars, .widget-editor .time-icons { display: flex; gap: 10px; font-size: 24px; cursor: pointer; }
    .widget-editor .stars svg { color: #e0e0e0; } .widget-editor .stars svg.active { color: #F9A826; }
    .widget-editor .time-icons svg { color: #ccc; } .widget-editor .time-icons svg.active { color: #1c2a3a; }
    .month-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
    .month-btn { padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; background: #fff; font-weight: 700; color: #4B5563; cursor: pointer; transition: all 0.2s ease; }
    .month-btn.active { background: #F9A826; color: #fff; border-color: #F9A826; }
  `;

  if (!appData) return <div className="status-message">Загрузка...</div>;
  
  const fishArray = appData.fishData || [];
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const times = [ { icon: <FiSunrise />, period: 'morning' }, { icon: <FiSun />, period: 'day' }, { icon: <FiSunset />, period: 'evening' }, { icon: <FiMoon />, period: 'night' }];

  return (
    <div className="edit-page-container">
      <style>{styles}</style>
      <h1 className="page-title">Управление Энциклопедией Рыб</h1>
      <div className="form-container">
        <h3>Добавить новый вид рыбы</h3>
        <div className="form-grid">
          <div className="form-group"><label>Название</label><input className="form-input" type="text" name="name" value={formData.name} onChange={handleInputChange}/></div>
          <div className="form-group"><label>Ссылка (URL) на фото</label><input className="form-input" type="text" name="image" value={formData.image} onChange={handleInputChange}/></div>
          <div className="form-group full-width"><label>Описание</label><textarea className="form-textarea" name="description" value={formData.description} onChange={handleInputChange}></textarea></div>
          <div className="form-group"><label>Среда обитания</label><textarea className="form-textarea" name="habitat" value={formData.habitat} onChange={handleInputChange}></textarea></div>
          <div className="form-group"><label>Снасти</label><textarea className="form-textarea" name="tackle" value={formData.tackle} onChange={handleInputChange}></textarea></div>
          <div className="form-group full-width"><label>Наживка</label><textarea className="form-textarea" name="bait" value={formData.bait} onChange={handleInputChange}></textarea></div>
        </div>
        <div className="form-group full-width widget-grid" style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb'}}>
          <div className="widget-editor"><label>Сложность</label><div className="stars">{[1, 2, 3].map(level => (<span key={level} onClick={() => handleDifficultyChange(level)}>{formData.difficulty >= level ? <BsStarFill className="active"/> : <BsStar />}</span>))}</div></div>
          <div className="widget-editor"><label>Время клёва</label><div className="time-icons">{times.map(t => (<span key={t.period} onClick={() => handlePeakTimeChange(t.period)}>{React.cloneElement(t.icon, { className: formData.peakTime.includes(t.period) ? 'active' : '' })}</span>))}</div></div>
        </div>
        <div className="form-group full-width">
          <label>Календарь клёва (месяцы)</label>
          <div className="month-grid">{months.map((month, index) => (<button key={month} className={`month-btn ${formData.biteMonths.includes(index + 1) ? 'active' : ''}`} onClick={() => handleBiteMonthChange(index + 1)}>{month}</button>))}</div>
        </div>
        <button className="save-button" onClick={handleAddNewFish} disabled={status === 'saving'}>{status === 'saving' ? 'Добавление...' : 'Добавить рыбу'}</button>
      </div>
      <div className="existing-data-container">
        <h3>Существующие виды ({fishArray.length} шт.)</h3>
        <ul className="data-list">
          {fishArray.map(fish => (
            <li key={fish.id} className="data-item">
              <strong>{fish.name}</strong>
              <div className="item-actions">
                <button className="action-btn edit" onClick={() => setEditingItem(fish)}>Редактировать</button>
                <button className="action-btn delete" onClick={() => handleDeleteFish(fish.id)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {editingItem && (
        <EditFormModal
          item={editingItem}
          fields={fishFields}
          onSave={handleUpdateFish}
          onClose={() => setEditingItem(null)}
          isSaving={status === 'saving'}
        />
      )}
    </div>
  );
};

export default EditFish;