import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsSunrise, BsSun, BsSunset, BsMoonStars } from 'react-icons/bs';

// --- ИМПОРТ ИЗОБРАЖЕНИЙ ---
import sazanImg from '../assets/fish/sazan.png';
import sudakImg from '../assets/fish/sudak.png';
import somImg from '../assets/fish/som.png';
import zherehImg from '../assets/fish/zhereh.png';

// --- ДАННЫЕ О РЫБАХ (без изменений) ---
const fishData = [
    { id: 1, name: 'САЗАН', image: sazanImg, habitat: 'Предпочитает тихие, глубокие участки с илистым дном. Часто держится в коряжниках, у подмытых берегов и в ямах.', mainSpots: 'Шардаринское вдхр., Река Сырдарья, Коксарайский контррегулятор.', tackle: 'Мощные карповые или фидерные удилища, надежные катушки.', bait: 'Консервированная кукуруза, бойлы, выползок, жмых.', title: 'Сазан', description: 'Сильная и хитрая рыба, король пресных вод. Его мощные поклевки и отчаянное сопротивление делают его желанным трофеем.', difficulty: 2, bitingTime: ['dawn', 'day', 'dusk'], bitingCalendar: ['Май', 'Июн', 'Июл', 'Авг', 'Сен'], },
    { id: 2, name: 'СУДАК', image: sudakImg, habitat: 'Обитает в чистых, богатых кислородом водоемах. Предпочитает каменистое или песчаное дно, избегает заиленных участков.', mainSpots: 'Река Сырдарья, Шардаринское вдхр.', tackle: 'Спиннинговые удилища, джиговые приманки, воблеры.', bait: 'Живец (уклейка, пескарь), силиконовые приманки.', title: 'Судак', description: 'Активный хищник, известный своим "ударом" при поклевке. Ценится за вкусное мясо и спортивный интерес при ловле.', difficulty: 3, bitingTime: ['dawn', 'dusk', 'night'], bitingCalendar: ['Апр', 'Май', 'Сен', 'Окт'], },
    { id: 3, name: 'СОМ', image: somImg, habitat: 'Предпочитает глубокие ямы, омуты, затопленные коряги. Ведет преимущественно ночной образ жизни.', mainSpots: 'Река Сырдарья, крупные водохранилища.', tackle: 'Мощные сомовьи удилища, мультипликаторные катушки, прочные шнуры.', bait: 'Живец, лягушка, пучок червей, печень.', title: 'Сом', description: 'Крупнейший пресноводный хищник, настоящий хозяин глубин. Поимка трофейного сома — мечта любого рыболова.', difficulty: 3, bitingTime: ['dusk', 'night'], bitingCalendar: ['Июн', 'Июл', 'Авг'], },
    { id: 4, name: 'ЖЕРЕХ', image: zherehImg, habitat: 'Обитает на течении, часто у перекатов, мостов и плотин. Охотится у поверхности воды, устраивая "котлы".', mainSpots: 'Река Сырдарья, каналы с течением.', tackle: 'Дальнобойные спиннинги, кастмастеры, девоны, воблеры.', bait: 'Искусственные приманки, имитирующие малька.', title: 'Жерех', description: 'Стремительный и осторожный хищник. Его поклевка — это мощный удар, а вываживание требует мастерства.', difficulty: 2, bitingTime: ['dawn', 'day'], bitingCalendar: ['Май', 'Июн', 'Июл', 'Авг', 'Сен'], },
];

// --- КОМПОНЕНТЫ-ВИДЖЕТЫ (без изменений) ---
const StarIcon = ({ filled }) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={filled ? "#F2994A" : "#D1D5DB"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const DifficultyWidget = ({ level }) => ( <div className="widget"><h4 className="widget-title">СЛОЖНОСТЬ</h4><div className="widget-content" style={{ display: 'flex', gap: '4px' }}>{[1, 2, 3].map(star => <StarIcon key={star} filled={star <= level} />)}</div></div> );
const BitingCalendarWidget = ({ activeMonths }) => { const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']; const radius = 55; return ( <div className="widget"><h4 className="widget-title">КАЛЕНДАРЬ КЛЁВА</h4><div className="widget-content" style={{ width: '140px', height: '140px', position: 'relative', margin: '0 auto' }}>{months.map((month, index) => { const angle = (index / 12) * 2 * Math.PI - Math.PI / 2; const x = radius * Math.cos(angle); const y = radius * Math.sin(angle); const isActive = activeMonths.includes(month); return ( <div key={month} className={`month-label ${isActive ? 'active' : ''}`} style={{ position: 'absolute', left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)', }}>{month}</div> ); })}</div></div> ); };
const BitingTimeWidget = ({ times }) => ( <div className="widget"><h4 className="widget-title">ВРЕМЯ КЛЁВА</h4><div className="widget-content" style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '24px' }}><BsSunrise style={{ opacity: times.includes('dawn') ? 1 : 0.2 }} /><BsSun style={{ opacity: times.includes('day') ? 1 : 0.2 }} /><BsSunset style={{ opacity: times.includes('dusk') ? 1 : 0.2 }} /><BsMoonStars style={{ opacity: times.includes('night') ? 1 : 0.2 }} /></div></div> );


