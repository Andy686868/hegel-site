'use client';

import { useEstimateStore } from '@/store/estimate';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function EstimatePage() {
  const { 
    items, 
    userInfo,
    addItem, 
    decreaseItem, 
    setItemQuantity, 
    removeItem, 
    clearEstimate,
    setUserInfo 
  } = useEstimateStore();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ [name]: value });
  };

  // Стиль фона (общий для пустого и полного состояния)
  const BackgroundEffects = () => (
    <div className="absolute inset-0 z-0 pointer-events-none print:hidden">
        {/* Текстура точек */}
        <div 
          className="absolute inset-0 opacity-[0.4]"
          style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        ></div>
        {/* Зеленое свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
    </div>
  );

  // === ПУСТАЯ СМЕТА ===
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 relative overflow-hidden flex flex-col">
        <BackgroundEffects />
        <main className="container mx-auto px-4 py-20 flex-grow flex flex-col items-center justify-center text-center relative z-10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 text-4xl shadow-md animate-fade-in">📋</div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 animate-slide-up">Ваша смета пуста</h1>
            <p className="text-gray-500 max-w-md mb-8 animate-slide-up delay-100">Вы пока не добавили ни одного товара.</p>
            <Link 
                href="/search?q=" 
                className="bg-green-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:-translate-y-1 animate-slide-up delay-200"
            >
                Перейти в каталог
            </Link>
        </main>
      </div>
    );
  }

  // Общий стиль для полей ввода
  const inputClass = "w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none shadow-sm transition-all";

  // === ЗАПОЛНЕННАЯ СМЕТА ===
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden print:bg-white">
      
      {/* Фон (исчезает при печати) */}
      <BackgroundEffects />

      <main className="container mx-auto px-4 py-12 relative z-10">
        
        {/* 1. ЗАГОЛОВОК (ЭКРАН) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 print:hidden animate-slide-up">
          <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Смета проекта</h1>
              <p className="text-gray-500">Заполните данные о заказчике для формирования документа</p>
          </div>
          <button onClick={clearEstimate} className="text-red-500 hover:text-red-700 font-medium text-sm mt-4 md:mt-0 underline decoration-dashed hover:decoration-solid">
              Очистить все
          </button>
        </div>

        {/* 2. ШАПКА ДОКУМЕНТА (ТОЛЬКО ПЕЧАТЬ/PDF) */}
        <div className="hidden print:flex justify-between items-start mb-8 pb-6 border-b-2 border-black">
          {/* Блок Поставщика */}
          <div>
              <h1 className="text-4xl font-bold uppercase mb-2">HEGEL</h1>
              <p className="font-bold">Коммерческое предложение</p>
              <p className="text-sm mt-2">Дата: {new Date().toLocaleDateString()}</p>
              <p className="text-sm font-bold mt-1">www.hegel.ru</p>
          </div>
          {/* Блок Заказчика */}
          <div className="text-right max-w-[50%]">
              <h3 className="font-bold uppercase text-gray-500 text-sm mb-1">Заказчик:</h3>
              <div className="text-lg font-bold">{userInfo.organization || 'Частное лицо'}</div>
              <div>{userInfo.lastName} {userInfo.firstName}</div>
              <div>{userInfo.phone}</div>
              <div>{userInfo.email}</div>
              <div className="mt-1">{userInfo.city}</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="flex-1 animate-slide-up delay-100">
              
              {/* ФОРМА ВВОДА ДАННЫХ (СКРЫТА ПРИ ПЕЧАТИ) */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-gray-200 print:hidden shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-green-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                      Данные заказчика
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Организация</label>
                          <input 
                              type="text" name="organization" placeholder="Название организации (ООО/ИП)" 
                              value={userInfo.organization} onChange={handleChange}
                              className={inputClass}
                          />
                      </div>
                      
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Имя</label>
                          <input 
                              type="text" name="firstName" placeholder="Иван" 
                              value={userInfo.firstName} onChange={handleChange}
                              className={inputClass}
                          />
                      </div>

                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Фамилия</label>
                          <input 
                              type="text" name="lastName" placeholder="Иванов" 
                              value={userInfo.lastName} onChange={handleChange}
                              className={inputClass}
                          />
                      </div>

                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Телефон</label>
                          <input 
                              type="text" name="phone" placeholder="+7 (999) 000-00-00" 
                              value={userInfo.phone} onChange={handleChange}
                              className={inputClass}
                          />
                      </div>

                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Email</label>
                          <input 
                              type="email" name="email" placeholder="mail@example.com" 
                              value={userInfo.email} onChange={handleChange}
                              className={inputClass}
                          />
                      </div>

                      <div className="md:col-span-2">
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Город доставки</label>
                          <input 
                              type="text" name="city" placeholder="Москва, ул. Ленина..." 
                              value={userInfo.city} onChange={handleChange}
                              className={inputClass}
                          />
                      </div>
                  </div>
              </div>

              {/* ТАБЛИЦА ТОВАРОВ */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:border-none print:shadow-none">
                  <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider print:border-black print:bg-transparent">
                      <div className="col-span-6">Наименование</div>
                      <div className="col-span-2 text-center">Артикул</div>
                      <div className="col-span-3 text-center">Количество</div>
                      <div className="col-span-1"></div>
                  </div>

                  <div className="divide-y divide-gray-100 print:divide-gray-300">
                      {items.map((item, index) => (
                          <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center group hover:bg-gray-50 transition-colors print:hover:bg-transparent print:border-b print:py-2">
                              {/* Фото + Название */}
                              <div className="col-span-6 flex items-center gap-4">
                                  <span className="hidden print:block text-xs text-gray-500 w-4">{index + 1}.</span>
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden border border-gray-200 print:hidden">
                                      {item.image ? <Image src={item.image} alt={item.name} fill className="object-contain p-1" /> : <div className="text-xs text-gray-400 m-auto">NO IMG</div>}
                                  </div>
                                  <div>
                                      <Link href={`/search?q=${item.sku}`} className="font-bold text-gray-900 hover:text-green-800 transition line-clamp-2 print:text-black print:text-sm print:line-clamp-none">
                                          {item.name}
                                      </Link>
                                      <div className="md:hidden text-xs text-gray-500 mt-1">Арт: {item.sku}</div>
                                  </div>
                              </div>

                              {/* Артикул */}
                              <div className="col-span-2 hidden md:block text-center text-sm font-mono text-gray-600 print:text-black">{item.sku}</div>

                              {/* Количество */}
                              <div className="col-span-3 flex justify-center">
                                  <div className="flex items-center border border-gray-300 rounded-lg h-10 w-32 print:hidden bg-white overflow-hidden">
                                      <button onClick={() => decreaseItem(item.id)} className="w-10 h-full hover:bg-gray-100 text-gray-600 font-bold active:bg-gray-200 transition flex items-center justify-center text-lg pb-0.5">−</button>
                                      <input 
                                          type="number" value={item.quantity}
                                          onChange={(e) => { const val = parseInt(e.target.value); if(!isNaN(val)) setItemQuantity(item.id, val); }}
                                          className="flex-1 w-full text-center font-bold text-gray-900 border-x border-gray-300 h-full focus:outline-none focus:bg-green-50 p-0 m-0 appearance-none leading-none"
                                      />
                                      <button onClick={() => addItem(item)} className="w-10 h-full hover:bg-gray-100 text-gray-600 font-bold active:bg-gray-200 transition flex items-center justify-center text-lg pb-0.5">+</button>
                                  </div>
                                  <div className="hidden print:block font-bold text-black">{item.quantity} шт.</div>
                              </div>

                              {/* Удалить */}
                              <div className="col-span-1 flex justify-end print:hidden">
                                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                      </svg>
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  <div className="hidden print:block mt-8 pt-4 border-t-2 border-black">
                      <div className="flex justify-between items-center text-xl font-bold">
                          <span>Всего наименований: {items.length}</span>
                          <span>Итого единиц: {totalCount} шт.</span>
                      </div>
                      {/* Подпись (место для печати) */}
                      <div className="mt-12 flex justify-between text-sm">
                          <div>
                              ___________________ / {userInfo.lastName || 'Заказчик'} /
                              <div className="text-xs text-gray-500 mt-1">Подпись заказчика</div>
                          </div>
                          <div>
                              ___________________ / Менеджер HEGEL /
                              <div className="text-xs text-gray-500 mt-1">Подпись исполнителя</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА (СВОДКА) */}
          <div className="w-full lg:w-80 flex-shrink-0 print:hidden animate-slide-up delay-200">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Сводка</h3>
                  <div className="flex justify-between items-center mb-6 text-gray-600">
                      <span>Товаров в смете:</span>
                      <span className="font-bold text-gray-900 text-xl">{totalCount}</span>
                  </div>
                  <div className="space-y-3">
                      <button onClick={handlePrint} className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-4 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:-translate-y-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                          </svg>
                          Скачать смету (PDF)
                      </button>
                      <Link href="/search?q=" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2">
                          Вернуться в каталог
                      </Link>
                  </div>
                  <div className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
                      Нажмите «Скачать смету», чтобы сохранить список товаров в файл или распечатать его.
                  </div>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}