// src/components/LocationsSection.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const VISIBLE_CARDS = 4;
const transition = { duration: 0.8, ease: [0.6, 0.01, -0.05, 0.9] };

const AnimatedBackground = ({ location }) => ( <motion.div layoutId={`card-container-${location.id}`} className="background-image-wrapper" transition={transition}> <div className="overlay" /> <motion.div layoutId={`card-image-${location.id}`} className="background-image" style={{ backgroundImage: `url(${location.image})` }} transition={transition} /> </motion.div> );
const Card = ({ location, onClick }) => ( <motion.div layoutId={`card-container-${location.id}`} className="location-card" onClick={onClick} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.3 } }} transition={transition}> <motion.div layoutId={`card-image-${location.id}`} className="location-card-image" style={{ backgroundImage: `url(${location.image})`, backgroundPosition: location.cardPosition || 'center', }} transition={transition} /> <div className="location-card-overlay" /> <h3 className="card-title">{location.cardTitle.replace(/\\n/g, '\n')}</h3> </motion.div> );

const LocationsSection = () => {
  const { appData } = useData();
  const locationsData = appData?.locationsData;
  const [locations, setLocations] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => { if (locationsData && locationsData.length > 0) { setLocations(locationsData); } }, [locationsData]);
  
  if (!locations || locations.length === 0) { return ( <section style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a1a', color: 'white', fontFamily: 'Montserrat', fontSize: '1.25rem'}}> Загрузка локаций... </section> ); }

  const activeLocation = locations[0];
  const visibleCards = locations.slice(1, VISIBLE_CARDS + 1);
  const activeIndexInInitial = locationsData.findIndex(item => item.id === activeLocation.id);

  const rotate = (newLocations) => { if (isAnimating) return; setIsAnimating(true); setLocations(newLocations); setTimeout(() => setIsAnimating(false), 800); };
  const handleNext = () => { const newLocations = [...locations]; newLocations.push(newLocations.shift()); rotate(newLocations); };
  const handlePrev = () => { const newLocations = [...locations]; newLocations.unshift(newLocations.pop()); rotate(newLocations); };
  const handleClickCard = (cardId) => { const cardIndex = locations.findIndex(loc => loc.id === cardId); if (cardIndex <= 0) return; const newLocations = [...locations]; const toMove = newLocations.splice(0, cardIndex); const reordered = [...newLocations, ...toMove]; rotate(reordered); };
  
  const styles = `
    /* ... стили для десктопа без изменений ... */
    :root { --text-vertical-offset: -2.5rem; --carousel-vertical-offset: 3.125rem; --tagline-margin-bottom: 1.875rem; }
    .view-all-button { position: absolute; top: 2.5rem; right: 3.125rem; z-index: 10; padding: 0.75rem 1.5rem; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); color: #fff; text-decoration: none; font-weight: 700; border-radius: 0.25rem; transition: all 0.3s ease; }
    .locations-container { position: relative; width: 100vw; height: 100vh; background-color: #1a1a1a; overflow: hidden; font-family: 'Montserrat', sans-serif; color: white; }
    .background-image-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
    .background-image { width: 100%; height: 100%; background-size: cover; background-position: center; }
    .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.40); z-index: 1; }
    .content-wrapper { position: absolute; z-index: 2; top: 50%; left: 10%; transform: translateY(calc(-50% + var(--text-vertical-offset))); max-width: 31.25rem; }
    .text-content { color: white; }
    .tagline { font-size: 0.875rem; font-weight: 700; color: #F2994A; letter-spacing: 0.0625rem; margin-bottom: var(--tagline-margin-bottom); }
    .main-title { font-size: 6.25rem; font-weight: 900; line-height: 1; margin-bottom: 1.875rem; white-space: pre-wrap; }
    .description { font-size: 1rem; line-height: 1.6; max-width: 25rem; color: rgba(255, 255, 255, 0.9); }
    .carousel-wrapper { position: absolute; z-index: 2; bottom: 8%; right: 10%; transform: translateY(var(--carousel-vertical-offset)); display: flex; flex-direction: column; align-items: flex-end; }
    .cards-row { display: flex; gap: 1.25rem; }
    .location-card { width: 11.25rem; height: 15.625rem; border-radius: 1rem; overflow: hidden; position: relative; cursor: pointer; box-shadow: 0 0.625rem 1.875rem rgba(0,0,0,0.3); }
    .location-card-image { width: 100%; height: 100%; background-size: cover; }
    .location-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%); }
    .card-title { position: absolute; bottom: 1.25rem; left: 1.25rem; right: 1.25rem; font-size: 1.375rem; font-weight: 700; line-height: 1.2; white-space: pre-wrap; }
    .navigation-controls { display: flex; align-items: center; gap: 0.9375rem; margin-top: 1.5625rem; }
    .nav-arrow { width: 3.125rem; height: 3.125rem; border: 1px solid rgba(255,255,255,0.5); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: all 0.3s ease; background: transparent; color: white; }
    .progress-bar-container { width: 7.5rem; height: 0.125rem; background-color: rgba(255,255,255,0.3); }
    .progress-bar { height: 100%; background-color: #F2994A; transition: width 0.5s ease-out; }

    /* --- АДАПТАЦИЯ ДЛЯ ТЕЛЕФОНОВ --- */
    @media (max-width: 48rem) {
      .locations-container { 
        display: flex; flex-direction: column;
        justify-content: space-between; /* Распределяем пространство */
        padding: 2.5rem 0; box-sizing: border-box; 
      }
      
      .content-wrapper {
        position: static; transform: none; text-align: center;
        width: 100%; max-width: 100%; padding: 0 1.5rem; box-sizing: border-box;
        margin-top: 15rem; /* <-- ВОТ ФИКС №1: Опускаем текст вниз */
      }

      .main-title { font-size: 3rem; }
      .description { font-size: 0.875rem; max-width: 100%; }
      
      .carousel-wrapper {
        position: static; transform: none; width: 100%;
        align-items: center; padding: 0 0 1.5rem 0;
      }
      
      .cards-row {
        width: 100%; overflow-x: auto;
        padding: 0 1.5rem; box-sizing: border-box;
        -ms-overflow-style: none; scrollbar-width: none;
      }
      .cards-row::-webkit-scrollbar { display: none; }
      
      .location-card { flex-shrink: 0; }
      
      .navigation-controls { justify-content: center; }

      .view-all-button {
        /* <-- ВОТ ФИКС №2: Возвращаем кнопку наверх */
        position: absolute; 
        top: 1.5rem; 
        left: 50%;
        transform: translateX(-50%);
        right: auto; /* Сбрасываем правый отступ */
      }
    }
  `;

  return ( <LayoutGroup> <style>{styles}</style> <section className="locations-container"> <Link to="/locations" className="view-all-button">Все Места</Link> <AnimatePresence><AnimatedBackground key={activeLocation.id} location={activeLocation} /></AnimatePresence> <div className="content-wrapper"> <AnimatePresence> <motion.div className="text-content" key={activeLocation.id} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.4 } }} exit={{ opacity: 0, transition: { duration: 0.3 } }}> <p className="tagline">{activeLocation.tagline}</p> <h2 className="main-title">{activeLocation.title.replace(/\\n/g, '\n')}</h2> <p className="description">{activeLocation.description}</p> </motion.div> </AnimatePresence> </div> <div className="carousel-wrapper"> <div className="cards-row"> <AnimatePresence> {visibleCards.map((location) => ( <Card key={location.id} location={location} onClick={() => handleClickCard(location.id)} /> ))} </AnimatePresence> </div> <div className="navigation-controls"> <button className="nav-arrow" onClick={handlePrev}><svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 15L1.5 8L8.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button> <div className="progress-bar-container"> <div className="progress-bar" style={{width: `${((activeIndexInInitial + 1) / locationsData.length) * 100}%`}}></div> </div> <button className="nav-arrow" onClick={handleNext}><svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 1L8.5 8L1.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button> </div> </div> </section> </LayoutGroup> );
};
export default LocationsSection;