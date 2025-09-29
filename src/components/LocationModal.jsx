// src/components/LocationModal.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import WeatherWidget from './WeatherWidget';
import WaterLevelWidget from './WaterLevelWidget';
import BiteForecastChart from './BiteForecastChart'; // Импортируем новый компонент-график

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
    height: 30%;
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
  padding: 40px;
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
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.1);
  }
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
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  @media (max-width: 75rem) {
    grid-template-columns: 1fr;
  }
`;

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  & > *:not(h4) {
    flex-grow: 1;
  }
`;

const PopupBackdrop = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

const PopupContent = styled(motion.div)`
  background: #455A64;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  color: #ECEFF1;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  position: relative;
`;

const PopupCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  color: #B0BEC5;
  border: none;
  font-size: 28px;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`;

const PopupTitle = styled.h3`
  font-size: 24px;
  font-weight: 900;
  color: #FFAB40;
  margin: 0 0 20px 0;
  text-align: center;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 15px;
`;

const InfoLabel = styled.span`
  font-weight: 700;
  color: #90A4AE;
`;

const InfoValue = styled.span`
  color: #ECEFF1;
`;

const Disclaimer = styled.p`
  font-size: 12px;
  color: #78909C;
  text-align: center;
  margin-top: 25px;
  font-style: italic;
`;

const FishInfoPopup = ({ fish, onClose }) => {
  return (
    <PopupBackdrop
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PopupContent
        onClick={(e) => e.stopPropagation()}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <PopupCloseButton onClick={onClose}>×</PopupCloseButton>
        <PopupTitle>{fish.name}</PopupTitle>
        <InfoGrid>
          {fish.tackle && ( <> <InfoLabel>Снасти:</InfoLabel> <InfoValue>{fish.tackle}</InfoValue> </> )}
          {fish.bait && ( <> <InfoLabel>Наживка:</InfoLabel> <InfoValue>{fish.bait}</InfoValue> </> )}
          {fish.bitingTime && ( <> <InfoLabel>Время клева:</InfoLabel> <InfoValue>{fish.bitingTime}</InfoValue> </> )}
        </InfoGrid>
      </PopupContent>
    </PopupBackdrop>
  );
};

const LocationModal = ({ location, onClose }) => {
  const [selectedFish, setSelectedFish] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState(true);

  useEffect(() => {
    const fetchForecastData = async () => {
      if (!location.lat || !location.lon) {
        setIsLoadingForecast(false);
        return;
      }
      
      const API_KEY = '5da8e53d51f07a4979ba54e627fe23f5'; // <-- ТВОЙ КЛЮЧ УЖЕ ЗДЕСЬ
      const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=ru`;
      
      try {
        const response = await fetch(URL);
        if (!response.ok) throw new Error('Weather data fetch failed');
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Ошибка при загрузке погоды:", error);
        setWeatherData(null); // В случае ошибки сбрасываем данные
      } finally {
        setIsLoadingForecast(false);
      }
    };

    fetchForecastData();
  }, [location]);

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
        {selectedFish && <FishInfoPopup fish={selectedFish} onClose={() => setSelectedFish(null)} />}

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
                  <FishItem key={index} onClick={() => setSelectedFish(fish)}>
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
            <WidgetContainer>
              <h4>Карта:</h4>
              <div 
                style={{ background: '#263238', borderRadius: '4px', height: '100%', minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                dangerouslySetInnerHTML={{ __html: location.mapEmbedCode || '<div style="color: #78909C; font-weight: 700;">Карта скоро появится</div>' }} 
              />
            </WidgetContainer>
            <WidgetContainer>
              <h4>Уровень воды:</h4>
              <WaterLevelWidget 
                level={location.waterLevel}
                dynamics={location.waterLevelDynamics}
                lastUpdated={location.waterLevelUpdate}
              />
            </WidgetContainer>
            <WidgetContainer>
              <h4>Прогноз погоды:</h4>
              <WeatherWidget lat={location.lat} lon={location.lon} />
            </WidgetContainer>
          </BottomBlock>

          {/* --- БЛОК С ГРАФИКОМ ПРОГНОЗА --- */}
          {isLoadingForecast ? (
            location.fish && location.fish.length > 0 && <div style={{textAlign: 'center', color: '#78909C', marginTop: '40px'}}>Загрузка прогноза клёва...</div>
          ) : (
            weatherData && weatherData.list && (
              <>
                <BiteForecastChart location={location} weatherList={weatherData.list} />
                <Disclaimer>Прогноз носит рекомендательный характер и основан на общих факторах.</Disclaimer>
              </>
            )
          )}

        </ModalScrollContainer>
        
      </ModalContent>
    </ModalBackdrop>
  );
};

export default LocationModal;