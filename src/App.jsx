// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

// Импорты всех компонентов
import HeroSection from './components/HeroSection';
import InfoBanner from './components/InfoBanner';
import LocationsSection from './components/LocationsSection';
import FishEncyclopedia from './components/FishEncyclopedia';
import SovietCalendarSection from './components/SovietCalendarSection';
import LicenseSection from './components/LicenseSection';
import PoachingReportBanner from './components/PoachingReportBanner';
import ArticlesSection from './components/ArticlesSection';
import Footer from './components/Footer';
import AllLocationsPage from './components/AllLocationsPage';
import AllArticlesPage from './components/AllArticlesPage';
import HydrographyAtlas from './components/HydrographyAtlas';
//import './i18n';//

// Импорты компонентов админки
import AdminLayout from './components/admin/AdminLayout';
import EditLocations from './components/admin/EditLocations';
import EditFish from './components/admin/EditFish';
import EditArticles from './components/admin/EditArticles';
import EditBanner from './components/admin/EditBanner';
import EditCalendar from './components/admin/EditCalendar';
import EditModals from './components/admin/EditModals';
import EditMap from './components/admin/EditMap';

// Импорты для аутентификации
import Login from './components/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';


import './App.css';

const MainPage = () => (
  <>
    <HeroSection />
    <InfoBanner />
    <LocationsSection />
    <FishEncyclopedia />
    <HydrographyAtlas />
    <SovietCalendarSection />
    <LicenseSection />
    <PoachingReportBanner />
    <ArticlesSection />
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <div className="App">
          <Routes>
            {/* Роуты для публичной части сайта */}
            <Route path="/" element={<MainPage />} />
            <Route path="/locations" element={<AllLocationsPage />} />
            <Route path="/map" element={<HydrographyAtlas />} />
            <Route path="/articles" element={<AllArticlesPage />} />
            
            {/* Роут для страницы входа */}
            <Route path="/login" element={<Login />} />
            
            {/* Защищенные роуты для админки */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<EditLocations />} />
                <Route path="locations" element={<EditLocations />} />
                <Route path="modals" element={<EditModals />} />
                <Route path="map-data" element={<EditMap />} />
                <Route path="fish" element={<EditFish />} />
                <Route path="articles" element={<EditArticles />} />
                <Route path="banner" element={<EditBanner />} />
                <Route path="calendar" element={<EditCalendar />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;