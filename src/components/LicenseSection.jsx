// src/components/LicenseSection.jsx

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// --- ДАННЫЕ ДЛЯ ВЫПАДАЮЩЕГО СПИСКА ---
const locationsData = [
  { id: 'shrd', name: 'Шардаринское вдхр.' },
  { id: 'srd', name: 'Река Сырдарья' },
  { id: 'koks', name: 'Коксарайский контррегулятор' },
  { id: 'bugun', name: 'Бугуньское вдхр.' },
  { id: 'badam', name: 'Бадамское вдхр.' },
];


// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---

const SectionContainer = styled.section`
  width: 100%;
  background-color: #F8F9FA;
  padding: 4rem 3.75rem; 
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;

  @media (max-width: 48rem) {
    padding: 3rem 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr; 
  max-width: 75rem; /* 1200px */
  margin: 0 auto;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.625rem 1.875rem rgba(0,0,0,0.07);
  overflow: hidden;

  @media (max-width: 64rem) { /* 1024px */
    grid-template-columns: 1fr;
  }
`;

const InfoColumn = styled.div`
  padding: 2.5rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-size: 2.5rem;
    font-weight: 900;
    color: #1A2E40;
    text-transform: uppercase;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }
  p {
    font-size: 1rem;
    color: #6B7280;
    line-height: 1.7;
    margin: 0;
  }

  @media (max-width: 64rem) {
    text-align: center;
    padding: 2.5rem;
  }
`;

const FormColumn = styled.div`
  padding: 2.5rem 3rem;
  background-color: #FDFDFD;
  border-left: 1px solid #F0F0F0;

  @media (max-width: 64rem) {
    border-left: none;
    border-top: 1px solid #F0F0F0;
    padding: 2rem 1.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  @media (max-width: 30rem) { /* 480px */
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;

  &.full-width {
    grid-column: span 2;
  }

  @media (max-width: 30rem) {
    &.full-width {
      grid-column: span 1;
    }
  }
`;

const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 700;
  color: #4B5563;
  margin-bottom: 0.5rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.25rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  background-color: #fff;
  color: #1A2E40;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #F2994A;
    box-shadow: 0 0 0 3px rgba(242, 153, 74, 0.2);
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.25rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  background-color: #fff;
  color: #1A2E40;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #F2994A;
    box-shadow: 0 0 0 3px rgba(242, 153, 74, 0.2);
  }
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  margin-top: 1.25rem;
  background-color: #F2994A;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  grid-column: span 2;

  &:hover {
    background-color: #e08e44;
    transform: translateY(-2px);
  }
  
  @media (max-width: 30rem) {
    grid-column: span 1;
  }
`;


const LicenseSection = () => {
  return (
    <SectionContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <ContentWrapper>
          <InfoColumn>
            <h2>Оформление Лицензии</h2>
            <p>Получите официальное разрешение на любительское рыболовство в водоемах Туркестанской области быстро и удобно.</p>
          </InfoColumn>

          <FormColumn>
            <form onSubmit={(e) => e.preventDefault()}>
              <InputGroup className="full-width">
                <StyledLabel htmlFor="location">Выберите водоем</StyledLabel>
                <StyledSelect id="location" required>
                  <option value="" disabled selected>-- Укажите место рыбалки --</option>
                  {locationsData.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </StyledSelect>
              </InputGroup>

              <InputGroup className="full-width">
                <StyledLabel htmlFor="fullName">Фамилия и Имя</StyledLabel>
                <StyledInput id="fullName" type="text" placeholder="Иванов Иван" required />
              </InputGroup>
              
              <FormGrid>
                <InputGroup>
                  <StyledLabel htmlFor="iin">ИИН (12 цифр)</StyledLabel>
                  <StyledInput id="iin" type="text" placeholder="123456789012" maxLength="12" required />
                </InputGroup>

                <InputGroup>
                  <StyledLabel htmlFor="carPlate">Гос. номер авто (необязательно)</StyledLabel>
                  <StyledInput id="carPlate" type="text" placeholder="123 ABC 13" />
                </InputGroup>

                <InputGroup>
                  <StyledLabel htmlFor="licenseType">Тип лицензии</StyledLabel>
                  <StyledSelect id="licenseType" required>
                    <option value="daily">Дневная</option>
                    <option value="monthly">Месячная</option>
                    <option value="annual">Годовая</option>
                  </StyledSelect>
                </InputGroup>

                <InputGroup>
                  <StyledLabel htmlFor="startDate">Дата начала</StyledLabel>
                  <StyledInput id="startDate" type="date" required />
                </InputGroup>

                <SubmitButton type="submit">
                  Перейти к оплате
                </SubmitButton>
              </FormGrid>
            </form>
          </FormColumn>
        </ContentWrapper>
      </motion.div>
    </SectionContainer>
  );
};

export default LicenseSection;