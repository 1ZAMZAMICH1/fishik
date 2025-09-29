// src/components/BiteForecastChart.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { calculateBiteScoreForTimeSlot } from '../utils/biteForecast';

// --- Стили для тултипа (всплывающей подсказки) ---
const TooltipContainer = styled.div`
  position: fixed;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background: #263238;
  border: 1px solid #455A64;
  border-radius: 4px;
  padding: 15px;
  z-index: 100;
  min-width: 220px;
  pointer-events: none;
  transform: translate(15px, 15px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  font-size: 12px;
  color: #ECEFF1;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const TooltipHeader = styled.div`
  font-weight: 700;
  color: #FFAB40;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #37474F;
`;

const FactorItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  span:last-child {
    font-weight: 700;
    color: ${props => props.$positive ? '#81C784' : '#ECEFF1'};
  }
`;

// --- Стили для нового дизайна графика ---
const ChartWrapper = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #455A64;
  h4 {
    font-size: 16px;
    font-weight: 700;
    color: #FFAB40;
    margin: 0 0 20px 0;
    text-transform: uppercase;
    text-align: center;
  }
`;

const DaysContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); // Увеличим минимальную ширину
  gap: 20px;
`;

const DayCard = styled.div`
  background: #263238;
  border-radius: 4px;
  padding: 20px;
`;

const DayHeader = styled.h5`
  font-size: 16px;
  font-weight: 900;
  text-align: center;
  margin: 0 0 15px 0;
  color: #fff;
`;

const FishRow = styled.div`
  display: grid;
  grid-template-columns: 90px repeat(4, 1fr); // Увеличим место для названия рыбы
  align-items: center;
  border-bottom: 1px solid #37474F;
  padding: 10px 0;
  &:last-child {
    border-bottom: none;
  }
`;

const FishName = styled.div`
  font-weight: 700;
  font-size: 14px;
  padding-right: 10px;
`;

const ForecastCell = styled.div`
  text-align: center;
  font-size: 20px;
  cursor: help;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #455A64;
  }
`;

const TimeHeaders = styled(FishRow)`
  font-size: 12px;
  color: #90A4AE;
  border-bottom: 2px solid #455A64;
  padding-bottom: 10px;
  font-weight: 700;
  div {
    text-align: center;
  }
`;

const Tooltip = ({ data }) => {
  if (!data) return <TooltipContainer x={0} y={0} $visible={false} />;
  
  const { x, y, forecast, fishName, timeOfDay } = data;
  
  if (!forecast || !forecast.factors) {
    return <TooltipContainer x={x} y={y} $visible={true}><TooltipHeader>Нет данных для прогноза</TooltipHeader></TooltipContainer>;
  }

  return (
    <TooltipContainer x={x} y={y} $visible={true}>
      <TooltipHeader>{fishName} - {timeOfDay}</TooltipHeader>
      {forecast.factors.map((factor, index) => (
        <FactorItem key={index} $positive={factor.positive}>
          <span>{factor.name}:</span>
          <span>{factor.text}</span>
        </FactorItem>
      ))}
    </TooltipContainer>
  );
};

const BiteForecastChart = ({ location, weatherList }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (!location || !weatherList || weatherList.length === 0 || !location.fish) {
    return null;
  }

  const groupedForecasts = weatherList.reduce((acc, item, index) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'short' });
    
    if (!acc[dayKey]) {
      acc[dayKey] = { morning: null, day: null, evening: null, night: null, nextDayFirstSlot: null };
    }

    // Находим первый слот следующего дня для расчета прогноза на ночь
    if (index + 8 < weatherList.length) {
        const nextDayDate = new Date(weatherList[index + 8].dt * 1000);
        if (nextDayDate.getDate() !== date.getDate()) {
            acc[dayKey].nextDayFirstSlot = weatherList[index + 8];
        }
    }

    const hour = date.getHours();
    if (hour >= 5 && hour < 12) acc[dayKey].morning = item;
    else if (hour >= 12 && hour < 18) acc[dayKey].day = item;
    else if (hour >= 18 && hour < 24) acc[dayKey].evening = item;
    else if (hour >= 0 && hour < 5) acc[dayKey].night = item;
    
    return acc;
  }, {});

  // --- ИЗМЕНЕНИЕ: БЕРЕМ 6 ДНЕЙ ---
  const days = Object.entries(groupedForecasts).slice(0, 6);

  const handleMouseEnter = (e, forecast, fishName, timeOfDay) => {
    setActiveTooltip({
      x: e.clientX,
      y: e.clientY,
      forecast,
      fishName,
      timeOfDay
    });
  };

  return (
    <ChartWrapper>
      <h4>Прогноз клёва на 6 дней</h4>
      <DaysContainer>
        {days.map(([dayKey, periods]) => (
          <DayCard key={dayKey}>
            <DayHeader>{dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}</DayHeader>
            <TimeHeaders>
              <FishName></FishName>
              <div>Утро</div>
              <div>День</div>
              <div>Вечер</div>
              <div>Ночь</div>
            </TimeHeaders>
            {location.fish.map((fish, fishIndex) => {
              const forecasts = {
                Утро: calculateBiteScoreForTimeSlot(fish, location, periods.morning, periods.day),
                День: calculateBiteScoreForTimeSlot(fish, location, periods.day, periods.evening),
                Вечер: calculateBiteScoreForTimeSlot(fish, location, periods.evening, periods.night),
                Ночь: calculateBiteScoreForTimeSlot(fish, location, periods.night, periods.nextDayFirstSlot),
              };
              return (
                <FishRow key={`${fish.name}-${fishIndex}`}>
                  <FishName>{fish.name}</FishName>
                  {Object.entries(forecasts).map(([timeOfDay, forecast]) => (
                    <ForecastCell
                      key={timeOfDay}
                      onMouseEnter={(e) => handleMouseEnter(e, forecast, fish.name, timeOfDay)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      {forecast.stars.substring(0, 1)}
                    </ForecastCell>
                  ))}
                </FishRow>
              );
            })}
          </DayCard>
        ))}
      </DaysContainer>
      <Tooltip data={activeTooltip} />
    </ChartWrapper>
  );
};

export default BiteForecastChart;