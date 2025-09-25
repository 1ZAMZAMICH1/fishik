// src/components/WaterLevelWidget.jsx

import React from 'react';
import styled from 'styled-components';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const WidgetWrapper = styled.div`
  background: #263238;
  border-radius: 4px;
  padding: 20px;
  height: 100%;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
`;

const LevelDisplay = styled.div`
  font-size: 48px;
  font-weight: 900;
  color: #fff;
  line-height: 1.2;
`;

const Dynamics = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  margin-top: 10px;
  color: ${props => props.color || '#ECEFF1'};
`;

const LastUpdated = styled.div`
  font-size: 12px;
  color: #78909C;
  margin-top: auto; /* Прижимает дату к низу */
  padding-top: 20px;
`;

const Placeholder = styled.div`
  color: #78909C;
  font-weight: 700;
`;

const WaterLevelWidget = ({ level, dynamics, lastUpdated }) => {
  if (!level) {
    return (
      <WidgetWrapper>
        <Placeholder>Данные скоро появятся</Placeholder>
      </WidgetWrapper>
    );
  }

  let TrendIcon;
  let trendColor;

  if (dynamics?.includes('+')) {
    TrendIcon = FaArrowUp;
    trendColor = '#66BB6A'; // Зеленый
  } else if (dynamics?.includes('-')) {
    TrendIcon = FaArrowDown;
    trendColor = '#EF5350'; // Красный
  } else {
    TrendIcon = FaMinus;
    trendColor = '#78909C'; // Серый
  }

  return (
    <WidgetWrapper>
      <LevelDisplay>{level}</LevelDisplay>
      {dynamics && (
        <Dynamics color={trendColor}>
          <TrendIcon />
          {dynamics}
        </Dynamics>
      )}
      {lastUpdated && <LastUpdated>Обновлено: {lastUpdated}</LastUpdated>}
    </WidgetWrapper>
  );
};

export default WaterLevelWidget;