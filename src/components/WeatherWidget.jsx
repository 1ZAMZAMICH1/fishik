// src/components/WeatherWidget.jsx

import React, { useState, useEffect } from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiStrongWind } from 'react-icons/wi';

const API_KEY = '5da8e53d51f07a4979ba54e627fe23f5';

const WeatherIcon = ({ iconCode }) => {
  if (!iconCode) return <WiCloudy />;
  if (iconCode.startsWith('01')) return <WiDaySunny />;
  if (iconCode.startsWith('02') || iconCode.startsWith('03') || iconCode.startsWith('04')) return <WiCloudy />;
  if (iconCode.startsWith('09') || iconCode.startsWith('10')) return <WiRain />;
  if (iconCode.startsWith('13')) return <WiSnow />;
  return <WiCloudy />;
};

const WeatherWidget = ({ lat, lon }) => {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!lat || !lon) { setStatus('error'); return; }
    setStatus('loading');

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ru`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ru`;

    Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])
      .then(([currentRes, forecastRes]) => {
        if (!currentRes.ok || !forecastRes.ok) throw new Error('Network response was not ok');
        return Promise.all([currentRes.json(), forecastRes.json()]);
      })
      .then(([currentData, forecastData]) => {
        const dailyData = {};
        forecastData.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          if (!dailyData[date]) { dailyData[date] = { temps: [], icons: [] }; }
          dailyData[date].temps.push(item.main.temp);
          dailyData[date].icons.push(item.weather[0].icon);
        });

        const daily = Object.keys(dailyData).slice(0, 3).map(date => {
          const dayTemps = dailyData[date].temps;
          const mostCommonIcon = dailyData[date].icons.sort((a,b) => dailyData[date].icons.filter(v => v===a).length - dailyData[date].icons.filter(v => v===b).length).pop();
          return { date: date, dayName: new Date(date).toLocaleDateString('ru-RU', { weekday: 'short' }), temp_max: Math.round(Math.max(...dayTemps)), temp_min: Math.round(Math.min(...dayTemps)), icon: mostCommonIcon };
        });

        setWeather({ current: currentData, daily, hourly: forecastData.list });
        setStatus('success');
      })
      .catch(error => { console.error("Failed to fetch weather data:", error); setStatus('error'); });
  }, [lat, lon]);

  const styles = `
    .weather-widget { background: #263238; border-radius: 4px; padding: 15px; height: 100%; color: #ECEFF1; display: flex; flex-direction: column; gap: 15px; }
    .status-message { text-align: center; margin: auto; color: #B0BEC5; }
    .current-weather { text-align: center; border-bottom: 1px solid #455A64; padding-bottom: 10px; }
    .current-temp { font-size: 28px; font-weight: 700; }
    .current-condition { display: flex; align-items: center; justify-content: center; font-size: 14px; text-transform: capitalize; color: #B0BEC5; }
    .current-condition .icon { font-size: 40px; }
    .current-wind { font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 5px; margin-top: 5px; }
    .daily-forecast { display: flex; justify-content: space-around; text-align: center; border-bottom: 1px solid #455A64; padding-bottom: 10px; }
    .day-item { display: flex; flex-direction: column; align-items: center; font-size: 14px; }
    .day-name { font-weight: 700; color: #B0BEC5; text-transform: capitalize; }
    .day-icon { font-size: 40px; margin: 5px 0; }
    .day-temps { font-weight: 700; }
    .day-temps .temp-min { color: #78909C; margin-left: 5px; }
    .hourly-forecast { display: flex; justify-content: space-around; }
    .hour-item { display: flex; flex-direction: column; align-items: center; font-size: 12px; }
    .hour-item .icon { font-size: 28px; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="weather-widget">
        {status === 'loading' && <div className="status-message">Загрузка погоды...</div>}
        {status === 'error' && <div className="status-message">Ошибка загрузки.</div>}
        {status === 'success' && weather && (
          <>
            <div className="current-weather">
              <div className="current-temp">{Math.round(weather.current.main.temp)}°C</div>
              <div className="current-condition"><span className="icon"><WeatherIcon iconCode={weather.current.weather[0].icon} /></span>{weather.current.weather[0].description}</div>
              <div className="current-wind"><WiStrongWind /> {weather.current.wind.speed.toFixed(1)} м/с</div>
            </div>
            <div className="daily-forecast">
              {weather.daily.map((day) => (
                <div key={day.date} className="day-item">
                  <span className="day-name">{day.dayName}</span>
                  <span className="day-icon"><WeatherIcon iconCode={day.icon} /></span>
                  <div className="day-temps"><span>{day.temp_max}°</span><span className="temp-min">{day.temp_min}°</span></div>
                </div>
              ))}
            </div>
            <div className="hourly-forecast">
              {weather.hourly.slice(0, 5).map((hour, index) => (
                <div key={index} className="hour-item">
                  <span>{new Date(hour.dt * 1000).getHours()}:00</span>
                  <span className="icon"><WeatherIcon iconCode={hour.weather[0].icon} /></span>
                  <span>{Math.round(hour.main.temp)}°</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WeatherWidget;