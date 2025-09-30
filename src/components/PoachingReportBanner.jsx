// src/components/PoachingReportBanner.jsx

import React from 'react';
import styled from 'styled-components';
import { FaTelegramPlane } from 'react-icons/fa';

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---

const BannerContainer = styled.section`
  width: 100%;
  background-color: #F2994A; /* Фирменный оранжевый цвет */
  padding: 2.5rem 3.75rem;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;

  @media (max-width: 48rem) {
    padding: 2rem 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 75rem; /* 1200px, как в предыдущем компоненте */
  margin: 0 auto;
  gap: 2rem; /* Отступ между текстом и кнопкой */
  flex-wrap: wrap; /* Позволяет переносить кнопку на новую строку */

  @media (max-width: 64rem) { /* 1024px */
    flex-direction: column;
    justify-content: center;
    text-align: center;
    gap: 1.5rem;
  }
`;

const TextContent = styled.div`
  h3 {
    font-size: 1.75rem;
    font-weight: 900;
    color: #fff;
    text-transform: uppercase;
    margin: 0 0 0.25rem 0;
  }

  p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }

  @media (max-width: 48rem) {
    h3 { font-size: 1.5rem; }
    p { font-size: 0.9rem; }
  }
`;

const TelegramButton = styled.a`
  display: inline-flex; /* Используем inline-flex для выравнивания иконки и текста */
  align-items: center;
  gap: 0.75rem; /* Отступ между иконкой и текстом */
  padding: 0.75rem 1.5rem;
  background-color: #fff;
  color: #1A2E40; /* Темно-синий текст, как на сайте */
  border-radius: 0.25rem;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap; /* Чтобы текст кнопки не переносился */

  &:hover {
    background-color: #1A2E40;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }
`;


const PoachingReportBanner = () => {
  // ЗАМЕНИТЕ 'your_bot_username' НА НАЗВАНИЕ ВАШЕГО БОТА
  const telegramBotUrl = "https://t.me/your_bot_username";

  return (
    <BannerContainer>
      <ContentWrapper>
        <TextContent>
          <h3>Сообщить о браконьерстве</h3>
          <p>Ваш вклад в сохранение природы неоценим.</p>
        </TextContent>
        <TelegramButton href={telegramBotUrl} target="_blank" rel="noopener noreferrer">
          <FaTelegramPlane size={20} />
          <span>Написать в бот</span>
        </TelegramButton>
      </ContentWrapper>
    </BannerContainer>
  );
};

export default PoachingReportBanner;