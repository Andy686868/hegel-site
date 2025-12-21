'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get('q') || ''; 
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugUrl, setDebugUrl] = useState('');

  // Определяем заголовок страницы
  let pageTitle = `Результаты поиска: «${rawQuery}»`;
  if (!rawQuery.trim()) pageTitle = 'Полный каталог продукции';
  if (rawQuery.toUpperCase() === 'ЭУИ') pageTitle = 'Электроустановочные изделия';
  if (rawQuery.toUpperCase() === 'ЭМИ') pageTitle = 'Электромонтажные изделия (Коробки)';
  if (rawQuery.toUpperCase() === 'ACCESSORY') pageTitle = 'Аксессуары и комплектующие';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let url = '';
        
        // 1. ПУСТОЙ ЗАПРОС -> ВЕСЬ КАТАЛОГ
        if (!rawQuery.trim()) {
            url = `http://localhost:1337/api/products?populate=*&pagination[pageSize]=100`; 
        }
        // 2. КАТЕГОРИЯ "ЭУИ"
        else if (rawQuery.toUpperCase() === 'ЭУИ') {
             url = `http://localhost:1337/api/products?filters[$or][0][Series][$eq]=ALFA&filters[$or][1][Series][$eq]=MASTER&populate=*&pagination[pageSize]=100`;
        } 
        // 3. КАТЕГОРИЯ "ЭМИ"
        else if (rawQuery.toUpperCase() === 'ЭМИ') {
             url = `http://localhost:1337/api/products?filters[Type][$contains]=Коробка&populate=*&pagination[pageSize]=100`;
        }
        // 4. КАТЕГОРИЯ "ACCESSORY"
        else if (rawQuery.toUpperCase() === 'ACCESSORY') {
             url = `http://localhost:1337/api/products?filters[$or][0][Type][$contains]=Аксессуар&filters[$or][1][Name][$contains]=Сжим&populate=*&pagination[pageSize]=100`;
        }
        // 5. ОБЫЧНЫЙ ПОИСК
        else {
            const variations = new Set([
                rawQuery, rawQuery.toLowerCase(), rawQuery.toUpperCase(),
                rawQuery.charAt(0).toUpperCase() + rawQuery.slice(1).toLowerCase()
            ]);
            const filterParts: string[] = [];
            let index = 0;
            variations.forEach((v) => {
                const encodedV = encodeURIComponent(v);
                filterParts.push(`filters[$or][${index}][Name][$contains]=${encodedV}`); index++;
                filterParts.push(`filters[$or][${index}][SKU][$contains]=${encodedV}`); index++;
                filterParts.push(`filters[$or][${index}][Series][$contains]=${encodedV}`); index++;
                filterParts.push(`filters[$or][${index}][Type][$contains]=${encodedV}`); index++;
            });
            const queryString = filterParts.join('&');
            url = `http://localhost:1337/api/products?${queryString}&populate=*`;
        }
        
        setDebugUrl(url); 
        const res = await fetch(url);
        const json = await res.json();
        setProducts(json.data || []);

      } catch (error) {
        console.error("Ошибка поиска:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [rawQuery]);

  return (
    <div>
        {/* Заголовок */}
        <div className="mb-10 border-b border-gray-200 pb-4 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">{pageTitle}</h1>
            <p className="text-gray-500 text-lg">
                Найдено позиций: <span className="font-bold text-gray-900">{products.length}</span>
            </p>
        </div>

        {/* Контент */}
        {loading ? (
            <div className="py-40 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-800"></div>
                <p className="mt-4 text-gray-500">Загрузка каталога...</p>
            </div>
        ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-up delay-100 pb-20">
                {products.map((product) => (
                    <div key={product.id || product.documentId} className="animate-fade-in">
                        <ProductCard data={product} />
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center shadow-sm max-w-2xl mx-auto animate-fade-in">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ничего не найдено</h3>
                <p className="text-gray-500 mb-8">Попробуйте изменить запрос или перейдите в общий каталог.</p>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link href="/search?q=" className="bg-green-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg hover:-translate-y-0.5">
                        Полный каталог
                    </Link>
                    <Link href="/" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                        На главную
                    </Link>
                </div>
                
                {/* Debug info (скрыть в продакшене) */}
                <div className="mt-8 text-[10px] text-gray-300 break-all border-t border-gray-100 pt-4">
                    Debug URL: {debugUrl}
                </div>
            </div>
        )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Фоновые эффекты */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>

        <main className="container mx-auto px-4 py-12 relative z-10">
           <Suspense fallback={<div className="text-center py-20 text-gray-500">Загрузка...</div>}>
             <SearchResults />
           </Suspense>
        </main>
    </div>
  );
}