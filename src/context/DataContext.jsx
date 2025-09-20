// src/context/DataContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchData } from '../services/gistService'; // Наш сервис для загрузки

// 1. Создаем сам контекст
const DataContext = createContext(null);

// 2. Создаем "Провайдер" - компонент-обертку, который будет загружать и хранить данные
export const DataProvider = ({ children }) => {
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await fetchData();
      if (data) {
        setAppData(data);
      }
      setLoading(false);
    };
    loadInitialData();
  }, []);

  // Если данные еще грузятся, можно показать глобальный загрузчик
  if (loading) {
    return <div>Загрузка данных сайта...</div>;
  }

  // Предоставляем загруженные данные всем дочерним компонентам
  return (
    <DataContext.Provider value={{ appData, setAppData }}>
      {children}
    </DataContext.Provider>
  );
};

// 3. Создаем "Хук" - простую функцию для получения данных в любом компоненте
export const useData = () => {
  return useContext(DataContext);
};