import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Позволяет загружать переводы из папки public/locales
  .use(initReactI18next) // Подключает i18next к React
  .init({
    supportedLngs: ['ru', 'en', 'kz'], // Список поддерживаемых языков
    fallbackLng: 'ru', // Язык по умолчанию, если перевод не найден
    
    // Где искать файлы переводов
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    // Опции React
    react: {
      useSuspense: true, // Используем Suspense для подгрузки переводов
    },
  });

export default i18n;