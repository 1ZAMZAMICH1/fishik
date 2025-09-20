// src/components/AllArticlesPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import ArticleModal from './ArticleModal';

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #F8F9FA;
  padding: 3.75rem 5rem;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;

  @media (max-width: 48rem) {
    padding: 2rem 1.5rem;
  }
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* Позволяет переносить элементы на узких экранах */
  gap: 1rem; /* Отступ между заголовком и кнопкой */
  margin-bottom: 3.125rem;
  border-bottom: 1px solid #E5E7EB;
  padding-bottom: 1.25rem;
  
  h1 {
    font-size: 3rem;
    font-weight: 900;
    color: #1A2E40;
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
  border: 1px solid #1A2E40;
  color: #1A2E40;
  text-decoration: none;
  border-radius: 0.25rem;
  font-weight: 700;
  transition: all 0.3s ease;
  white-space: nowrap; /* Чтобы текст кнопки не переносился */
  
  &:hover {
    background-color: #1A2E40;
    color: #fff;
  }

  @media (max-width: 48rem) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const ArticlesGrid = styled.div`
  display: grid;
  /* На ПК делает сетку адаптивной */
  grid-template-columns: repeat(auto-fill, minmax(21.875rem, 1fr));
  gap: 1.875rem;

  @media (max-width: 48rem) {
    /* На мобильных ставит 1 колонку */
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ArticleCard = styled.div`
  background: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0.625rem 1.875rem rgba(0,0,0,0.07);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-0.3125rem);
    box-shadow: 0 0.9375rem 2.1875rem rgba(0,0,0,0.1);
  }

  @media (max-width: 48rem) {
    &:hover {
      transform: translateY(0);
      box-shadow: 0 0.625rem 1.875rem rgba(0,0,0,0.07);
    }
  }
`;

const ArticleImageContainer = styled.div`
  width: 100%;
  height: 13.75rem;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ArticleCardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ArticleCardContent = styled.div`
  padding: 1.5625rem;

  @media (max-width: 48rem) {
    padding: 1.25rem;
  }
`;

const ArticleCardCategory = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  color: #F2994A;
  text-transform: uppercase;
  margin-bottom: 0.625rem;
`;

const ArticleCardTitle = styled.h3`
  font-size: 1.375rem;
  font-weight: 700;
  color: #1A2E40;
  margin: 0 0 0.9375rem 0;
  line-height: 1.3;

  @media (max-width: 48rem) {
    font-size: 1.25rem;
  }
`;

const ArticleCardPreview = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #4B5563;
`;

const AllArticlesPage = () => {
  const { appData } = useData();
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (!appData || !appData.articlesData) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA', fontFamily: 'Montserrat'}}>
            Загрузка статей...
        </div>
    );
  }

  const articlesData = appData.articlesData;

  return (
    <>
      <PageContainer>
        <PageHeader>
          <h1>Все Статьи</h1>
          <BackButton to="/">← Назад на главную</BackButton>
        </PageHeader>
        <ArticlesGrid>
          {/* ИЗМЕНЕНИЕ: Переворачиваем массив, чтобы новые статьи были в начале */}
          {[...articlesData].reverse().map(article => (
            <ArticleCard key={article.id} onClick={() => setSelectedArticle(article)}>
              <ArticleImageContainer>
                <ArticleCardImage src={article.image} alt={article.title} />
              </ArticleImageContainer>
              <ArticleCardContent>
                <ArticleCardCategory>{article.category}</ArticleCardCategory>
                <ArticleCardTitle>{article.title}</ArticleCardTitle>
                <ArticleCardPreview>{article.preview}</ArticleCardPreview>
              </ArticleCardContent>
            </ArticleCard>
          ))}
        </ArticlesGrid>
      </PageContainer>
      <AnimatePresence>
        {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
      </AnimatePresence>
    </>
  );
};

export default AllArticlesPage;