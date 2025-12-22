import ProductCard from "@/components/ProductCard";
import HeroCategories from "@/components/HeroCategories"; 
import Image from "next/image";
import Link from "next/link";

async function getProducts() {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    // ИЗМЕНЕНО: Обращаемся к новой коллекции product2s
    const res = await fetch(`${strapiUrl}/api/product2s?populate=*&sort=createdAt:desc&pagination[pageSize]=10`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) return { data: [] };
    const json = await res.json();
    
    // В Strapi 5 данные лежат сразу в json.data (без .attributes)
    return json;
  } catch (error) {
    console.error("Ошибка загрузки продуктов:", error);
    return { data: [] };
  }
}

export default async function Home() {
  const { data: products } = await getProducts();

  const advantages = [
    { title: 'Сертифицировано', desc: 'соответствует ГОСТ.', icon: '/sertif.png' },
    { title: 'Любые поверхности', desc: 'Бетон, кирпич и ГКЛ.', icon: '/poverh.png' },
    { title: 'Быстрый монтаж', desc: 'Экономия 30% времени.', icon: '/fast.png' }
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Фоновые элементы */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>

      <main className="container mx-auto px-4 py-2 relative z-10">
        
        {/* === HERO SECTION === */}
        <div className="relative mb-3 rounded-[32px] overflow-hidden shadow-xl animate-slide-up group">
            <div className="absolute inset-0 z-0 bg-[#2b2b2b]">
                <Image 
                    src="/page.png" 
                    alt="Hegel Modern Interior" 
                    fill 
                    className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent"></div>
            </div>

            <div className="relative z-10 p-8 md:p-14 flex flex-col items-start justify-center min-h-[400px] md:min-h-[500px]">
                <span className="inline-block py-0.5 px-3 rounded-full bg-green-800 text-white text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                    Hegel Premium
                </span>
                
                <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.85] uppercase tracking-tighter mb-4 max-w-xl">
                    Эстетика <br /> 
                    <span className="text-green-500 italic">комфорта</span>
                </h1>
                
                <p className="text-gray-300 text-sm md:text-base max-w-xs mb-6 font-medium leading-snug">
                    Профессиональные решения, гармонирующие с вашим интерьером.
                </p>

                <div className="flex flex-wrap gap-3">
                    <Link href="/search?q=" className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-500 hover:text-white transition-all shadow-lg">
                        В каталог
                    </Link>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span className="text-[10px] font-bold text-white uppercase">RU Производство</span>
                    </div>
                </div>
            </div>
        </div>

        {/* === БЛОК КАТЕГОРИЙ === */}
        <div className="animate-slide-up delay-75">
           <HeroCategories />
        </div>

        {/* === БЛОК НОВИНОК === */}
        <div className="flex items-center justify-between mb-3 mt-6 border-b border-gray-200 pb-2 animate-slide-up delay-100">
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Новинки</h2>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden md:block italic">
            Swipe →
          </div>
        </div>

        <div className="relative -mx-4 px-4 md:mx-0 md:px-0 animate-slide-up delay-150">
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory hide-scrollbar">
              {products && products.length > 0 ? (
                products.map((product: any) => (
                  <div key={product.id} className="min-w-[260px] md:min-w-[300px] snap-start">
                     {/* Передаем данные напрямую (без .attributes) */}
                     <ProductCard data={product} />
                  </div>
                ))
              ) : (
                <div className="py-10 text-gray-400 text-sm italic">Товары в категории product2s не найдены...</div>
              )}
            </div>
        </div>

        {/* === ПРЕИМУЩЕСТВА === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 animate-slide-up delay-200">
            {advantages.map((box, i) => (
                <div key={i} className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <Image src={box.icon} alt={box.title} fill className="object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-base font-bold text-gray-900 leading-tight">{box.title}</h3>
                        <p className="text-gray-400 leading-tight text-[10px] mt-0.5">{box.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}