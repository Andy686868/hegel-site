"use client";

import { useState, useEffect, use, MouseEvent, useRef } from 'react';
import Image from 'next/image';
import AddToEstimateBtn from '@/components/AddToEstimateBtn';
import html2canvas from 'html2canvas'; // Не забудьте установить: npm install html2canvas

const colorMap: { [key: string]: { name: string, hex: string } } = {
  "00": { name: 'Белый', hex: '#FFFFFF' },
  "01": { name: 'Слоновая кость', hex: '#F9F4E8' },
  "02": { name: 'Сосна', hex: '#C19A6B' },
  "05": { name: 'Дуб', hex: '#7B5E3F' },
  "06": { name: 'Серебро', hex: '#A5A9B4' },
  "07": { name: 'Золото', hex: '#C5A059' },
  "08": { name: 'Черный металлик', hex: '#1C1C1C' },
};

const bgPalette = [
  { name: 'Антрацит', hex: '#334155' },
  { name: 'Бетон', hex: '#94a3b8' },
  { name: 'Тёплый песок', hex: '#e2d1c3' },
  { name: 'Тёмное дерево', hex: '#2d241e' },
];

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedAmp, setSelectedAmp] = useState("");
  const [selectedPlate, setSelectedPlate] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState("");
  
  const [bgPreview, setBgPreview] = useState('#334155'); 
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('main');

  const [currentMainUrl, setCurrentMainUrl] = useState<string | null>(null);
  const [currentSchemaUrl, setCurrentSchemaUrl] = useState<string | null>(null);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Реф для захвата изображения
  const previewRef = useRef<HTMLDivElement>(null);

  const getFullPlatesList = (data: any) => [
    data.plate1 && { id: "1", label: "Без пластин" },
    data.plate2 && { id: "2", label: "Без пластин" },
    data.plate3 && { id: "3", label: "С пластиной изолирующей" },
    data.plate4 && { id: "4", label: "С пластиной изолирующей" },
    data.plate5 && { id: "5", label: "С пластиной монтажной" },
    data.plate6 && { id: "6", label: "С пластиной монтажной" },
  ].filter(Boolean) as any[];

  useEffect(() => {
    async function fetchData() {
      try {
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        const res = await fetch(`${strapiUrl}/api/product2s?filters[Slug][$eq]=${slug}&populate=*`);
        const json = await res.json();
        
        if (json.data?.[0]) {
          const data = json.data[0];
          setProduct(data);
          setSelectedAmp(data.has10A ? "10" : "16");
          const availableColors = data.AvailableColors?.split(',').map((c: string) => c.trim()) || [];
          setSelectedColor(availableColors[0]);
          const allPlates = getFullPlatesList(data);
          if (allPlates.length > 0) setSelectedPlate(allPlates[0]);

          if (data.MainImage?.length > 0) setCurrentMainUrl(data.MainImage[0].url);
          if (data.SchemaImages?.length > 0) setCurrentSchemaUrl(data.SchemaImages[0].url);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchData();
  }, [slug]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // ФУНКЦИЯ ЭКСПОРТА ФОТО
  const exportAsImage = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, {
      useCORS: true, // Чтобы подгружать картинки из Strapi
      scale: 2, // Качество x2
    });
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `Hegel_${selectedColor}_${selectedAmp}A.png`;
    link.click();
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const constraints = product?.Constraints || {};
    const rule = constraints[color];
    if (rule) {
      if (rule.amps && !rule.amps.includes(selectedAmp)) setSelectedAmp(rule.amps[0]);
      if (rule.plates && !rule.plates.includes(selectedPlate?.id)) {
        const allPlates = getFullPlatesList(product);
        const nextPlate = allPlates.find(p => rule.plates.includes(p.id)) || allPlates[0];
        setSelectedPlate(nextPlate);
      }
    }
  };

  const getStrapiImageUrl = (url: string | null) => {
    if (!url) return '/no-photo.png';
    return url.startsWith('http') ? url : `http://localhost:1337${url}`;
  };

  const getDesignerImage = () => {
    if (!product?.GalleryImages || product.GalleryImages.length === 0) return '/no-photo.png';
    const coloredImg = product.GalleryImages.find((img: any) => 
      img.name.includes(selectedColor) || img.url.includes(selectedColor)
    );
    return getStrapiImageUrl(coloredImg?.url || product.GalleryImages[0].url);
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-500 animate-pulse">Загрузка...</div>;
  if (!product) return <div className="p-20 text-center font-bold text-red-500 uppercase">Товар не найден</div>;

  const colors = product.AvailableColors?.split(',').map((c: string) => c.trim()) || [];
  const amps = [product.has10A && "10", product.has16A && "16"].filter(Boolean) as string[];
  const plates = getFullPlatesList(product);
  const finalSKU = `ВА${selectedAmp}-${(product.BaseSKU || "ВА11").replace(/\D/g, "")}${selectedPlate?.id || "1"}${selectedColor !== "00" ? `-${selectedColor}` : ""}`;

  const UniversalColorPicker = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="text-xl text-blue-500">💧</span>
        <label className="text-[12px] font-bold uppercase text-slate-800 tracking-wider">Выбор цвета корпуса</label>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
        {colors.map((c: string) => (
          <div key={c} className="flex flex-col items-center gap-1.5 group">
            <button onClick={() => handleColorChange(c)} className={`w-11 h-11 rounded-lg transition-all border-2 ${selectedColor === c ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 shadow-md border-white' : 'border-slate-300 hover:border-slate-400'}`} style={{ backgroundColor: colorMap[c]?.hex }} />
            <span className={`text-[9px] font-bold uppercase text-center h-5 flex items-center ${selectedColor === c ? 'text-blue-600' : 'text-slate-500'}`}>{colorMap[c]?.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-10 text-slate-900 font-sans">
      <main className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-slate-200">
          
          {/* ЛЕВЫЙ БЛОК (ТОТ, КОТОРЫЙ ВЫГРУЖАЕМ) */}
          <div 
            ref={previewRef}
            className="p-8 flex flex-col items-center justify-center border-r border-slate-100 transition-all duration-700 relative overflow-hidden min-h-[600px]"
            style={{ 
              backgroundColor: activeTab === 'design' && customBg ? 'transparent' : (activeTab === 'design' ? bgPreview : '#064e3b'),
              backgroundImage: activeTab === 'design' && customBg ? `url(${customBg})` : (activeTab === 'main' ? 'radial-gradient(circle at 50% 50%, #059669 0%, #065f46 65%, #022c22 100%)' : 'none'),
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}
          >
            {activeTab === 'main' && (
              <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
                <div className="relative w-80 h-80 lg:w-[420px] lg:h-[420px] overflow-hidden group cursor-zoom-in rounded-2xl" onMouseMove={handleMouseMove}>
                  <Image src={getStrapiImageUrl(currentMainUrl)} alt="view" fill className="object-contain drop-shadow-2xl transition-transform duration-200 ease-out group-hover:scale-[2.5]" style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }} unoptimized />
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="relative w-80 h-80 lg:w-[420px] lg:h-[420px] animate-in fade-in duration-700">
                <Image src={getDesignerImage()} alt="frontal" fill className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]" unoptimized />
              </div>
            )}
            
            {(activeTab === 'main' || activeTab === 'pro') && (
              <div className="mt-8 bg-white/90 backdrop-blur-md px-10 py-4 rounded-3xl shadow-xl z-10 border border-white/50 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1 tracking-widest italic text-center">Артикул изделия</span>
                <div className="text-3xl font-mono font-black tracking-tight text-slate-900">{finalSKU}</div>
              </div>
            )}
          </div>

          {/* ПРАВЫЙ БЛОК */}
          <div className="p-10 lg:p-14 flex flex-col bg-slate-50/50">
            <div className="flex gap-8 mb-8 border-b border-slate-200">
              {[{ id: 'main', label: 'Информация' }, { id: 'pro', label: 'Инженерам' }, { id: 'design', label: 'Дизайнерам' }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-4 text-[12px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-green-700 border-b-4 border-green-700' : 'text-slate-400 hover:text-slate-600'}`}> {tab.label} </button>
              ))}
            </div>

            <div className="flex-grow space-y-6">
              {activeTab === 'main' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">{product.Name}</h1>
                  <UniversalColorPicker />
                </div>
              )}

              {activeTab === 'design' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <UniversalColorPicker />
                  <div className="pt-6 border-t border-slate-200 space-y-6">
                    <h3 className="text-[12px] font-bold uppercase text-slate-800 tracking-wider">Примерка в интерьере</h3>
                    <div className="flex flex-wrap gap-3">
                      {bgPalette.map((bg) => (
                        <button key={bg.hex} onClick={() => { setBgPreview(bg.hex); setCustomBg(null); }} className={`w-11 h-11 rounded-2xl border-2 transition-all ${!customBg && bgPreview === bg.hex ? 'border-green-600 scale-110 shadow-lg' : 'border-white shadow-md'}`} style={{ backgroundColor: bg.hex }} />
                      ))}
                    </div>
                    
                    {/* КНОПКА ВЫГРУЗКИ ФОТО */}
                    <div className="grid grid-cols-1 gap-3 pt-4">
                      <button 
                        onClick={exportAsImage}
                        className="flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                      >
                        <span>💾</span> Сохранить визуализацию (.PNG)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
               <AddToEstimateBtn product={{ ...product, id: `${product.id}-${finalSKU}`, SKU: finalSKU, Name: `${product.Name}, ${selectedAmp}А, ${colorMap[selectedColor]?.name}` }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}