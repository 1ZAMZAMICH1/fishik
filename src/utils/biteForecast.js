// src/utils/biteForecast.js

import SunCalc from 'suncalc';

export function calculateBiteScoreForTimeSlot(fish, location, forecastItem, nextForecastItem) {
  let score = 0;
  const factors = [];
  const prefs = fish.preferences || {};
  
  if (!forecastItem) {
    return { stars: '☆☆☆☆☆', text: 'Нет данных', factors: [{ name: 'Погода', text: 'Нет данных', positive: false }], numericScore: 0 };
  }

  const forecastDate = new Date(forecastItem.dt * 1000);

  // 1. Сезон (базовый множитель)
  let seasonMultiplier = 0.5;
  const currentMonth = forecastDate.getMonth();
  if (fish.bestMonths?.includes(currentMonth)) {
    seasonMultiplier = 1.2;
    factors.push({ name: 'Сезон', text: 'Идеальный', positive: true });
  } else if (fish.goodMonths?.includes(currentMonth)) {
    seasonMultiplier = 1.0;
    factors.push({ name: 'Сезон', text: 'Хороший', positive: true });
  } else if (fish.normalMonths?.includes(currentMonth)) {
    seasonMultiplier = 0.8;
    factors.push({ name: 'Сезон', text: 'Нормальный', positive: false });
  } else {
    factors.push({ name: 'Сезон', text: 'Неблагоприятный', positive: false });
  }

  // 2. Температура
  if (prefs.temp && prefs.temp.min && prefs.temp.max) {
    const currentTemp = Math.round(forecastItem.main.temp);
    if (currentTemp >= prefs.temp.min && currentTemp <= prefs.temp.max) {
      score += 2;
      factors.push({ name: 'Температура', text: `Комфортная (${currentTemp}°)`, positive: true });
    } else {
      factors.push({ name: 'Температура', text: `Некомфортная (${currentTemp}°)`, positive: false });
    }
  }

  // 3. Давление
  if (prefs.pressure && nextForecastItem) {
    const currentPressure = forecastItem.main.pressure;
    const nextPressure = nextForecastItem.main.pressure;
    let trend = 'стабильное';
    if (nextPressure < currentPressure) trend = 'падает';
    if (nextPressure > currentPressure) trend = 'растет';

    if (prefs.pressure.includes(trend)) {
      score += 2;
      factors.push({ name: 'Давление', text: `Благоприятное (${trend})`, positive: true });
    } else {
      factors.push({ name: 'Давление', text: `Неблагоприятное (${trend})`, positive: false });
    }
  }

  // 4. Погода (облачность, осадки)
  if (prefs.weather) {
    const weatherDesc = forecastItem.weather[0].description.toLowerCase();
    let match = prefs.weather.some(pref => weatherDesc.includes(pref));
    
    if (match) {
      score += 1;
      factors.push({ name: 'Погода', text: `Предпочитаемая (${weatherDesc})`, positive: true });
    } else {
      factors.push({ name: 'Погода', text: `Неподходящая (${weatherDesc})`, positive: false });
    }
  }

  // 5. Время суток
  if (prefs.time) {
    const times = SunCalc.getTimes(forecastDate, location.lat, location.lon);
    const sunriseEnd = new Date(times.sunrise.getTime() + 2 * 60 * 60 * 1000);
    const sunsetStart = new Date(times.sunset.getTime() - 2 * 60 * 60 * 1000);
    
    let currentTimePeriod = 'день';
    if ((forecastDate >= times.sunrise && forecastDate < sunriseEnd) || (forecastDate >= sunsetStart && forecastDate <= times.sunset)) {
      currentTimePeriod = 'утро/вечер';
    } else if (forecastDate < times.sunrise || forecastDate > times.sunset) {
      currentTimePeriod = 'ночь';
    }

    if (prefs.time.some(t => currentTimePeriod.includes(t))) {
      score += 1;
      factors.push({ name: 'Время суток', text: `Активное (${currentTimePeriod})`, positive: true });
    } else {
       factors.push({ name: 'Время суток', text: `Пассивное (${currentTimePeriod})`, positive: false });
    }
  }

  // 6. Ветер
  if (prefs.wind) {
    const currentWind = forecastItem.wind.speed;
    if (currentWind <= prefs.wind) {
      score += 1;
      factors.push({ name: 'Ветер', text: `Допустимый (${currentWind.toFixed(1)} м/с)`, positive: true });
    } else {
      factors.push({ name: 'Ветер', text: `Слишком сильный (${currentWind.toFixed(1)} м/с)`, positive: false });
    }
  }

  // Итоговый подсчет с учетом сезона
  const finalScore = Math.round(score * seasonMultiplier);

  if (seasonMultiplier < 0.8) return { stars: '★☆☆☆☆', text: 'Не сезон', factors, numericScore: 1 };
  if (finalScore >= 5) return { stars: '★★★★★', text: 'Отличный', factors, numericScore: 5 };
  if (finalScore === 4) return { stars: '★★★★☆', text: 'Хороший', factors, numericScore: 4 };
  if (finalScore === 3) return { stars: '★★★☆☆', text: 'Средний', factors, numericScore: 3 };
  
  return { stars: '★★☆☆☆', text: 'Слабый', factors, numericScore: 2 };
}