// --- ОСНОВНОЙ КОМПОНЕНТ ---
const FishGuideSection = () => {
  const [activeFishId, setActiveFishId] = useState(1);
  const handleToggle = (id) => { setActiveFishId(prevId => prevId === id ? null : id); };
  const activeFish = fishData.find(f => f.id === activeFishId);
  const displayList = [...fishData, ...fishData, ...fishData];

  const styles = `
    .fish-guide-section {
      display: flex; width: 100%; height: 100vh; background-color: #F8F9FA;
      font-family: 'Montserrat', sans-serif; color: #1A2E40; overflow: hidden;
    }

    .fish-list-container {
      flex: 0 0 250px; padding: 15px 0; border-right: 1px solid #E5E7EB;
      height: 100%; overflow-y: auto; -ms-overflow-style: none; scrollbar-width: none;
    }
    .fish-list-container::-webkit-scrollbar { display: none; }
    .fish-list { display: flex; flex-direction: column; }
    .fish-list-item {
      padding: 12px 25px; font-size: 30px; font-weight: 900; text-transform: uppercase; cursor: pointer;
      color: #D1D5DB; transition: color 0.3s ease; white-space: nowrap; text-align: left;
    }
    .fish-list-item.active { color: #1A2E40; }
    
    .fish-details-wrapper {
      flex-grow: 1; padding: 20px 50px; max-width: calc(100% - 250px);
      box-sizing: border-box; display: flex; flex-direction: column;
      justify-content: center; /* Центрируем весь блок, если он станет меньше 100vh */
    }

    .details-content {
      display: grid; grid-template-columns: 1fr 520px 1fr;
      align-items: center; gap: 20px;
    }
    
    .details-column { display: flex; flex-direction: column; gap: 30px; }
    .details-column .info-block h4 { color: #F2994A; font-size: 14px; margin-bottom: 8px; font-weight: 700; }
    .details-column .info-block p { font-size: 16px; line-height: 1.6; color: #374151; margin: 0; }
    /* ИЗМЕНЕНИЕ: Убрано выравнивание по правому краю, теперь по умолчанию левое */

    .fish-image {
      width: 520px; height: 380px; /* Уменьшен контейнер, чтобы всё поместилось */
      /* ИЗМЕНЕНИЕ: Правильное свойство, чтобы вся рыба была видна внутри контейнера */
      object-fit: contain; 
      margin: 0 auto; filter: drop-shadow(0 15px 20px rgba(0,0,0,0.1));
    }

    .fish-main-info { text-align: center; margin-top: 20px; }
    .fish-main-info .fish-title {
      font-size: 64px; /* Сбалансированный крупный шрифт */
      font-weight: 900; margin: 0;
    }
    .fish-main-info .fish-description {
      max-width: 600px; margin: 12px auto 0;
      font-size: 18px; /* Крупный, но компактный шрифт */
      line-height: 1.6; color: #374151;
    }
    
    .widgets-container {
      display: flex; justify-content: center; gap: 60px;
      margin-top: 25px; padding-top: 20px; border-top: 1px solid #E5E7EB;
    }
    
    .widget { text-align: center; }
    .widget-title { color: #F2994A; font-size: 13px; margin-bottom: 15px; font-weight: 700; letter-spacing: 0.5px; }
    .month-label { font-size: 13px; color: #6B7280; width: 38px; height: 38px; display: flex; justify-content: center; align-items: center; border-radius: 50%; transition: all 0.3s ease; }
    .month-label.active { background-color: #F2994A; color: white; font-weight: 700; }
  `;

  return (
    <>
      <style>{styles}</style>
      <section className="fish-guide-section">
        <div className="fish-list-container">
          <div className="fish-list">
            {displayList.map((fish, index) => (
              <div key={`${fish.id}-${index}`} className={`fish-list-item ${activeFishId === fish.id ? 'active' : ''}`} onClick={() => handleToggle(fish.id)}>
                {fish.name}
              </div>
            ))}
          </div>
        </div>
        <div className="fish-details-wrapper">
          <AnimatePresence mode="wait">
            {activeFish && (
              <motion.div key={activeFish.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <div className="details-content">
                  <div className="details-column"><div className="info-block"><h4>СРЕДА ОБИТАНИЯ</h4><p>{activeFish.habitat}</p></div><div className="info-block"><h4>ОСНОВНЫЕ МЕСТА</h4><p>{activeFish.mainSpots}</p></div></div>
                  <img src={activeFish.image} alt={activeFish.title} className="fish-image" />
                  <div className="details-column"><div className="info-block"><h4>СНАСТИ</h4><p>{activeFish.tackle}</p></div><div className="info-block"><h4>НАЖИВКА</h4><p>{activeFish.bait}</p></div></div>
                </div>
                <div className="fish-main-info"><h2 className="fish-title">{activeFish.title}</h2><p className="fish-description">{activeFish.description}</p></div>
                <div className="widgets-container"><DifficultyWidget level={activeFish.difficulty} /><BitingTimeWidget times={activeFish.bitingTime} /><BitingCalendarWidget activeMonths={activeFish.bitingCalendar} /></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default FishGuideSection;