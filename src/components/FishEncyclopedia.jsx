// src/components/FishEncyclopedia.jsx

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { FiSunrise, FiSun, FiSunset, FiMoon } from 'react-icons/fi';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useData } from '../context/DataContext';

const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

// --- СТИЛИ ---
const PageContainer = styled.section`
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
  position: relative;
  background: #f0f4f8;
  font-family: 'Montserrat', sans-serif;

  @media (max-width: 48rem) {
    flex-direction: column;
    height: auto;
    background: transparent;
  }
`;

const FishListWrapper = styled.div`
  display: contents; 

  @media (max-width: 48rem) {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0 0.25rem;
    background: #f0f4f8;
    border-bottom: 1px solid #e5e7eb;
    flex-shrink: 0;
  }
`;

const FishList = styled.ul`
  list-style: none;
  padding: 2rem 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  flex-basis: 30%;
  height: 100%;
  z-index: 10;
  padding-left: 5%;
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 0.25rem; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #ddd; border-radius: 0.125rem; }

  @media (max-width: 48rem) {
    flex-basis: auto;
    flex-grow: 1;
    flex-shrink: 1;
    flex-direction: row;
    height: auto;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5rem 0;
    white-space: nowrap;
    border-bottom: none;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
    background: transparent;
  }
`;

const NavButton = styled.button`
  display: none;
  
  @media (max-width: 48rem) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    background: transparent;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease-out;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      opacity: 0.6;
    }
    
    &:active {
      transform: scale(0.9);
      opacity: 0.8;
    }
    
    &:focus, &:focus-visible {
      outline: none;
    }
  }
`;

const FishListItem = styled.li`
  font-size: 2.2rem;
  font-weight: 900;
  cursor: pointer;
  text-transform: uppercase;
  line-height: 1.5;
  transition: all 0.4s ease;
  color: #dbe1e8;

  &.active, &:hover {
    color: #0a111a;
  }

  @media (max-width: 48rem) {
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
    display: inline-block;
  }
`;

const ContentArea = styled.div`
  flex-basis: 70%;
  position: relative;
  width: 100%;
  height: 100%;

  @media (max-width: 48rem) {
    flex-grow: 0; 
    height: auto;
    overflow: hidden;
    background: #f0f4f8;
  }
`;

const TextColumn = styled.div`
  text-align: left;
  @media (max-width: 48rem) {
    text-align: center;
    &:nth-of-type(1) { grid-area: col1; }
    &:nth-of-type(2) { grid-area: col2; }
  }
`;

const InfoSubBlock = styled.div`
  margin-bottom: 2rem;
  &:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 48rem) {
    margin-bottom: clamp(0.5rem, 1.5vmin, 1rem);
  }
`;

const FishImageContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  max-width: 35rem;

  img {
    max-width: 100%;
    max-height: 35vh;
    min-height: 15rem;
    width: auto;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 1.25rem 1.875rem rgba(0,0,0,0.2));
  }
  
  @media (max-width: 48rem) {
    grid-area: image;
    width: 100%;
    max-width: 18.75rem;
    margin: 0 auto; /* <-- ВОТ ЭТА ВОЗВРАЩЕННАЯ СТРОКА */
    img {
      max-height: 25vmin;
      min-height: auto;
    }
  }
`;

const InfoTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: #1c2a3a;
  @media (max-width: 48rem) {
    grid-area: title;
    font-size: clamp(1.5rem, 6vmin, 2.5rem);
    margin-bottom: 0;
  }
`;

const PrimaryDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #3d4852;
  max-width: 37.5rem;
  margin: 0 auto 1.5rem auto;
  @media (max-width: 48rem) {
    grid-area: desc;
    font-size: clamp(0.75rem, 2.5vmin, 0.9rem);
    line-height: 1.4;
    margin: 0 auto;
  }
`;

const WidgetsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2.5rem;
  margin-top: 1rem;
  @media (max-width: 48rem) {
    grid-area: widgets;
    flex-direction: column;
    align-items: center;
    gap: clamp(0.5rem, 1.5vmin, 1.5rem);
    margin-top: 0;
  }
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 6rem;
  align-items: start;
  flex-grow: 1;
  min-height: 0;

  @media (max-width: 48rem) {
    display: contents;
  }
`;

