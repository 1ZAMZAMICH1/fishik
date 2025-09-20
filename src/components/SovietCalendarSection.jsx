// src/components/SovietCalendarSection.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BsSun, BsSunset, BsMoonStars } from 'react-icons/bs';
import SunCalc from 'suncalc';
import { useData } from '../context/DataContext';

// --- КОМПОНЕНТЫ-ПОМОЩНИКИ ---
const iconMap = { 'Днем в оттепель': <BsSun/>, 'Конец зимы, первый лед': <BsSun/>, 'По последнему льду': <BsSun/>, 'Начало нереста': <BsSunset/>, 'После нереста': <BsSunset/>, 'Утром и вечером': <BsSunset/>, 'Ночью и на рассвете': <BsMoonStars/>, 'Утром и в пасмурную погоду': <BsSunset/>, 'Активный клев хищника': <BsSun/>, 'Похолодание воды': <BsSun/>, 'Предзимье, первый лед': <BsMoonStars/>, 'Глухозимье': <BsSun/> };

const getMoonData = (date) => {
  const illumination = SunCalc.getMoonIllumination(date); const phaseValue = illumination.phase;
  let phaseName = 'Убывающий серп';
  if (phaseValue > 0.97 || phaseValue < 0.03) phaseName = 'Новолуние';
  else if (phaseValue < 0.22) phaseName = 'Растущий серп';
  else if (phaseValue < 0.28) phaseName = 'Первая четверть';
  else if (phaseValue < 0.47) phaseName = 'Растущая луна';
  else if (phaseValue < 0.53) phaseName = 'Полнолуние';
  else if (phaseValue < 0.72) phaseName = 'Убывающая луна';
  else if (phaseValue < 0.78) phaseName = 'Последняя четверть';
  return { phaseName, illumination: Math.round(illumination.fraction * 100), phaseValue };
};

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---
const SectionContainer = styled.section`
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background-color: #F8F9FA;
  font-family: 'Montserrat', sans-serif;
  color: #1A2E40;
  padding: 2.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 48rem) {
    padding: 1.5rem;
    height: auto; /* Высота по контенту */
  }
`;

const MemoHeader = styled.div`
  text-align: center;
  margin-bottom: 1.25rem;
  flex-shrink: 0;

  .tagline {
    font-size: 1rem;
    font-weight: 700;
    color: #F2994A;
    letter-spacing: 0.0625rem;
    text-transform: uppercase;
  }
  .main-title {
    font-size: 3.5rem;
    font-weight: 900;
    color: #1A2E40;
    margin: 0.625rem 0;
    text-transform: uppercase;
  }
  
  @media (max-width: 48rem) {
    margin-bottom: 2rem;
    .tagline { font-size: 0.9rem; }
    .main-title { font-size: 2.5rem; }
  }
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.75rem;
  align-items: center;
  width: 100%;
  max-width: 93.75rem;
  position: relative;
  bottom: 3rem;
  
  @media (max-width: 48rem) {
    grid-template-columns: 1fr; /* Ставим в колонку */
    gap: 3rem;
    bottom: 0;
  }
`;

const CalendarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

const DialTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 900;
  color: #1A2E40;
  text-transform: uppercase;
  
  @media (max-width: 48rem) {
    font-size: 1.25rem;
  }
`;

const CalendarDial = styled.div`
  position: relative;
  width: 31.25rem;
  height: 31.25rem;
  border: 2px solid #E5E7EB;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 1.25rem 3.125rem rgba(0,0,0,0.08);

  @media (max-width: 48rem) {
    /* Гибкие размеры, зависящие от ширины экрана */
    width: clamp(18.75rem, 80vmin, 25rem);
    height: clamp(18.75rem, 80vmin, 25rem);
  }
`;

const DialButton = styled.button`
  position: absolute;
  width: 5rem;
  height: 2rem;
  background: #fff;
  border: 1px solid #E5E7EB;
  color: #4B5563;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border-color: #F2994A;
    color: #1A2E40;
  }
  &.active {
    background: #F2994A;
    color: #fff;
    border-color: #F2994A;
    transform: scale(1.1);
    box-shadow: 0 0.3125rem 0.9375rem rgba(242, 153, 74, 0.4);
  }

  &.day-button {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 0.875rem;
  }
