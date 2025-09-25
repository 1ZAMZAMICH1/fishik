// src/components/HydrographyAtlas.jsx

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

// --- ИМПОРТЫ ---
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Твой рабочий ключ Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiemFtemFtaWNoIiwiYSI6ImNtZjVjdjNtazA0dWcybHM4bm9vZTBtamcifQ.xqkEctPIz6_ZCSemEwDa4g';

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---
const PageContainer = styled.section`
  height: 100vh;
  width: 100vw;
  display: flex;
  position: relative;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;

  @media (max-width: 48rem) {
    flex-direction: column;
  }
`;

const SidePanel = styled(motion.div)`
  flex-shrink: 0;
  width: 30%;
  height: 100%;
  background-color: #f0f4f8;
  padding: 1.5rem 3rem; 
  display: flex;
  flex-direction: column;
  box-shadow: 0.3125rem 0 1.875rem rgba(0,0,0,0.1);
  z-index: 100;
  box-sizing: border-box;

  @media (max-width: 48rem) {
    width: 100%;
    height: auto;
    padding: 1.5rem;
    box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.1);
  }
`;

const Header = styled.div`
  color: #1c2a3a;
  margin-bottom: 1.5rem; 
  flex-shrink: 0;

  @media (max-width: 48rem) {
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  text-transform: uppercase;

  @media (max-width: 48rem) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: #5a6470;
  margin-top: 0.5rem;
  
  @media (max-width: 48rem) {
    font-size: 0.9rem;
  }
`;

const LocationsList = styled.ul`
  list-style: none;
  padding: 0 1rem 0 0;
  margin: 0;
  flex: 1; 
  overflow-y: auto;
  min-height: 0;
  scroll-behavior: smooth;

  /* Стили для Firefox */
  scrollbar-width: thin;
  scrollbar-color: #a8b1bb #f0f4f8;

  /* Стили для Chrome, Safari, Edge */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f4f8; /* Фон трека в цвет панели */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c5cdd5; /* Цвет "палки" */
    border-radius: 4px;
    border: 2px solid #f0f4f8; /* Отступ вокруг "палки", создающий эффект тонкости */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #a8b1bb; /* Цвет при наведении */
  }
  
  @media (max-width: 48rem) {
    flex: none;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    padding: 0.5rem 1.5rem;
    margin: 0 -1.5rem;
    
    /* Возвращаем стандартные стили для мобильной версии */
    scrollbar-width: auto;

    &::-webkit-scrollbar {
      height: 0.8rem;
      width: auto; /* Сброс ширины для горизонтального скролла */
    }
    &::-webkit-scrollbar-track {
      background: #e9edf2;
      border-radius: 0.4rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #F9A826;
      border-radius: 0.4rem;
      border: 2px solid #f0f4f8;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #e0930a;
    }
  }
`;

const LocationButton = styled.button` 
  font-family: 'Montserrat', sans-serif; 
  width: 100%;
  text-align: left;
  font-size: 1.3rem;
  padding: 0.9rem 1.5rem;
  margin-bottom: 0.8rem; 
  font-weight: 900; 
  text-transform: uppercase;
  border-radius: 0.75rem;
  border: none;
  background: transparent;
  color: #5a6470; 
  opacity: 0.5;
  cursor: pointer;
  transition: all 0.3s ease; 
  
  &:hover {
    opacity: 1;
    background-color: #e1e7ee;
  } 
  
  &.active { 
    opacity: 1;
    color: #fff;
    background-color: #F9A826; 
    transform: translateX(0.625rem);
    box-shadow: 0 0.625rem 1.25rem rgba(249, 168, 38, 0.3);
  } 

  @media (max-width: 48rem) {
    display: inline-block;
    width: auto;
    font-size: 1rem;
    padding: 0.75rem 1rem;
    margin-bottom: 0;
    margin-right: 0.75rem;

    &.active {
      transform: translateX(0) translateY(-0.25rem);
    }
  }
`;

const MapArea = styled.div`
  flex-grow: 1;
  height: 100%;
  position: relative;
  z-index: 1;

  .mapboxgl-ctrl-bottom-left,
  .mapboxgl-ctrl-bottom-right {
    display: none;
  }
`;

const RouteBuilderPanel = styled.div`
  padding-top: 1.25rem; 
  border-top: 2px solid #e1e7ee;
  flex-shrink: 0;

  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1c2a3a;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  @media (max-width: 48rem) {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    text-align: center;
  }
`;

const RouteButtonContainer = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 48rem) {
    justify-content: center;
  }
