// src/components/admin/EditFormModal.jsx

import React, { useState } from 'react';

const EditFormModal = ({ item, fields, onSave, onClose, isSaving }) => {
  const [formData, setFormData] = useState(item);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };
  
  const styles = `
    .edit-modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 100; display: flex; justify-content: center; align-items: center; font-family: 'Montserrat', sans-serif; }
    .edit-modal-content { background: #fff; padding: 30px; border-radius: 12px; width: 90%; max-width: 700px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-height: 90vh; display: flex; flex-direction: column; }
    .edit-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb; flex-shrink: 0; }
    .edit-modal-header h3 { font-size: 24px; margin: 0; color: #1A2E40; }
    .close-button { background: #f0f4f8; border: none; border-radius: 50%; width: 35px; height: 35px; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
    .close-button:hover { background: #e5e7eb; }
    .edit-modal-form { overflow-y: auto; padding-right: 15px; }
    .edit-modal-form .form-group { margin-bottom: 15px; }
    .edit-modal-form .form-group label { font-weight: 700; margin-bottom: 8px; color: #4B5563; display: block; font-size: 14px; }
    .edit-modal-form .form-input, .edit-modal-form .form-textarea { width: 100%; box-sizing: border-box; padding: 12px 15px; border: 1px solid #E5E7EB; border-radius: 6px; font-family: 'Montserrat', sans-serif; font-size: 16px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .edit-modal-form .form-textarea { min-height: 120px; resize: vertical; }
    .edit-modal-form .form-input:focus, .edit-modal-form .form-textarea:focus { outline: none; border-color: #F2994A; box-shadow: 0 0 0 3px rgba(242, 153, 74, 0.2); }
    .modal-footer { margin-top: 20px; flex-shrink: 0; }
    .save-button { padding: 12px 25px; background-color: #F2994A; color: #1A2E40; border: none; border-radius: 6px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; }
    .save-button:disabled { background-color: #ccc; cursor: not-allowed; }
  `;

  return (
    <div className="edit-modal-backdrop" onClick={onClose}>
      <style>{styles}</style>
      <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <h3>Редактирование</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="edit-modal-form">
          {fields.map(field => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea className="form-textarea" name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} />
              ) : (
                <input className="form-input" type="text" name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} />
              )}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="save-button" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFormModal;