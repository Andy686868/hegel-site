// app/loading.tsx

export default function Loading() {
    return (
      <main className="container mx-auto px-4 py-12 animate-fade-in">
        {/* Скелет для Блока категорий (3 большие плитки) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="h-64 rounded-2xl skeleton"></div>
            <div className="h-64 rounded-2xl skeleton hidden md:block"></div>
            <div className="h-64 rounded-2xl skeleton hidden md:block"></div>
        </div>
  
        {/* Скелет заголовка */}
        <div className="mb-8 mt-16">
            <div className="h-8 w-64 skeleton mb-2"></div>
            <div className="h-4 w-48 skeleton"></div>
        </div>
  
        {/* Скелет сетки товаров (8 штук) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Генерируем 8 пустых карточек */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden h-[400px] flex flex-col">
                    <div className="h-64 skeleton m-4 rounded-lg"></div>
                    <div className="p-5 flex-grow flex flex-col">
                        <div className="h-3 w-20 skeleton mb-2"></div>
                        <div className="h-6 w-full skeleton mb-4"></div>
                        <div className="h-6 w-3/4 skeleton mb-auto"></div>
                        <div className="h-10 w-full skeleton mt-4 rounded-md"></div>
                    </div>
                </div>
            ))}
        </div>
      </main>
    );
  }