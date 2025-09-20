// src/components/ArticlesSection.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import ArticleModal from './ArticleModal';

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНЕНТЫ ---

const SectionContainer = styled.section`
  width: 100%;
  background-color: #F8F9FA;
  padding: 5rem 3.75rem;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;

  @media (max-width: 48rem) {
    padding: 3rem 1.5rem;
  }
`;

const ArticlesHeader = styled.div`
  text-align: center;
  margin-bottom: 3.125rem;

  h2 {
    font-size: 3rem;
    font-weight: 900;
    color: #1A2E40;
    text-transform: uppercase;
    margin: 0 0 0.625rem 0;
  }
  p {
    font-size: 1.125rem;
    color: #6B7280;
    max-width: 37.5rem;
    margin: 0 auto;
  }

  @media (max-width: 48rem) {
    margin-bottom: 2rem;
    h2 { font-size: 2.5rem; }
    p { font-size: 1rem; }
  }
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.875rem;
  max-width: 87.5rem;
  margin: 0 auto;

  @media (max-width: 48rem) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ArticleCard = styled(motion.div)`
  background: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0.625rem 1.875rem rgba(0,0,0,0.07);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-0.625rem);
    box-shadow: 0 1.25rem 2.5rem rgba(0,0,0,0.1);
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
  object-fit: contain; /* <-- ГЛАВНОЕ ИСПРАВЛЕНИЕ: Возвращаем contain */
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

const ArticlesFooter = styled.div`
  text-align: center;
  margin-top: 3.125rem;

  @media (max-width: 48rem) {
    margin-top: 2rem;
  }
`;

const ViewAllArticlesBtn = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid #1A2E40;
  color: #1A2E40;
  text-decoration: none;
  border-radius: 0.25rem;
  font-weight: 700;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #1A2E40;
    color: #fff;
  }
`;


const ArticlesSection = () => {
  const { appData } = useData();
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (!appData || !appData.articlesData) {
    return (
      <SectionContainer style={{minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p>Загрузка статей...</p>
      </SectionContainer>
    );
  }
  
  const articlesData = appData.articlesData;
  const articlesToShow = [...articlesData].reverse().slice(0, 3);

  return (
    <>
      <SectionContainer>
        <ArticlesHeader>
          <h2>Полезные Статьи</h2>
          <p>Советы, хитрости и важная информация, которая поможет вам стать лучшим рыболовом.</p>
        </ArticlesHeader>
        <ArticlesGrid>
          {articlesToShow.map(article => (
            <ArticleCard key={article.id} onClick={() => setSelectedArticle(article)}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
              
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
        <ArticlesFooter>
          <ViewAllArticlesBtn to="/articles">Читать все статьи</ViewAllArticlesBtn>
        </ArticlesFooter>
      </SectionContainer>
      <AnimatePresence>
        {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
      </AnimatePresence>
    </>
  );
};

export default ArticlesSection;