const BottomSection = styled.div`
  flex-shrink: 0;
  text-align: center;
  padding: 2rem 0;

  @media (max-width: 48rem) {
    display: contents;
  }
`;

const FishDisplay = styled(motion.div)`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 2rem 5% 2rem 2rem;
  
  @media (max-width: 48rem) {
    position: static;
    padding: 1rem;
    padding-top: clamp(1rem, 4vh, 2.5rem);
    padding-bottom: clamp(1rem, 4vh, 2.5rem);
    
    display: grid;
    align-content: start;
    gap: clamp(0.5rem, 2vmin, 1.5rem);
    
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "image   image"
      "title   title"
      "desc    desc"
      "col1    col2"
      "widgets widgets";
  }
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: #5a6470;
  @media (max-width: 48rem) {
    font-size: clamp(0.7rem, 2.2vmin, 0.85rem);
    line-height: 1.4;
  }
`;
const InfoSubtitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 700;
  color: #F9A826;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.0625rem;
  @media (max-width: 48rem) {
    font-size: clamp(0.7rem, 2.4vmin, 0.9rem);
    margin-bottom: 0.25rem;
  }
`;
const InlineWidgetsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  @media (max-width: 48rem) {
    gap: 1.5rem;
    align-items: flex-start;
  }
`;
const Widget = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: clamp(7rem, 22vmin, 8.75rem);
`;
const BiteChart = styled.div`
  position: relative;
  width: clamp(7rem, 22vmin, 8.75rem);
  height: clamp(7rem, 22vmin, 8.75rem);
`;
const MonthLabel = styled.span`
  position: absolute;
  font-size: clamp(0.6rem, 1.8vmin, 0.7rem);
  color: ${({ $isActive }) => $isActive ? '#fff' : '#aaa'};
  font-weight: 700;
  left: 50%; top: 50%;
  width: clamp(1.5rem, 4.5vmin, 1.75rem);
  height: clamp(1.5rem, 4.5vmin, 1.75rem);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background-color: ${({ $isActive }) => $isActive ? '#F9A826' : 'rgba(0,0,0,0.03)'};
  transform: ${({ $angle }) => `rotate(${$angle}deg) translate(clamp(2.75rem, 8.5vmin, 3.5rem)) rotate(-${$angle}deg)`};
  transform-origin: 0 0;
  transition: all 0.4s ease;
`;
const StarsContainer = styled.div`
  display: flex; gap: 0.5rem;
  font-size: clamp(1.2rem, 4.5vmin, 1.5rem);
  color: #F9A826; margin-top: 0.5rem;
  height: clamp(2.5rem, 8vmin, 4.375rem); align-items: center;
`;
const PeakTimeContainer = styled.div`
  display: flex; gap: clamp(0.5rem, 2vmin, 1rem);
  font-size: clamp(1.2rem, 4.5vmin, 1.5rem); margin-top: 0.5rem;
  height: clamp(2.5rem, 8vmin, 4.375rem); align-items: center;
`;
const TimeIcon = styled.div`
  color: ${({ $isActive }) => $isActive ? '#1c2a3a' : '#ddd'};
  transition: color 0.5s;
