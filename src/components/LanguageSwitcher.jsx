// src/components/LanguageSwitcher.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const SwitcherContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  background-color: rgba(26, 46, 64, 0.7);
  padding: 0.5rem;
  border-radius: 0.25rem;
`;

const LangButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid transparent;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  border-radius: 0.25rem;

  &.active {
    background: #F2994A;
    border-color: #F2994A;
    color: #fff;
  }

  &:hover:not(.active) {
    color: #fff;
  }
`;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <SwitcherContainer>
      <LangButton 
        onClick={() => changeLanguage('ru')}
        className={i18n.language === 'ru' ? 'active' : ''}
      >
        RU
      </LangButton>
      <LangButton 
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'active' : ''}
      >
        EN
      </LangButton>
      <LangButton 
        onClick={() => changeLanguage('kz')}
        className={i18n.language === 'kz' ? 'active' : ''}
      >
        KZ
      </LangButton>
    </SwitcherContainer>
  );
};

export default LanguageSwitcher;