`;

const InfoDisplay = styled(motion.div)`
  text-align: center;
  max-width: 21.875rem;

  .season {
    font-size: 1rem;
    font-weight: 700;
    color: #F2994A;
    letter-spacing: 0.0625rem;
    text-transform: uppercase;
  }
  .fish-list {
    font-size: 2.5rem;
    font-weight: 900;
    color: #1A2E40;
    margin: 0.9375rem 0;
    line-height: 1.2;
  }
  
  @media (max-width: 48rem) {
    max-width: 80%;
    .season { font-size: 0.9rem; }
    .fish-list { font-size: 1.75rem; margin: 0.5rem 0; }
  }
`;

const InfoBlock = styled.div`
  margin-top: 1.25rem;
  border-top: 1px solid #E5E7EB;
  padding-top: 1.25rem;

  h4 {
    font-size: 0.875rem;
    color: #6B7280;
    font-weight: 700;
    margin-bottom: 0.625rem;
    text-transform: uppercase;
  }
  p {
    font-size: 1.125rem;
    color: #1A2E40;
    margin: 0;
  }
  .time-icon {
    font-size: 1.375rem;
    vertical-align: middle;
    margin-right: 0.625rem;
    color: #1A2E40;
  }

  @media (max-width: 48rem) {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    h4 { font-size: 0.75rem; }
    p { font-size: 1rem; }
  }
`;

const LunarInfoDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
`;

const RealisticMoon = styled.div`
  width: 9.375rem;
  height: 9.375rem;
  border-radius: 50%;
  position: relative;
  background-color: #1A2E40;
  background-image: url('https://www.transparenttextures.com/patterns/dark-matter.png');
  box-shadow: inset 0.9375rem 0.9375rem 1.875rem rgba(0,0,0,0.5), inset -0.625rem -0.625rem 1.25rem rgba(50,50,50,0.3);

  @media (max-width: 48rem) {
    width: 7.5rem;
    height: 7.5rem;
  }
`;

const MoonLightOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
`;

const MoonLight = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #FFFDE7;
  box-shadow: 0 0 5rem 1.25rem #F9A826;
`;

const PhaseInfo = styled.div`
  text-align: center;
  .phase-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1A2E40;
    margin: 0;
  }
  .illumination-percent {
    font-size: 0.875rem;
    color: #6B7280;
  }
`;

const MonthNavigator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 13.75rem;
  margin-top: 0.9375rem;

  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1A2E40;
    text-transform: capitalize;
    margin: 0;
  }
`;

const NavButtonSmall = styled.button`
  background: none;
  border: 1px solid #E5E7EB;
  color: #4B5563;
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border-color: #F2994A;
    color: #F2994A;
  }