`;

// --- КОМПОНЕНТЫ ВИДЖЕТОВ ---
const BiteCircle = ({ activeMonths = [] }) => { const segmentAngle = 360 / 12; return ( <BiteChart> {months.map((month, i) => ( <MonthLabel key={month} $angle={i * segmentAngle} $isActive={activeMonths.includes(i + 1)}> {month} </MonthLabel> ))} </BiteChart> ); };
const DifficultyWidget = ({ level = 1 }) => ( <Widget> <InfoSubtitle>Сложность</InfoSubtitle> <StarsContainer> {Array.from({ length: 3 }).map((_, i) => ( i < level ? <BsStarFill key={i} /> : <BsStar key={i} style={{ color: '#e0e0e0' }} /> ))} </StarsContainer> </Widget> );
const PeakTimeWidget = ({ peakTime = [] }) => { const times = [ { icon: <FiSunrise />, period: 'morning' }, { icon: <FiSun />, period: 'day' }, { icon: <FiSunset />, period: 'evening' }, { icon: <FiMoon />, period: 'night' }, ]; return ( <Widget> <InfoSubtitle>Время клёва</InfoSubtitle> <PeakTimeContainer> {times.map(t => <TimeIcon key={t.period} $isActive={peakTime.includes(t.period)}>{t.icon}</TimeIcon>)} </PeakTimeContainer> </Widget> ); };

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const FishEncyclopedia = () => {
  const { appData } = useData();
  const [selectedId, setSelectedId] = useState(null);
  const fishData = appData?.fishData || [];
  const listRef = useRef(null);

  useEffect(() => {
    if (fishData.length > 0 && selectedId === null) {
      setSelectedId(fishData[0].id);
    }
  }, [fishData, selectedId]);
  
  const activeFish = fishData.find(f => f.id === selectedId);
  const contentVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.7, ease: "easeInOut" } }, exit: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }, };

  const scroll = (direction) => {
    if (listRef.current) {
      const scrollAmount = 200;
      listRef.current.scrollLeft += direction === 'right' ? scrollAmount : -scrollAmount;
    }
  };

  if (fishData.length === 0) {
    return (
        <PageContainer>
            <div style={{margin: 'auto', textAlign: 'center', fontFamily: "'Montserrat', sans-serif"}}>
                <h2 style={{fontSize: '2.4rem', color: '#1c2a3a'}}>Энциклопедия Рыб</h2>
                <p style={{fontSize: '1.6rem', color: '#5a6470'}}>Данные о рыбах загружаются...</p>
            </div>
        </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FishListWrapper>
        <NavButton onClick={() => scroll('left')}>
          <IoChevronBack size={28} color="#4a5568" />
        </NavButton>
        <FishList ref={listRef}>
          {fishData.map(fish => (
            <FishListItem key={fish.id} className={fish.id === selectedId ? 'active' : ''} onClick={() => setSelectedId(fish.id)}>
              {fish.name}
            </FishListItem>
          ))}
        </FishList>
        <NavButton onClick={() => scroll('right')}>
          <IoChevronForward size={28} color="#4a5568" />
        </NavButton>
      </FishListWrapper>
      <ContentArea>
        <AnimatePresence mode="wait">
          {activeFish && (
            <FishDisplay key={activeFish.id} variants={contentVariants} initial="initial" animate="animate" exit="exit">
              
              <TopSection>
                <TextColumn>
                  <InfoSubBlock><InfoSubtitle>Среда обитания</InfoSubtitle><InfoText>{activeFish.habitat}</InfoText></InfoSubBlock>
                  <InfoSubBlock><InfoSubtitle>Основные места</InfoSubtitle><InfoText>{activeFish.locations}</InfoText></InfoSubBlock>
                </TextColumn>
                <FishImageContainer> <img src={activeFish.image} alt={activeFish.name} /> </FishImageContainer>
                <TextColumn>
                  <InfoSubBlock><InfoSubtitle>Снасти</InfoSubtitle><InfoText>{activeFish.tackle}</InfoText></InfoSubBlock>
                  <InfoSubBlock><InfoSubtitle>Наживка</InfoSubtitle><InfoText>{activeFish.bait}</InfoText></InfoSubBlock>
                </TextColumn>
              </TopSection>

              <BottomSection>
                <InfoTitle>{activeFish.name}</InfoTitle>
                <PrimaryDescription>{activeFish.description}</PrimaryDescription>
                <WidgetsContainer>
                  <InlineWidgetsWrapper>
                    <DifficultyWidget level={activeFish.difficulty} />
                    <PeakTimeWidget peakTime={activeFish.peakTime} />
                  </InlineWidgetsWrapper>
                  <Widget><InfoSubtitle>Календарь клёва</InfoSubtitle><BiteCircle activeMonths={activeFish.biteMonths} /></Widget>
                </WidgetsContainer>
              </BottomSection>
              
            </FishDisplay>
          )}
        </AnimatePresence>
      </ContentArea>
    </PageContainer>
  );
};

export default FishEncyclopedia;