import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Фон */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-100/50 rounded-full blur-3xl -translate-y-1/2 opacity-60"></div>
      
      <main className="container mx-auto px-4 py-16 relative z-10">
        
        {/* Заголовок */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
            <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase">О компании HEGEL</h1>
            <p className="text-xl text-gray-500">
                Качественные электротехнические изделия для профессионального монтажа.
            </p>
        </div>

        {/* Блок с информацией */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-2 animate-slide-up delay-100">
            <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Российское производство</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                        Компания HEGEL специализируется на разработке и производстве электроустановочных и электромонтажных изделий с 2006 года.
                    </p>
                    <p>
                        Наш завод оснащен современным высокотехнологичным оборудованием. Мы используем только качественные материалы, что гарантирует надежность и долговечность нашей продукции.
                    </p>
                    <p>
                        Вся продукция сертифицирована и соответствует требованиям ГОСТ и международных стандартов.
                    </p>
                </div>
            </div>
            {/* Имитация фото */}
            <div className="bg-gray-200 relative min-h-[300px]">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-2xl uppercase tracking-widest bg-gray-800/5">
                    Фото завода
                </div>
            </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-slide-up delay-200">
            {[
                { label: 'Лет на рынке', value: '18+' },
                { label: 'Товарных позиций', value: '500+' },
                { label: 'Партнеров в РФ', value: '100+' },
            ].map((stat) => (
                <div key={stat.label} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:-translate-y-1 transition-transform duration-300 group">
                    <div className="text-4xl font-black text-green-800 mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
                    <div className="text-gray-500 font-medium uppercase text-sm tracking-wide">{stat.label}</div>
                </div>
            ))}
        </div>

      </main>
    </div>
  );
}