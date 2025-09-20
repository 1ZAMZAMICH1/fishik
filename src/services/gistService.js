// src/services/gistService.js

// ▼▼▼ ВСТАВЬТЕ СЮДА ВАШИ ДАННЫЕ ▼▼▼
const GIST_ID = 'f5b24a10dcb5eb943f12e5dac1a43d07';
const GITHUB_TOKEN = import.meta.env.VITE_GIST_TOKEN;
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

const GIST_URL = `https://api.github.com/gists/${GIST_ID}`;
const FILENAME = 'fishing_data.json';

// Функция для получения данных с Gist (уже должна быть у вас)
export const fetchData = async () => {
  try {
    const response = await fetch(GIST_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error('Не удалось загрузить данные с Gist.');
    }
    const gist = await response.json();
    if (!gist.files || !gist.files[FILENAME]) {
      throw new Error(`Файл с именем "${FILENAME}" не найден в Gist.`);
    }
    const content = gist.files[FILENAME].content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    return null;
  }
};

// Функция для сохранения (добавления) данных
export const saveData = async (allData) => {
  try {
    const response = await fetch(GIST_URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        files: {
          [FILENAME]: {
            content: JSON.stringify(allData, null, 2),
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Не удалось сохранить данные: ${errorData.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка при сохранении данных:", error);
    throw error;
  }
};

// --- НЕДОСТАЮЩАЯ ФУНКЦИЯ, КОТОРУЮ НУЖНО ДОБАВИТЬ ---
// Технически, она делает то же самое, что и saveData, но мы используем
// разные имена для семантической ясности в коде админки.
export const updateData = async (allData) => {
  // Эта функция полностью идентична saveData, так как PATCH-запрос к Gist
  // всегда перезаписывает файл целиком.
  return await saveData(allData);
};