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
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
        
        // 1. Запрашиваем обе коллекции одновременно
        const [resMechs, resBoxes] = await Promise.all([
          fetch(`${strapiUrl}/api/product2s?populate=*&pagination[pageSize]=100`),
          fetch(`${strapiUrl}/api/product-boxes?populate=*&pagination[pageSize]=100`)
        ]);

        const jsonMechs = await resMechs.json();
        const jsonBoxes = await resBoxes.json();

        // 2. Объединяем данные в один массив
        const allData = [
          ...(jsonMechs.data || []),
          ...(jsonBoxes.data || [])
        ];

        // 3. Клиентская фильтрация (так поиск будет работать по всем полям сразу)
        if (!rawQuery.trim()) {
          setProducts(allData);
        } else {
          const search = rawQuery.toLowerCase();
          
          const filtered = allData.filter((item: any) => {
            // Ищем в имени, артикуле (SKU/BaseSKU) или серии
            const name = (item.Name || '').toLowerCase();
            const sku = (item.BaseSKU || item.SKU || '').toLowerCase();
            const series = (item.Series || '').toLowerCase();
            const type = (item.Type || '').toLowerCase();

            // Специальные категории
            if (rawQuery.toUpperCase() === 'ЭУИ') {
                return series.includes('alfa') || series.includes('master');
            }
            if (rawQuery.toUpperCase() === 'ЭМИ') {
                return sku.startsWith('ку') || sku.startsWith('кр') || type.includes('коробка');
            }

            return name.includes(search) || sku.includes(search) || series.includes(search);
          });

          setProducts(filtered);
        }

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
                <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest">Загрузка...</p>
            </div>
        ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-up delay-100 pb-20">
                {products.map((product) => (
                    <div key={`${product.id}-${product.BaseSKU || product.SKU}`} className="animate-fade-in">
                        <ProductCard data={product} />
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-white p-12 rounded-[40px] border border-gray-200 text-center shadow-sm max-w-2xl mx-auto animate-fade-in">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 uppercase">Ничего не найдено</h3>
                <p className="text-gray-500 mb-8 font-medium">Попробуйте изменить запрос (например, "КУ1101" или "Розетка")</p>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link href="/search?q=" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-green-700 transition shadow-lg active:scale-95">
                        Весь каталог
                    </Link>
                    <Link href="/" className="bg-gray-100 text-gray-800 px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-gray-200 transition active:scale-95">
                        На главную
                    </Link>
                </div>
            </div>
        )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Фоновые элементы */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <main className="container mx-auto px-4 py-12 relative z-10">
           <Suspense fallback={<div className="text-center py-20 font-bold text-gray-400 uppercase tracking-widest animate-pulse">Инициализация поиска...</div>}>
             <SearchResults />
           </Suspense>
        </main>
    </div>
  );
}