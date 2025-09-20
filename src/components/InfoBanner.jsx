// src/components/InfoBanner.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa';
import { useData } from '../context/DataContext';

const InfoBanner = () => {
  const { appData } = useData();

  const styles = `
    .info-banner-section { width: 100%; background-color: #F8F9FA; padding: 40px 60px; box-sizing: border-box; border-top: 1px solid #E5E7EB; border-bottom: 1px solid #E5E7EB; }
    .banner-content { display: flex; justify-content: space-around; align-items: center; gap: 40px; max-width: 1400px; margin: 0 auto; flex-wrap: wrap; }
    .info-block { display: flex; align-items: center; gap: 20px; flex: 1; min-width: 300px; }
    .info-icon { font-size: 40px; color: #F2994A; flex-shrink: 0; }
    .info-text h4 { font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 900; color: #1A2E40; margin: 0 0 5px 0; }
    .info-text p { font-family: 'Montserrat', sans-serif; font-size: 15px; line-height: 1.6; color: #4B5563; margin: 0; }
  `;

  if (!appData || !appData.bannerData) {
    return null; // Если данных нет, просто не показываем баннер
  }

  const { spawning, cleanup } = appData.bannerData;

  return (
    <>
      <style>{styles}</style>
      <motion.section
        className="info-banner-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <div className="banner-content">
          <div className="info-block">
            <div className="info-icon"><FaExclamationTriangle /></div>
            <div className="info-text">
              <h4>{spawning.title}</h4>
              <p>{spawning.text}</p>
            </div>
          </div>
          <div className="info-block">
            <div className="info-icon"><FaTrashAlt /></div>
            <div className="info-text">
              <h4>{cleanup.title}</h4>
              <p>{cleanup.text}</p>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default InfoBanner;