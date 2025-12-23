"use client";

import { useState, useEffect, use, MouseEvent, useRef } from 'react';
import Image from 'next/image';
import AddToEstimateBtn from '@/components/AddToEstimateBtn';
import * as htmlToImage from 'html-to-image';
import { getScenario } from '@/utils/productScenarios';

import ProductInfoTab from './tabs/ProductInfoTab';
import ProductProTab from './tabs/ProductProTab';
import ProductDesignTab from './tabs/ProductDesignTab';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmp, setSelectedAmp] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTab, setActiveTab] = useState('main');
  const [selectedPlateType, setSelectedPlateType] = useState("none"); 
  const [hasShutters, setHasShutters] = useState(false);
  const [bgPreview, setBgPreview] = useState('#334155'); 
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [currentMainUrl, setCurrentMainUrl] = useState<string | null>(null);
  const [currentSchemaUrl, setCurrentSchemaUrl] = useState<string | null>(null);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
        const res = await fetch(`${strapiUrl}/api/product2s?filters[Slug][$eq]=${slug}&populate=*`);
        const json = await res.json();
        if (json.data?.[0]) {
          const data = json.data[0];
          setProduct(data);
          if (data.has10A) setSelectedAmp("10"); else if (data.has16A) setSelectedAmp("16");
          const availableColors = data.AvailableColors?.split(',').map((c: string) => c.trim()) || [];
          setSelectedColor(availableColors[0]);
          if (data.MainImage?.length > 0) setCurrentMainUrl(data.MainImage[0].url);
          if (data.SchemaImages?.length > 0) setCurrentSchemaUrl(data.SchemaImages[0].url);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchData();
  }, [slug]);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse tracking-widest uppercase">Загрузка...</div>;
  if (!product) return <div className="p-20 text-center font-bold text-red-500">ТОВАР НЕ НАЙДЕН</div>;

  const scenario = getScenario(product.BaseSKU, product.Series);
  const finalSKU = scenario.generateSKU({ amp: selectedAmp, color: selectedColor, plateType: selectedPlateType, shutters: hasShutters });
  const currentRule = product.Constraints?.[selectedColor];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const rule = product.Constraints?.[color];
    if (rule && rule.amps && !rule.amps.includes(selectedAmp)) setSelectedAmp(rule.amps[0]);
  };

  const getStrapiImageUrl = (url: string | null) => url ? (url.startsWith('http') ? url : `http://127.0.0.1:1337${url}`) : '/no-photo.png';

  const exportAsImage = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, { pixelRatio: 2, skipFonts: true });
      const link = document.createElement('a'); link.download = `Hegel_${finalSKU}.png`; link.href = dataUrl; link.click();
    } catch (error) { console.error(error); }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (activeTab !== 'main') return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.pageX - left) / width) * 100, y: ((e.pageY - top) / height) * 100 });
  };

  const getDesignerImage = () => {
    const coloredImg = product.GalleryImages?.find((img: any) => img.name.includes(selectedColor) || img.url.includes(selectedColor));
    return getStrapiImageUrl(coloredImg?.url || product.GalleryImages?.[0]?.url);
  };

  return (
    <div className="min-h-screen bg-white py-10 text-slate-900">
      <main className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-slate-100">
          <div ref={previewRef} className="p-8 flex flex-col items-center justify-center border-r border-slate-100 relative min-h-[600px]"
            style={{ 
              backgroundColor: activeTab === 'design' && !customBg ? bgPreview : (activeTab === 'main' ? '#064e3b' : '#f8fafc'),
              backgroundImage: activeTab === 'design' && customBg ? `url(${customBg})` : (activeTab === 'main' ? 'radial-gradient(circle at 50% 50%, #059669 0%, #064e3b 65%, #022c22 100%)' : 'none'),
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}>
            <div className={`relative transition-all duration-500 overflow-hidden group rounded-2xl ${activeTab === 'design' ? 'w-[320px] h-[320px]' : 'w-[420px] h-[420px]'}`} onMouseMove={handleMouseMove}>
                <Image src={activeTab === 'design' ? getDesignerImage() : (activeTab === 'pro' ? getStrapiImageUrl(currentSchemaUrl) : getStrapiImageUrl(currentMainUrl))} alt="view" fill className={`object-contain transition-transform duration-200 ${activeTab === 'main' ? 'group-hover:scale-[2.5] cursor-zoom-in' : ''} ${activeTab !== 'pro' ? 'drop-shadow-2xl' : ''}`} style={activeTab === 'main' ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}} unoptimized />
            </div>
            {activeTab === 'main' && (
               <div className="flex gap-2 mt-8">{(product.MainImage || []).map((img: any) => (
                    <button key={img.url} onClick={() => setCurrentMainUrl(img.url)} className={`w-14 h-14 rounded-xl border-2 overflow-hidden shadow-sm transition-all ${currentMainUrl === img.url ? 'border-yellow-400 scale-110 shadow-lg' : 'border-slate-600 opacity-50'}`}><Image src={getStrapiImageUrl(img.url)} alt="thumb" width={56} height={56} className="object-cover" unoptimized /></button>
                 ))}</div>
            )}
            {activeTab !== 'design' && (
              <div className="mt-8 bg-white/90 backdrop-blur-md px-10 py-4 rounded-3xl shadow-xl border border-white/50 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1 italic tracking-widest leading-none">Артикул изделия</span>
                <div className="text-3xl font-mono font-black text-slate-900 tracking-tight">{finalSKU}</div>
              </div>
            )}
          </div>

          <div className="p-10 lg:p-14 flex flex-col bg-slate-50/30">
            <div className="flex gap-8 mb-8 border-b border-slate-200">
              {[{ id: 'main', label: 'Информация' }, { id: 'pro', label: <span>Инженерам/<br />монтажникам</span> }, { id: 'design', label: 'Дизайнерам' }].map(tab => (
                <button key={tab.id as string} onClick={() => setActiveTab(tab.id as string)} className={`pb-4 text-[12px] font-black uppercase tracking-widest transition-all text-left ${activeTab === tab.id ? 'text-green-700 border-b-4 border-green-700' : 'text-slate-400 hover:text-slate-600'}`}> {tab.label} </button>
              ))}
            </div>

            <div className="flex-grow">
              {activeTab === 'main' && <ProductInfoTab product={product} scenario={scenario} selectedAmp={selectedAmp} setSelectedAmp={setSelectedAmp} selectedColor={selectedColor} setSelectedPlateType={setSelectedPlateType} selectedPlateType={selectedPlateType} hasShutters={hasShutters} setHasShutters={setHasShutters} currentRule={currentRule} setActiveTab={setActiveTab} />}
              {activeTab === 'pro' && <ProductProTab product={product} />}
              {activeTab === 'design' && <ProductDesignTab product={product} selectedColor={selectedColor} handleColorChange={handleColorChange} bgPreview={bgPreview} setBgPreview={setBgPreview} setCustomBg={setCustomBg} customBg={customBg} exportAsImage={exportAsImage} currentRule={currentRule} />}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
               <AddToEstimateBtn product={{ ...product, id: `${product.id}-${finalSKU}`, SKU: finalSKU, Name: `${product.Name} (${finalSKU})` }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}