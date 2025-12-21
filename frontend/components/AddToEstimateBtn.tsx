'use client';

import { useEstimateStore } from '@/store/estimate';
import { useState, useRef, useEffect } from 'react';

interface Props {
  product: any;
}

export default function AddToEstimateBtn({ product }: Props) {
  const items = useEstimateStore((state) => state.items);
  const addItem = useEstimateStore((state) => state.addItem);
  const decreaseItem = useEstimateStore((state) => state.decreaseItem);
  const setItemQuantity = useEstimateStore((state) => state.setItemQuantity); // <-- Достаем новую функцию

  const productId = product.id || product.documentId;
  const currentItem = items.find((item) => item.id === productId);
  const quantity = currentItem ? currentItem.quantity : 0;

  // Состояния для редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Когда включается режим редактирования, ставим фокус в инпут
  useEffect(() => {
    if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select(); // Сразу выделяем текст, чтобы удобно менять
    }
  }, [isEditing]);

  const productData = {
    id: productId,
    sku: product.SKU,
    name: product.Name,
    quantity: 1,
    price: 0,
    image: product.Images?.data?.[0]?.attributes?.url 
             ? `http://localhost:1337${product.Images.data[0].attributes.url}`
             : (Array.isArray(product.Images) && product.Images[0]?.url 
                ? `http://localhost:1337${product.Images[0].url}` 
                : null)
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addItem(productData);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    decreaseItem(productId);
  };

  // Начало редактирования (клик по цифре)
  const startEditing = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setInputValue(quantity.toString());
    setIsEditing(true);
  };

  // Сохранение значения (при потере фокуса или Enter)
  const saveQuantity = () => {
    setIsEditing(false);
    const newQty = parseInt(inputValue, 10);
    
    if (!isNaN(newQty)) {
        setItemQuantity(productId, newQty);
    } else {
        // Если ввели чушь, возвращаем старое число
        setInputValue(quantity.toString());
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation(); // Чтобы не переходить в карточку товара при клике в инпут
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        saveQuantity();
    }
  };

  // === ВАРИАНТ 1: Кнопка "В смету" ===
  if (quantity === 0) {
    return (
        <button
          onClick={handleIncrease}
          className="w-full py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm bg-green-800 text-white hover:bg-green-700 hover:shadow-md active:scale-95"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            В смету
        </button>
    );
  }

  // === ВАРИАНТ 2: Контрол с вводом количества ===
  return (
    <div 
        className="w-full h-[46px] rounded-lg flex items-center justify-between bg-green-50 border border-green-200 overflow-hidden shadow-inner cursor-default"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
        {/* Кнопка МИНУС */}
        <button 
            onClick={handleDecrease}
            className="w-12 h-full flex items-center justify-center text-green-800 hover:bg-green-100 active:bg-green-200 transition-colors text-lg font-bold select-none"
        >
            −
        </button>

        {/* ЦЕНТР: Либо текст, либо Инпут */}
        <div className="flex-1 flex justify-center items-center h-full relative">
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={saveQuantity}
                    onKeyDown={handleKeyDown}
                    onClick={handleInputClick}
                    className="w-full h-full text-center bg-white text-green-900 font-bold outline-none border-x border-green-100"
                />
            ) : (
                <span 
                    onClick={startEditing}
                    className="font-bold text-green-900 text-sm cursor-text w-full h-full flex items-center justify-center hover:bg-green-100/50 transition-colors"
                    title="Нажмите, чтобы ввести число"
                >
                    {quantity} шт
                </span>
            )}
        </div>

        {/* Кнопка ПЛЮС */}
        <button 
            onClick={handleIncrease}
            className="w-12 h-full flex items-center justify-center text-green-800 hover:bg-green-100 active:bg-green-200 transition-colors text-lg font-bold select-none"
        >
            +
        </button>
    </div>
  );
}