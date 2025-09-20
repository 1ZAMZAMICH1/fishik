// src/components/admin/EditCalendar.jsx

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { updateData } from '../../services/gistService';
import EditFormModal from './EditFormModal';

const EditCalendar = () => {
  const { appData, setAppData } = useData();
  const [status, setStatus] = useState('idle');
  const [editingItem, setEditingItem] = useState(null);

  const handleUpdate = async (updatedMonthData) => {
    setStatus('saving');
    const updatedFishingData = {
      ...appData.fishingData,
      [editingItem.monthName]: updatedMonthData
    };
    const updatedData = { ...appData, fishingData: updatedFishingData };

    try {
      await updateData(updatedData);
      setAppData(updatedData);
      setStatus('idle');
      setEditingItem(null);
      alert('Данные календаря успешно обновлены!');
    } catch (error) {
      setStatus('idle');
      alert(`Ошибка обновления: ${error.message}`);
    }
  };
  
  const fields = [
    { name: 'season', label: 'Сезон', type: 'text' },
    { name: 'fish', label: 'Рыба (через запятую)', type: 'text' },
    { name: 'bait', label: 'Рекомендуемая насадка', type: 'textarea' },
    { name: 'time', label: 'Лучшее время', type: 'text' },
  ];

  const styles = `
    .edit-page-container { font-family: 'Montserrat', sans-serif; }
    .page-title { font-size: 36px; font-weight: 900; color: #1A2E40; margin: 0 0 40px 0; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
    .data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .data-card { background-color: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .data-card h3 { font-size: 20px; color: #1A2E40; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
    .data-card p { font-size: 14px; color: #4B5563; margin: 0 0 5px 0; }
    .data-card p strong { color: #1A2E40; }
    .edit-btn { margin-top: 15px; width: 100%; padding: 10px; font-size: 14px; background: #1A2E40; color: #fff; border: none; border-radius: 6px; cursor: pointer; transition: background-color 0.2s ease; }
    .edit-btn:hover { background: #3d4852; }
    .status-message { font-size: 18px; font-weight: 700; color: #6B7280; }
  `;

  if (!appData || !appData.fishingData) return <div className="status-message">Загрузка данных...</div>;

  return (
    <div className="edit-page-container">
      <style>{styles}</style>
      <h1 className="page-title">Редактирование Календаря Клёва</h1>
      <div className="data-grid">
        {Object.entries(appData.fishingData).map(([monthName, monthData]) => (
          <div key={monthName} className="data-card">
            <h3>{monthName}</h3>
            <p><strong>Сезон:</strong> {monthData.season}</p>
            <p><strong>Рыба:</strong> {monthData.fish}</p>
            <button className="edit-btn" onClick={() => setEditingItem({ monthName, data: monthData })}>Редактировать</button>
          </div>
        ))}
      </div>

      {editingItem && (
        <EditFormModal
          item={editingItem.data}
          fields={fields}
          onSave={handleUpdate}
          onClose={() => setEditingItem(null)}
          isSaving={status === 'saving'}
        />
      )}
    </div>
  );
};
export default EditCalendar;