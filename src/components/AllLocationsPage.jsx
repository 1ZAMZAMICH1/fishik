// src/components/AllLocationsPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import LocationModal from './LocationModal';
import { useData } from '../context/DataContext';

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #263238;
  font-family: 'Montserrat', sans-serif;
  color: #ECEFF1;
  padding: 2.5rem 3.75rem;

  @media (max-width: 48rem) {
    padding: 2rem 1.5rem;
  }
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid #455A64;
  padding-bottom: 1.25rem;
  
  h1 {
    font-size: 3rem;
    font-weight: 900;
    color: #fff;
    text-transform: uppercase;
    margin: 0;
  }

  @media (max-width: 48rem) {
    margin-bottom: 2rem;
    h1 {
      font-size: 2.5rem;
    }
  }
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 0.625rem 1.25rem;
  border: 1px solid #B0BEC5;
  color: #B0BEC5;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 700;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: #FFAB40;
    border-color: #FFAB40;
    color: #263238;
  }

  @media (max-width: 48rem) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(21.875rem, 1fr));
  gap: 1.875rem;

  @media (max-width: 48rem) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const LocationCard = styled.div`
  background-color: #37474F;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 48rem) {
    &:hover {
      transform: translateY(0);
    }
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 13.75rem;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1.5625rem;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.625rem 0;
  }
  
  p {
    font-size: 0.9375rem;
    line-height: 1.6;
    color: #ECEFF1;
    margin: 0;
  }

  @media (max-width: 48rem) {
    padding: 1.25rem;
    h3 { font-size: 1.25rem; }
  }
`;


const AllLocationsPage = () => {
  const { appData } = useData();
  const [selectedLocation, setSelectedLocation] = useState(null);

  if (!appData || !appData.locationsData) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#263238', color: 'white', fontFamily: 'Montserrat'}}>
            Загрузка локаций...
        </div>
    );
  }
  
  const locationsData = appData.locationsData;

  return (
    <>
      <PageContainer>
        <PageHeader>
          <h1>Все Локации</h1>
          <BackButton to="/">← Назад на главную</BackButton>
        </PageHeader>
        <LocationsGrid>
          {locationsData.map(location => (
            <LocationCard
              key={location.id}
              onClick={() => setSelectedLocation(location)}
            >
              <CardImage src={location.image} alt={location.title} />
              <CardContent>
                <h3>{location.title.replace(/\\n/g, ' ')}</h3>
                <p>{location.description.substring(0, 100)}...</p>
              </CardContent>
            </LocationCard>
          ))}
        </LocationsGrid>
      </PageContainer>
      
      <AnimatePresence>
        {selectedLocation && (
          <LocationModal
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AllLocationsPage;