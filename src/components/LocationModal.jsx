// src/components/LocationModal.jsx

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import WeatherWidget from './WeatherWidget';

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled(motion.div)`
  background: #37474F;
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  max-height: 800px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 48rem) {
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }
`;

const ModalHeader = styled.img`
  width: 100%;
  height: 40%;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 48rem) {
    height: 30%; /* Уменьшаем шапку на мобильных */
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease;
  z-index: 10;

  &:hover {
    background: #FFAB40;
  }
`;

const ModalScrollContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 90px 40px;

  @media (max-width: 48rem) {
    padding: 2rem 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  margin: 0 0 15px 0;
  text-align: center;

  @media (max-width: 48rem) {
    font-size: 28px;
  }
`;

const ModalDescription = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #ECEFF1;
  max-width: 80%;
  margin: 0 auto 30px auto;
  text-align: center;

  @media (max-width: 48rem) {
    max-width: 100%;
    font-size: 15px;
  }
`;

const InfoBlock = styled.div`
  margin-bottom: 30px;
  
  h4 {
    font-size: 16px;
    font-weight: 700;
    color: #FFAB40;
    margin: 0 0 15px 0;
    text-transform: uppercase;
    text-align: center;
  }
`;

const FishIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const FishItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FishIcon = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
`;

const FishName = styled.p`
  font-size: 12px;
  color: #B0BEC5;
  margin-top: 5px;
`;

const BottomBlock = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 48rem) {
    grid-template-columns: 1fr; /* Ставим в колонку */
  }
`;

const MapContainer = styled.div`
  background: #263238;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
  min-height: 250px; /* Чтобы карта не схлопывалась */
  display: flex;
  align-items: center;
  justify-content: center;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const LocationModal = ({ location, onClose }) => {
  return (
    <ModalBackdrop
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContent
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <ModalHeader src={location.image} alt={location.title} />
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        
        <ModalScrollContainer>
          <ModalTitle>{location.title.replace(/\\n/g, ' ')}</ModalTitle>
          <ModalDescription>{location.description}</ModalDescription>
          
          <InfoBlock>
            <h4>Рыба в водоеме:</h4>
            <FishIcons>
              {location.fish && location.fish.length > 0 ? (
                location.fish.map((fish, index) => (
                  <FishItem key={index}>
                    <FishIcon src={fish.image} alt={fish.name} />
                    <FishName>{fish.name}</FishName>
                  </FishItem>
                ))
              ) : (
                <p style={{ color: '#78909C', fontSize: '14px', width: '100%', textAlign: 'center' }}>
                  Информация уточняется
                </p>
              )}
            </FishIcons>
          </InfoBlock>

          <BottomBlock>
            <div>
              <h4>Карта:</h4>
              <MapContainer
                dangerouslySetInnerHTML={{ __html: location.mapEmbedCode || '<div style="color: #78909C; font-weight: 700;">Карта скоро появится</div>' }} 
              />
            </div>
            <div>
              <h4>Прогноз погоды:</h4>
              <WeatherWidget lat={location.lat} lon={location.lon} />
            </div>
          </BottomBlock>
        </ModalScrollContainer>
        
      </ModalContent>
    </ModalBackdrop>
  );
};

export default LocationModal;