`;

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const SovietCalendarSection = () => {
  const { appData } = useData();
  
  if (!appData || !appData.fishingData) {
    return ( <section style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontSize: '1.25rem'}}> Загрузка календаря... </section> );
  }

  const fishingData = appData.fishingData;
  const months = Object.keys(fishingData);

  const [selectedFishMonth, setSelectedFishMonth] = useState('Июль');
  const [lunarDate, setLunarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  const currentFishData = fishingData[selectedFishMonth];
  const daysInCurrentMonth = new Date(lunarDate.getFullYear(), lunarDate.getMonth() + 1, 0).getDate();
  useEffect(() => { if (selectedDay > daysInCurrentMonth) setSelectedDay(daysInCurrentMonth); }, [lunarDate, selectedDay, daysInCurrentMonth]);
  const handlePrevMonth = () => { setLunarDate(new Date(lunarDate.getFullYear(), lunarDate.getMonth() - 1, 1)); };
  const handleNextMonth = () => { setLunarDate(new Date(lunarDate.getFullYear(), lunarDate.getMonth() + 1, 1)); };
  const selectedFullDate = new Date(lunarDate.getFullYear(), lunarDate.getMonth(), selectedDay);
  const moonDataForSelectedDay = getMoonData(selectedFullDate);

  // Динамическое расстояние для кнопок
  const dialRadiusInRem = { desktop: 15.625, mobile: '36vmin' };

  return (
    <SectionContainer>
        <MemoHeader>
          <p className="tagline">Памятка Рыболова</p>
          <h2 className="main-title">Календари</h2>
        </MemoHeader>
        <LayoutGrid>
          <CalendarColumn>
            <DialTitle>Календарь Клёва</DialTitle>
            <CalendarDial>
              {months.map((month, index) => {
                const angle = (index / 12) * 360;
                const rotation = `rotate(${angle}deg) translate(calc(${dialRadiusInRem.desktop}rem - 50%)) rotate(-${angle}deg)`;
                const mobileRotation = `rotate(${angle}deg) translate(${dialRadiusInRem.mobile}) rotate(-${angle}deg)`;
                
                return (
                  <DialButton key={month} className={selectedFishMonth === month ? 'active' : ''}
                    style={{
                      transform: window.innerWidth <= 768 ? mobileRotation : rotation
                    }}
                    onClick={() => setSelectedFishMonth(month)}
                  >
                    {month.toUpperCase()}
                  </DialButton>
                );
              })}
              <AnimatePresence mode="wait">
                <InfoDisplay key={selectedFishMonth} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease: 'easeInOut' }}>
                  <p className="season">{currentFishData.season}</p>
                  <h3 className="fish-list">{currentFishData.fish}</h3>
                  <InfoBlock><h4>Рекомендуемая насадка</h4><p>{currentFishData.bait}</p></InfoBlock>
                  <InfoBlock><h4>Лучшее время</h4><p><span className="time-icon">{iconMap[currentFishData.time]}</span>{currentFishData.time}</p></InfoBlock>
                </InfoDisplay>
              </AnimatePresence>
            </CalendarDial>
          </CalendarColumn>
          <CalendarColumn>
            <DialTitle>Лунный Календарь</DialTitle>
            <CalendarDial>
              {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((day, index) => {
                const angle = (index / daysInCurrentMonth) * 360;
                const rotation = `rotate(${angle}deg) translate(calc(${dialRadiusInRem.desktop}rem - 50%)) rotate(-${angle}deg)`;
                const mobileRotation = `rotate(${angle}deg) translate(${dialRadiusInRem.mobile}) rotate(-${angle}deg)`;

                return (
                  <DialButton key={day} className={`day-button ${selectedDay === day ? 'active' : ''}`}
                    style={{ transform: window.innerWidth <= 768 ? mobileRotation : rotation }}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </DialButton>
                );
              })}
              <LunarInfoDisplay>
                <AnimatePresence mode="wait">
                  <motion.div key={selectedDay} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <RealisticMoon>
                      <MoonLightOverlay>
                        <MoonLight
                          animate={{ transform: `translateX(${moonDataForSelectedDay.phaseValue < 0.5 ? (1 - moonDataForSelectedDay.phaseValue * 2) * -100 : (moonDataForSelectedDay.phaseValue * 2 - 1) * 100}%) scaleX(${moonDataForSelectedDay.phaseValue < 0.5 ? -1 : 1})` }}
                          transition={{ type: 'spring', stiffness: 50, damping: 15 }}/>
                      </MoonLightOverlay>
                    </RealisticMoon>
                  </motion.div>
                </AnimatePresence>
                <PhaseInfo>
                  <p className="phase-name">{moonDataForSelectedDay.phaseName}</p>
                  <p className="illumination-percent">Освещенность: {moonDataForSelectedDay.illumination}%</p>
                </PhaseInfo>
                <MonthNavigator>
                  <NavButtonSmall onClick={handlePrevMonth}>‹</NavButtonSmall>
                  <h3>{lunarDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</h3>
                  <NavButtonSmall onClick={handleNextMonth}>›</NavButtonSmall>
                </MonthNavigator>
              </LunarInfoDisplay>
            </CalendarDial>
          </CalendarColumn>
        </LayoutGrid>
    </SectionContainer>
  );
};

export default SovietCalendarSection;