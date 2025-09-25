// src/components/admin/AdminLayout.jsx

import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaFish, FaMapMarkedAlt, FaNewspaper, FaCalendarAlt, FaHome, FaExclamationCircle, FaSignOutAlt, FaGlobeEurope } from 'react-icons/fa';

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---

const AdminPanel = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Montserrat', sans-serif;

  @media (max-width: 48rem) {
    flex-direction: column-reverse;
  }
`;

const AdminSidebar = styled.nav`
  flex: 0 0 280px;
  background-color: #fff;
  border-right: 1px solid #e5e7eb;
  padding: 30px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  @media (max-width: 48rem) {
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    padding: 0;
    border-right: none;
    border-top: 1px solid #e5e7eb;
    position: sticky;
    bottom: 0;
    z-index: 1000;
  }
`;

const AdminSidebarHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  h2 {
    font-size: 28px;
    font-weight: 900;
    color: #1A2E40;
  }
  span {
    color: #F2994A;
  }

  @media (max-width: 48rem) {
    display: none;
  }
`;

const AdminNav = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  a, button {
    display: flex;
    align-items: center;
    gap: 15px;
    color: #4B5563;
    text-decoration: none;
    padding: 15px 20px;
    border-radius: 8px;
    font-weight: 700;
    transition: all 0.2s ease;
    font-size: 16px;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
  }
  a:hover, button:hover {
    background-color: #f0f4f8;
    color: #1A2E40;
  }
  a.active {
    background-color: #1A2E40;
    color: #fff;
  }
  .nav-icon {
    font-size: 20px;
  }

  @media (max-width: 48rem) {
    flex-direction: row;
    justify-content: space-around;
    padding: 0.5rem;
    gap: 0;
    
    a, button {
      flex-direction: column;
      padding: 0.5rem;
      gap: 4px;
      font-size: 0.75rem;
    }
    
    .nav-text {
      display: none;
    }
  }
`;

const AdminSidebarFooter = styled.div`
  margin-top: auto;
  text-align: center;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #4B5563;
    text-decoration: none;
    padding: 10px;
    border-radius: 6px;
    font-weight: 700;
    transition: background-color 0.2s ease;
  }
  
  a:hover {
    background-color: #f0f4f8;
  }

  @media (max-width: 48rem) {
    display: none;
  }
`;

const AdminContent = styled.main`
  flex-grow: 1;
  padding: 50px;
  overflow-y: auto;

  /* === ГЛОБАЛЬНЫЕ СТИЛИ ДЛЯ АДАПТАЦИИ КОНТЕНТА === */
  @media (max-width: 48rem) {
    padding: 1.5rem;
    padding-bottom: 80px;

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    input[type="text"],
    input[type="number"],
    textarea,
    select {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      box-sizing: border-box;
    }

    button,
    .action-button {
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      width: 100%;
      max-width: 250px;
      align-self: flex-start;
    }
    
    .actions-cell {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 120px;
    }
    
    .actions-cell button,
    .actions-cell .action-button {
      width: 100%;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
      border: 1px solid #dee2e6;
      border-radius: 8px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      white-space: nowrap;
    }

    th, td {
      padding: 0.75rem;
      font-size: 0.9rem;
    }

    h3 { font-size: 1.5rem; }
    h4 { font-size: 1.25rem; }
  }
`;

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  return (
    <AdminPanel>
      <AdminSidebar>
        <AdminSidebarHeader>
          <h2>Админ-<span>панель</span></h2>
        </AdminSidebarHeader>
        <AdminNav>
          <li><NavLink to="/admin/locations"><span className="nav-icon"><FaMapMarkedAlt/></span><span className="nav-text">Локации (Главная)</span></NavLink></li>
          <li><NavLink to="/admin/modals"><span className="nav-icon"><FaMapMarkedAlt/></span><span className="nav-text">Локации (Модалки)</span></NavLink></li>
          <li><NavLink to="/admin/map-data"><span className="nav-icon"><FaGlobeEurope/></span><span className="nav-text">Данные Карты</span></NavLink></li>
          <li><NavLink to="/admin/fish"><span className="nav-icon"><FaFish/></span><span className="nav-text">Энциклопедия Рыб</span></NavLink></li>
          <li><NavLink to="/admin/articles"><span className="nav-icon"><FaNewspaper/></span><span className="nav-text">Статьи</span></NavLink></li>
          <li><NavLink to="/admin/banner"><span className="nav-icon"><FaExclamationCircle/></span><span className="nav-text">Инфо-баннер</span></NavLink></li>
          <li><NavLink to="/admin/calendar"><span className="nav-icon"><FaCalendarAlt/></span><span className="nav-text">Календарь Клёва</span></NavLink></li>
          <li>
            <button onClick={handleLogout}>
              <span className="nav-icon"><FaSignOutAlt /></span>
              <span className="nav-text">Выйти</span>
            </button>
          </li>
        </AdminNav>
        <AdminSidebarFooter>
          <a href="/"><FaHome/>Вернуться на сайт</a>
        </AdminSidebarFooter>
      </AdminSidebar>
      <AdminContent>
        <Outlet />
      </AdminContent>
    </AdminPanel>
  );
};

export default AdminLayout;