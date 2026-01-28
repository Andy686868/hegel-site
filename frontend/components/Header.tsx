'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEstimateStore } from '@/store/estimate';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
const API_URL = 'https://hegel-backend.onrender.com';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';

export default function Header() {
  const items = useEstimateStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  
  // Состояния для поиска
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const debouncedQuery = useDebounce(searchQuery, 300);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Логика поиска
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      setIsSearching(true);
      try {
        const variations = new Set([
            debouncedQuery,
            debouncedQuery.toLowerCase(),
            debouncedQuery.toUpperCase(),
            debouncedQuery.charAt(0).toUpperCase() + debouncedQuery.slice(1).toLowerCase()
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
        const url = `${API_URL}/api/products?${queryString}&populate=*&pagination[pageSize]=5`;
        
        const res = await fetch(url);
        const json = await res.json();
        setSuggestions(json.data || []);
        setShowDropdown(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSubmitSearch = () => {
    if (searchQuery.trim().length > 0) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmitSearch();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-all print:hidden">
      
      {/* 1. Верхняя панель (Top Bar) для профи и контактов */}
      <div className="bg-gray-900 text-gray-400 py-2 text-[11px] font-bold uppercase tracking-widest border-b border-white/5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <Link href="/dealers#apply-form" className="hover:text-green-400 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Монтажникам и проектировщикам
            </Link>
            <span className="hidden sm:inline opacity-30">|</span>
            <span className="hidden sm:inline">Производство электротехники с 2006 года</span>
          </div>
          <div className="flex gap-4 items-center">
            <a href="tel:88000000000" className="hover:text-white transition-colors">8 (800) 000-00-00</a>
          </div>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-3xl font-black tracking-tighter text-green-900 uppercase group-hover:scale-105 transition-transform">
              Hegel
            </span>
          </Link>

          {/* Поиск */}
          <div className="hidden md:flex flex-1 mx-8 max-w-xl relative z-50" ref={searchContainerRef}>
            <div className={`relative w-full transition-all duration-300 rounded-xl ${isFocused ? 'shadow-lg ring-4 ring-green-50' : ''}`}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if(e.target.value.length === 0) setShowDropdown(false);
                }}
                onFocus={() => { 
                    setIsFocused(true); 
                    if(suggestions.length > 0) setShowDropdown(true); 
                }}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Поиск по артикулу или названию..." 
                className="w-full bg-gray-100 border-2 border-transparent text-gray-900 text-sm rounded-xl focus:ring-0 focus:bg-white focus:border-green-100 block p-3.5 pl-12 transition-all outline-none placeholder:text-gray-400"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
              </div>

              <button 
                  onClick={handleSubmitSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-green-800 p-2 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 border border-gray-100"
              >
                {isSearching ? (
                  <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                   </svg>
                )}
              </button>
            </div>

            {/* Выпадающий список поиска */}
            {showDropdown && searchQuery.length >= 2 && (
              <>
                  <div className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-slide-up">
                      {suggestions.length > 0 ? (
                          <ul>
                              <li className="bg-gray-50/50 px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Результаты в каталоге</li>
                              {suggestions.map((item) => {
                                  const data = item.attributes || item;
                                  let imgUrl = null;
                                  const imgs = data.Images;
                                  if (imgs?.data?.[0]?.attributes?.url) imgUrl = `${API_URL}${imgs.data[0].attributes.url}`;
                                  else if (Array.isArray(imgs) && imgs[0]?.url) imgUrl = `${API_URL}${imgs[0].url}`;

                                  return (
                                      <li key={item.id}>
                                          <Link 
                                              href={`/product/${data.Slug}`} 
                                              className="flex items-center gap-4 p-4 hover:bg-green-50 transition-colors group border-b border-gray-50 last:border-0"
                                              onClick={() => setShowDropdown(false)}
                                          >
                                              <div className="w-12 h-12 relative bg-white rounded-lg border border-gray-100 flex-shrink-0 p-1 overflow-hidden group-hover:border-green-200 transition-colors">
                                                  {imgUrl ? (
                                                      <Image src={imgUrl} alt={data.Name} fill className="object-contain group-hover:scale-110 transition-transform" />
                                                  ) : (
                                                      <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300 italic font-bold">NO IMAGE</div>
                                                  )}
                                              </div>
                                              <div>
                                                  <div className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-green-800 transition-colors">{data.Name}</div>
                                                  <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-2">
                                                     <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold tracking-wider">SKU: {data.SKU}</span>
                                                     {data.Series && <span className="font-medium text-green-700">| {data.Series}</span>}
                                                  </div>
                                              </div>
                                          </Link>
                                      </li>
                                  );
                              })}
                              <li className="bg-gray-50 p-3 text-center border-t border-gray-100">
                                  <button onClick={handleSubmitSearch} className="text-xs font-black text-green-800 hover:text-green-600 flex items-center justify-center gap-2 w-full uppercase tracking-tighter transition-all">
                                      Смотреть все результаты
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                      </svg>
                                  </button>
                              </li>
                          </ul>
                      ) : (
                          <div className="p-10 text-center text-gray-500 flex flex-col items-center gap-3 animate-fade-in">
                              <span className="text-3xl">🔍</span>
                              <span className="text-sm">Ничего не найдено по запросу <br/><span className="font-black text-gray-900">"{searchQuery}"</span></span>
                          </div>
                      )}
                  </div>
              </>
            )}
          </div>

          {/* Навигация */}
          <nav className="flex items-center gap-2">
            {[
              { name: 'Каталог', href: '/search?q=' },
              { name: 'О компании', href: '/about' },
              { name: 'Где купить', href: '/dealers', icon: true }
            ].map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`px-4 py-2 text-[12px] font-black uppercase tracking-tight transition-all rounded-xl flex items-center gap-2
                    ${item.icon ? 'bg-green-50 text-green-800 hover:bg-green-100' : 'text-gray-600 hover:text-green-800 hover:bg-gray-50'}
                    hidden lg:flex`}
                >
                   {item.icon && (
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                       <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                     </svg>
                   )}
                   {item.name}
                </Link>
            ))}
            
            <div className="ml-4">
              <Link href="/estimate" className="relative group bg-green-900 text-white px-6 py-3.5 rounded-2xl hover:bg-black transition-all font-black uppercase text-[12px] tracking-widest flex items-center gap-3 shadow-xl shadow-green-900/20 active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span>Смета</span>
                  {mounted && totalCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border-2 border-white animate-bounce">
                          {totalCount}
                      </span>
                  )}
              </Link>
            </div>
          </nav>

        </div>
      </div>
    </header>
  );
}