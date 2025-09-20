// src/components/admin/EditLocations.jsx
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { saveData, updateData } from '../../services/gistService';
import AddLocationForm from './AddLocationForm';
import EditFormModal from './EditFormModal';

const EditLocations = () => {
  const { appData, setAppData } = useData();
  const [status, setStatus] = useState('idle');
  const [editingItem, setEditingItem] = useState(null);

  const handleAddNewLocation = async (newLocationData) => {
    setStatus('saving');
    const locationsArray = appData.locationsData || [];
    const newId = locationsArray.length > 0 ? Math.max(...locationsArray.map(loc => loc.id)) + 1 : 1;
    const newLocation = { id: newId, cardTitle: newLocationData.title.replace(' ', '\\n'), ...newLocationData };
    
    // ИСПРАВЛЕНИЕ: Создаем полную копию данных и заменяем только нужный массив
    const updatedData = {
      ...appData,
      locationsData: [...locationsArray, newLocation]
    };

    try {
      await saveData(updatedData);
      setAppData(updatedData);
      setStatus('idle');
      return true;
    } catch (error) {
      setStatus('idle');
      alert(`Ошибка сохранения: ${error.message}`);
      return false;
    }
  };
  
  const handleUpdateLocation = async (updatedLocation) => {
    setStatus('saving');
    const updatedLocations = appData.locationsData.map(loc =>
      loc.id === updatedLocation.id ? updatedLocation : loc
    );
    const updatedData = { ...appData, locationsData: updatedLocations };
    
    try {
      await updateData(updatedData);
      setAppData(updatedData);
      setStatus('idle');
      setEditingItem(null);
      alert('Локация успешно обновлена!');
    } catch (error) {
      setStatus('idle');
      alert(`Ошибка обновления: ${error.message}`);
    }
  };

  const handleDeleteLocation = async (idToDelete) => {
    if (window.confirm('Вы уверены, что хотите удалить эту локацию? Отменить это действие будет невозможно.')) {
      setStatus('saving');
      const updatedLocations = appData.locationsData.filter(loc => loc.id !== idToDelete);
      const updatedData = { ...appData, locationsData: updatedLocations };
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

  const locationFields = [
    { name: 'tagline', label: 'Заголовок (tagline)', type: 'text' },
    { name: 'title', label: 'Основной заголовок', type: 'text' },
    { name: 'description', label: 'Описание', type: 'textarea' },
    { name: 'image', label: 'Ссылка (URL) на фото', type: 'text' },
  ];

  const styles = `
    .edit-page-container { font-family: 'Montserrat', sans-serif; }
    .page-title { font-size: 36px; font-weight: 900; color: #1A2E40; margin: 0 0 40px 0; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
    .existing-data-container { margin-top: 50px; background-color: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
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

  if (!appData) return <div className="status-message">Загрузка данных...</div>;
  const locationsArray = appData.locationsData || [];

  return (
    <div className="edit-page-container">
      <style>{styles}</style>
      <h1 className="page-title">Управление Локациями</h1>
      <AddLocationForm onSave={handleAddNewLocation} isSaving={status === 'saving'} />
      <div className="existing-data-container">
        <h3>Существующие локации ({locationsArray.length} шт.)</h3>
        <ul className="data-list">
          {locationsArray.map(loc => (
            <li key={loc.id} className="data-item">
              <strong>{loc.title.replace(/\\n/g, ' ')}</strong>
              <div className="item-actions">
                <button className="action-btn edit" onClick={() => setEditingItem(loc)}>Редактировать</button>
                <button className="action-btn delete" onClick={() => handleDeleteLocation(loc.id)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {editingItem && (
        <EditFormModal
          item={editingItem}
          fields={locationFields}
          onSave={handleUpdateLocation}
          onClose={() => setEditingItem(null)}
          isSaving={status === 'saving'}
        />
      )}
    </div>
  );
};

export default EditLocations;