`;

const RouteLink = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background-color: #1c2a3a;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #F9A826;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }
`;

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const HydrographyAtlas = () => {
  const { appData } = useData();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [activeLocation, setActiveLocation] = useState(null);
  const [isFlying, setIsFlying] = useState(false);
  const timeoutId = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const locationsData = appData?.atlasLocationsData || [];

  useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (locationsData.length > 0 && !activeLocation) {
      setActiveLocation(locationsData[0]);
    }
  }, [locationsData, activeLocation]);

  useEffect(() => {
    if (mapRef.current || locationsData.length === 0) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current, style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [68.7, 43.0], zoom: 7, pitch: 45, bearing: -17.6,
      antialias: true, maxBounds: [[65, 40], [72, 46]],
      attributionControl: false,
    });

    mapRef.current.on('load', () => {
      mapRef.current.addLayer({'id': 'water-styled', 'type': 'fill', 'source': 'composite', 'source-layer': 'water', 'paint': { 'fill-color': '#003f5c', 'fill-opacity': 0.7 }});
      mapRef.current.addLayer({'id': 'waterway-styled', 'type': 'line', 'source': 'composite', 'source-layer': 'waterway', 'paint': { 'line-color': '#003f5c', 'line-width': 2, 'line-opacity': 0.8 }});
      mapRef.current.addLayer({'id': 'water-highlight-blur', 'type': 'line', 'source': 'composite', 'source-layer': 'waterway', 'paint': { 'line-color': '#00f2ff', 'line-width': 15, 'line-opacity': 0, 'line-blur': 20 }});
      mapRef.current.addLayer({'id': 'water-highlight-main', 'type': 'line', 'source': 'composite', 'source-layer': 'waterway', 'paint': { 'line-color': '#ffffff', 'line-width': 4, 'line-opacity': 0 }});
      
      if (locationsData.length > 0) {
        flyToLocation(locationsData[0], 6000);
      }
    });

    return () => { 
        if(timeoutId.current) clearTimeout(timeoutId.current);
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } 
    };
  }, [locationsData]);

  const flyToLocation = (location, duration = 4000) => {
    if (isFlying || !mapRef.current || !mapRef.current.isStyleLoaded()) return;

    setIsFlying(true);
    setActiveLocation(location);
    
    mapRef.current.once('moveend', () => {
        setIsFlying(false);
    });
    
    if (location.bbox) {
        const bboxParts = location.bbox.split(',').map(s => parseFloat(s.trim()));
        const bboxFormatted = [[bboxParts[0], bboxParts[1]], [bboxParts[2], bboxParts[3]]];
        mapRef.current.fitBounds(bboxFormatted, { duration, pitch: 45, padding: 50, essential: true });
    } else {
        mapRef.current.flyTo({ ...location, duration, essential: true, easing: (t) => t * (2 - t) });
    }

    const filter = ['==', ['get', 'name:en'], location.name_en];
    if (timeoutId.current) clearTimeout(timeoutId.current);

    mapRef.current.setFilter('water-highlight-blur', filter);
    mapRef.current.setFilter('water-highlight-main', filter);
    mapRef.current.setPaintProperty('water-highlight-blur', 'line-opacity', 0.8);
    mapRef.current.setPaintProperty('water-highlight-main', 'line-opacity', 1);

    timeoutId.current = setTimeout(() => {
        if (!mapRef.current) return;
        mapRef.current.setPaintProperty('water-highlight-blur', 'line-opacity', 0);
        mapRef.current.setPaintProperty('water-highlight-main', 'line-opacity', 0);
    }, duration + 1000);
  };

  const getRouteLinks = () => {
    if (!activeLocation || !activeLocation.center) {
      return null;
    }

    const [lon, lat] = activeLocation.center;

    const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    const yandexUrl = `https://yandex.ru/maps/?rtext=~${lat},${lon}`;
    const gisUrl = `https://2gis.ru/routeSearch/rsType/car/to/${lon},${lat}`;

    return (
      <RouteBuilderPanel>
        <h3>Проложить маршрут</h3>
        <RouteButtonContainer>
          <RouteLink href={googleUrl} target="_blank" rel="noopener noreferrer">Google</RouteLink>
          <RouteLink href={yandexUrl} target="_blank" rel="noopener noreferrer">Яндекс</RouteLink>
          <RouteLink href={gisUrl} target="_blank" rel="noopener noreferrer">2ГИС</RouteLink>
        </RouteButtonContainer>
      </RouteBuilderPanel>
    );
  };

  if (locationsData.length === 0) {
    return <div>Загрузка карты...</div>;
  }

  return (
    <PageContainer>
      <SidePanel 
        initial={isMobile ? { y: '-100%' } : { x: '-100%' }}
        animate={{ y: '0%', x: '0%' }}
        transition={{ duration: 0.8, ease: [0.6, 0.01, -0.05, 0.9] }}
      >
        <Header>
          <Title>Карта Рыболова</Title>
          <Subtitle>Интерактивный атлас Туркестанской области</Subtitle>
        </Header>
        <LocationsList>
          {locationsData.map(loc => (
            <LocationButton key={loc.id} onClick={() => flyToLocation(loc)} className={activeLocation?.id === loc.id ? 'active' : ''}>
              {loc.name}
            </LocationButton>
          ))}
        </LocationsList> 
        
        {getRouteLinks()}

      </SidePanel>
      <MapArea ref={mapContainerRef} />
    </PageContainer>
  );
};

export default HydrographyAtlas;