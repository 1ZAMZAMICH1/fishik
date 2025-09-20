import React from 'react';
// Используем иконки из той же библиотеки, что и раньше
import { FaInstagram, FaTelegramPlane, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  const styles = `
    .site-footer {
      width: 100%;
      background-color: #263238; /* Темный фон, как в темных блоках */
      font-family: 'Montserrat', sans-serif;
      color: #B0BEC5; /* Приглушенный светло-серый текст */
      padding: 60px 80px 30px 80px;
      box-sizing: border-box;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      gap: 40px;
      padding-bottom: 40px;
      border-bottom: 1px solid #455A64; /* Разделительная линия */
      flex-wrap: wrap; /* Для адаптивности на малых экранах */
    }

    .footer-column {
      flex: 1;
      min-width: 250px; /* Минимальная ширина для колонок */
    }
    
    .footer-column.about .footer-title {
      font-size: 24px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 15px;
    }

    .footer-column.about .footer-description {
      font-size: 15px;
      line-height: 1.7;
      max-width: 300px;
    }
    
    .footer-column h4 {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 20px;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 12px;
    }

    .footer-links a {
      color: #B0BEC5;
      text-decoration: none;
      font-size: 15px;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: #F2994A; /* Оранжевый акцент при наведении */
    }
    
    .social-icons {
      display: flex;
      gap: 20px;
    }
    
    .social-icons a {
      color: #B0BEC5;
      font-size: 22px;
      transition: color 0.3s ease, transform 0.3s ease;
    }
    
    .social-icons a:hover {
      color: #F2994A;
      transform: scale(1.2);
    }
    
    .footer-bottom-bar {
      padding-top: 30px;
      text-align: center;
      font-size: 14px;
      color: #78909C; /* Более темный серый для копирайта */
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-column about">
            <h3 className="footer-title">Рыболовный Путеводитель</h3>
            <p className="footer-description">
              Ваш ключ к лучшим местам для рыбалки в Туркестанской области.
              Создано с любовью к природе и рыбалке.
            </p>
          </div>

          <div className="footer-column links">
            <h4>Навигация</h4>
            <ul className="footer-links">
              <li><a href="#">Главная</a></li>
              <li><a href="#">Локации</a></li>
              <li><a href="#">Виды Рыб</a></li>
              <li><a href="#">Календарь</a></li>
            </ul>
          </div>

          <div className="footer-column social">
            <h4>Следите за нами</h4>
            <div className="social-icons">
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="Telegram"><FaTelegramPlane /></a>
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <p>&copy; {new Date().getFullYear()} Рыболовный Путеводитель. Все права защищены.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;