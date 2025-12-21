import Link from 'next/link';
import Image from 'next/image';

export default function HeroCategories() {
  const categories = [
    {
      title: "Электромонтаж",
      desc: "Решения для бетонных и полых стен.",
      href: "/search?q=ЭМИ",
      img: "/kor.png",
    },
    {
      title: "Аксессуары",
      desc: "Компоненты для сборки систем.",
      href: "/search?q=ACCESSORY",
      img: "/aks.png",
    },
    {
      title: "Электроустановка",
      desc: "Серии ALFA и MASTER.",
      href: "/search?q=ЭУИ",
      img: "/rozvkl.png",
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
        {categories.map((cat, i) => (
          <Link 
            key={i}
            href={cat.href} 
            className={`group relative h-[220px] w-full max-w-[650px] rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-2xl border border-slate-200 bg-[#f4f4f4] ${
              i === 2 ? "md:col-span-2" : "" 
            }`}
          >
            {/* Контент */}
            <div className="relative z-20 h-full p-10 flex flex-col justify-center items-start">
              <div className="space-y-2">
                <h3 className="text-[1.75rem] font-black text-[#1a8542] tracking-tighter uppercase leading-[0.9]">
                  {cat.title}
                </h3>
                <p className="text-slate-500 text-xs leading-tight max-w-[180px] font-semibold tracking-tight">
                  {cat.desc}
                </p>
              </div>
              
              <div className="flex items-center gap-3 text-[#1a8542] text-[10px] font-black uppercase tracking-[0.2em] mt-6">
                <span>Каталог</span>
                <div className="h-[2px] w-10 bg-[#1a8542]/30 group-hover:bg-[#1a8542] group-hover:w-16 transition-all duration-500" />
              </div>
            </div>

            {/* Изображение */}
            <div className="absolute -bottom-2 -right-2 w-[230px] h-[230px] z-10 transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-x-6 group-hover:-translate-y-0">
              <Image 
                src={cat.img} 
                alt={cat.title} 
                fill 
                className="object-contain object-right-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent pointer-events-none" />
          </Link>
        ))}
      </div>
    </div>
  );
}