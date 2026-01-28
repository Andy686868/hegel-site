"use client";

import React, { useState } from 'react';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';
const API_URL = 'https://hegel-backend.onrender.com';

export default function DealersPage() {
  // 1. Статический список дилеров
  const dealers = [
    { city: 'Москва', name: 'ЭлектроМонтаж', address: 'ул. Планерная, д. 3', phone: '+7 (495) 123-45-67' },
    { city: 'Москва', name: 'Русский Свет', address: 'Ленинградское шоссе, 58', phone: '+7 (495) 987-65-43' },
    { city: 'Санкт-Петербург', name: 'Минимакс', address: 'ул. Софийская, 14', phone: '+7 (812) 333-22-11' },
    { city: 'Екатеринбург', name: 'ЭТМ', address: 'Сибирский тракт, 12', phone: '+7 (343) 222-33-44' },
    { city: 'Новосибирск', name: 'Планета Электрика', address: 'ул. Станционная, 30А', phone: '+7 (383) 555-66-77' },
    { city: 'Казань', name: 'АВС-электро', address: 'ул. Техническая, 5', phone: '+7 (843) 444-55-66' },
  ];

  // 2. Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    occupation: 'Монтажник',
    phone: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // 3. Функция отправки
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            Name: formData.name,
            Occupation: formData.occupation,
            Phone: formData.phone,
            Email: formData.email,
            Message: formData.message,
          }
        }),
      });

      if (!response.ok) throw new Error('Ошибка сети');

      setStatus('success');
      setFormData({ name: '', occupation: 'Монтажник', phone: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>

      <main className="container mx-auto px-4 py-16 relative z-10">
        
        {/* Заголовок: Где купить */}
        <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter italic">Где купить</h1>
            <p className="text-xl text-gray-500 font-medium">
                Официальные точки продаж и дистрибьюторы Hegel
            </p>
        </div>

        {/* Список дилеров */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
            {dealers.map((dealer, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-green-300 transition-all duration-300 group">
                    <div className="text-[10px] font-black text-green-600 uppercase mb-3 flex items-center gap-2 tracking-widest">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {dealer.city}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-800 transition-colors">{dealer.name}</h3>
                    <p className="text-gray-500 mb-6 text-sm font-medium leading-relaxed">{dealer.address}</p>
                    
                    <a href={`tel:${dealer.phone}`} className="w-full inline-flex items-center justify-center gap-2 text-white font-bold bg-gray-900 px-4 py-3 rounded-2xl text-sm hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {dealer.phone}
                    </a>
                </div>
            ))}
        </div>

        {/* Секция: Сотрудничество */}
        <div id="apply-form" className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Левая часть: Текст */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Для профессионалов
              </div>
              <h2 className="text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                Стань частью <br/> <span className="text-green-600">команды Hegel</span>
              </h2>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                Мы предлагаем специальные условия для проектных организаций, 
                частных монтажников и строительных компаний. 
                Получите доступ к оптовым ценам и технической поддержке.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="font-bold text-gray-900 uppercase text-xs">Наличие</div>
                  <div className="text-sm text-gray-500 mt-1">Склады в крупнейших городах РФ</div>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="text-2xl mb-2">📐</div>
                  <div className="font-bold text-gray-900 uppercase text-xs">BIM/CAD</div>
                  <div className="text-sm text-gray-500 mt-1">Готовые базы для ваших проектов</div>
                </div>
              </div>
            </div>

            {/* Правая часть: Форма */}
            <div className="lg:w-1/2 w-full">
              <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 space-y-6 relative overflow-hidden">
                
                {/* Overlay успеха */}
                {status === 'success' && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 text-5xl animate-bounce">✓</div>
                    <h3 className="text-3xl font-black text-gray-900 uppercase">Отправлено!</h3>
                    <p className="text-gray-500 mt-3 font-medium text-lg">Спасибо за доверие. Менеджер свяжется с вами в течение часа.</p>
                    <button type="button" onClick={() => setStatus('idle')} className="mt-8 text-sm font-black text-green-700 hover:text-gray-900 underline decoration-2 underline-offset-8 transition-colors uppercase tracking-widest">Отправить еще раз</button>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">ФИО / Компания</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-2xl focus:border-green-500 focus:bg-white transition-all outline-none font-bold placeholder:font-medium text-base"
                        placeholder="Алексей Петров"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Деятельность</label>
                      <div className="relative">
                        <select 
                          value={formData.occupation}
                          onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                          className="w-full p-4 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-2xl focus:border-green-500 focus:bg-white transition-all outline-none font-bold appearance-none cursor-pointer text-base"
                        >
                          <option value="Монтажник">Монтажник</option>
                          <option value="Проектировщик">Проектировщик</option>
                          <option value="Дилер / Магазин">Дилер / Магазин</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Телефон</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-2xl focus:border-green-500 focus:bg-white transition-all outline-none font-bold placeholder:font-medium text-base"
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-2xl focus:border-green-500 focus:bg-white transition-all outline-none font-bold placeholder:font-medium text-base"
                        placeholder="pro@hegel.ru"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Ваше сообщение</label>
                    <textarea 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-2xl focus:border-green-500 focus:bg-white transition-all outline-none font-bold placeholder:font-medium h-32 resize-none text-base"
                      placeholder="Расскажите о вашем проекте..."
                    ></textarea>
                  </div>
                </div>

                <button 
                  disabled={status === 'loading'}
                  className={`w-full py-5 rounded-2xl text-white font-black uppercase tracking-[0.3em] text-sm shadow-2xl transition-all active:scale-[0.98] 
                    ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-black shadow-green-900/30'}`}
                >
                  {status === 'loading' ? 'Отправка...' : 'Отправить запрос'}
                </button>

                {status === 'error' && (
                  <p className="text-center text-red-600 text-sm font-black animate-pulse uppercase tracking-tighter">
                    ⚠️ Ошибка отправки. Проверьте интернет.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}