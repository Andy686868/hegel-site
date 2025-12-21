import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToEstimateBtn from '@/components/AddToEstimateBtn';

// 1. Получение данных товара
async function getProduct(slug: string) {
  try {
    const res = await fetch(`http://localhost:1337/api/products?filters[Slug][$eq]=${slug}&populate=*`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data || json.data.length === 0) return null;
    return json.data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const productData = await getProduct(resolvedParams.slug);

  if (!productData) notFound();

  const product = productData.attributes || productData;
  const { Name, SKU, Series, Description, Images, Type, Material, IP_Rating, Mounting_Type } = product;

  // Логика картинки
  let imageUrl = null;
  if (Images?.data?.[0]?.attributes?.url) {
    imageUrl = `http://localhost:1337${Images.data[0].attributes.url}`;
  } else if (Array.isArray(Images) && Images[0]?.url) {
    imageUrl = `http://localhost:1337${Images[0].url}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Фоновые эффекты как на главной */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green-100/40 rounded-full blur-3xl -translate-y-1/2 opacity-60"></div>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Хлебные крошки */}
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2 animate-fade-in">
          <Link href="/" className="hover:text-green-800 transition-colors">Главная</Link> 
          <span>/</span>
          <Link href="/search?q=" className="hover:text-green-800 transition-colors">Каталог</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate max-w-[200px] md:max-w-none">{Name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* ЛЕВАЯ КОЛОНКА: Фото */}
            <div className="p-8 md:p-12 bg-gray-50/50 flex items-center justify-center relative min-h-[400px] lg:min-h-[600px] border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="relative w-full h-full aspect-square group">
                {imageUrl ? (
                  <Image 
                    src={imageUrl} 
                    alt={Name} 
                    fill 
                    className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105" 
                    priority 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl text-gray-300 text-6xl">📷</div>
                )}
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА: Инфо */}
            <div className="p-8 md:p-12 flex flex-col">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  {Series && (
                    <span className="bg-green-800 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Серия {Series}
                    </span>
                  )}
                  {Type && (
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {Type}
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4 uppercase tracking-tight">
                  {Name}
                </h1>
                
                <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Артикул:</span>
                  <span className="text-gray-900 font-black font-mono text-lg">{SKU}</span>
                </div>
              </div>

              {/* Характеристики */}
              <div className="space-y-4 mb-10">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Характеристики</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Материал', value: Material },
                    { label: 'Степень защиты', value: IP_Rating },
                    { label: 'Тип монтажа', value: Mounting_Type },
                    { label: 'Цвет', value: product.Color || 'Серый' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 group">
                      <span className="text-gray-500 text-sm">{item.label}</span>
                      <div className="flex-grow mx-4 border-b border-dotted border-gray-200 group-hover:border-green-200 transition-colors"></div>
                      <span className="font-bold text-gray-900 text-sm">{item.value || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Кнопка сметы (наш крутой компонент) */}
              <div className="mt-auto space-y-4">
                <div className="p-1 bg-gray-50 rounded-2xl border border-gray-100">
                   <AddToEstimateBtn product={productData} />
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-600 flex items-center justify-center gap-2 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-800">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
                    </svg>
                    Технический лист
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Описание */}
          <div className="p-8 md:p-12 border-t border-gray-100 bg-gray-50/30">
            <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Описание изделия</h3>
            <div className="prose max-w-none text-gray-600 leading-relaxed text-lg">
              {Description ? (
                <p>{typeof Description === 'string' ? Description : 'Описание доступно в техническом паспорте.'}</p>
              ) : (
                <p className="italic text-gray-400">Техническое описание для данного артикула уточняется. Вы можете запросить подробную информацию у наших менеджеров.</p>
              )}
            </div>
          </div>
        </div>

        {/* Ссылка назад */}
        <div className="mt-12 text-center">
           <Link href="/search?q=" className="text-gray-400 hover:text-green-800 font-bold transition-colors flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Вернуться в каталог
           </Link>
        </div>
      </main>
    </div>
  );
}