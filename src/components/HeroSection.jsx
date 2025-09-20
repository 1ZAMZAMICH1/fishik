// src/components/HeroSection.jsx

import React from 'react';
import { motion } from 'framer-motion';
import backgroundImage from '/assets/fishing-background.jpg';
import catfishImage from '/assets/catfish.png';

const SvgDefinitions = () => ( <svg width="0" height="0" style={{ position: 'absolute' }}> <defs> <clipPath id="wave-clip-path" clipPathUnits="objectBoundingBox"> <path d="M 0,0 H 0.8 C 0.7,0.2 0.85,0.4 0.75,0.5 S 0.7,0.8 0.8,1 H 0 Z" /> </clipPath> </defs> </svg> );

const ScrollDownIcon = () => (
  <motion.div className="scroll-down-icon" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}>
    <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
      <path d="M12 5V19M12 19L7 14M12 19L17 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </motion.svg>
  </motion.div>
);

const HeroSection = () => {
    const styles = `
    /* --- СТИЛИ ДЛЯ ДЕСКТОПА (без изменений) --- */
    .hero-container { position: relative; width: 100vw; height: 100vh; background-image: url(${backgroundImage}); background-size: cover; background-position: center; font-family: 'Montserrat', sans-serif; overflow: hidden; }
    .hero-container .white-overlay { position: absolute; top: 0; left: 0; width: 80%; height: 100%; background-color: white; z-index: 1; clip-path: url(#wave-clip-path); animation: slideInFromLeft 1s ease-out forwards; opacity: 0; }
    .hero-container .content-wrapper { position: absolute; top: 50%; left: 6%; transform: translateY(-50%); z-index: 3; color: #1A2E40; }
    .hero-container .tagline { font-size: 1rem; font-weight: 700; color: #F2994A; letter-spacing: 0.03125rem; margin-bottom: 1.25rem; animation: fadeInUp 0.8s ease-out 0.5s forwards; opacity: 0; }
    .hero-container .main-title { font-size: 5.25rem; font-weight: 900; line-height: 1.1; margin: 0; text-transform: uppercase; animation: fadeInUp 0.8s ease-out 0.7s forwards; opacity: 0; }
    .hero-container .subtitle { font-size: 1.75rem; font-weight: 700; margin-top: 1.5625rem; letter-spacing: 0.0625rem; animation: fadeInUp 0.8s ease-out 0.9s forwards; opacity: 0; }
    .hero-container .catfish { position: absolute; right: 2%; bottom: 0; width: 50%; max-width: 53.125rem; z-index: 2; animation: slideInFromRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards; opacity: 0; transform: translateX(6.25rem); }
    .hero-container .red-accent-bar { position: absolute; top: 0; left: 6%; width: 6.25rem; height: 0.3125rem; background-color: #D93A3A; z-index: 4; animation: fadeIn 0.5s ease-out 1.2s forwards; opacity: 0; }
    .scroll-down-icon { display: none; }
    
    @keyframes slideInFromLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideInFromRight { from { transform: translateX(6.25rem); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes fadeInUp { from { transform: translateY(1.875rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    
    @media (max-width: 75rem) { /* ... без изменений ... */ }
    
    /* --- ФИНАЛЬНАЯ ВЕРСИЯ АДАПТАЦИИ ДЛЯ ТЕЛЕФОНОВ --- */
    @media (max-width: 48rem) {
      .hero-container .white-overlay {
        width: 100%; height: 50%; top: 50%;
        background: linear-gradient(to top, white 80%, rgba(255,255,255,0) 100%);
        clip-path: none; animation: none; opacity: 1;
      }
      .hero-container .catfish {
        width: 150%; max-width: none;
        right: -50%; bottom: 20%;
        opacity: 0.15; z-index: 2;
        animation: none; transform: none;
      }
      .hero-container .content-wrapper {
        width: 90%; top: 38%;
        left: 50%; transform: translate(-50%, -50%);
        text-align: center; z-index: 3;
      }
      .hero-container .main-title, .hero-container .subtitle {
          color: white;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }

      /* --- ВОТ ФИКС ДЛЯ ЖЕЛТОГО ТЕКСТА --- */
      .hero-container .tagline { 
        font-size: 0.875rem; 
        color: #F2994A; 
        background-color: rgba(26, 46, 64, 0.7); /* Темная полупрозрачная плашка */
        padding: 0.25rem 0.75rem; /* Небольшие отступы */
        border-radius: 0.25rem; /* Скругленные углы */
        display: inline-block; /* Чтобы padding работал корректно */
      }

      .hero-container .main-title { font-size: 3rem; }
      .hero-container .subtitle { font-size: 1.25rem; }
      .hero-container .red-accent-bar { display: none; }
      
      .scroll-down-icon {
        display: block;
        position: absolute;
        bottom: 5%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;
      }
    }
    `;

    return ( 
      <> 
        <style>{styles}</style> 
        <SvgDefinitions />
        <section className="hero-container"> 
          <div className="red-accent-bar"></div> 
          <div className="white-overlay"></div> 
          <div className="content-wrapper"> 
            <p className="tagline">ТВОЙ КЛЮЧ К ЛУЧШИМ МЕСТАМ ДЛЯ РЫБАЛКИ</p> 
            <h1 className="main-title">РЫБОЛОВНЫЙ<br />ПУТЕВОДИТЕЛЬ</h1> 
            <p className="subtitle">ПО ТУРКЕСТАНСКОЙ ОБЛАСТИ</p> 
          </div> 
          <img src={catfishImage} alt="Большой сом на крючке" className="catfish" /> 
          <ScrollDownIcon />
        </section> 
      </> 
    );
};

export default HeroSection;