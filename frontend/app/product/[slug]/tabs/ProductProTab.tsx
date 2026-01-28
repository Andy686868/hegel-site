"use client";
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';
const API_URL = 'https://hegel-backend.onrender.com';

export default function ProductProTab({ product, isBox }: any) {
  const getUrl = (fileObj: any) => {
    if (!fileObj || !fileObj.url) return null;
    const url = fileObj.url;
    return url.startsWith('http') ? url : `${API_URL}${url}`;
  };

  const parseTechParams = (paramsString: string) => {
    if (!paramsString) return [];
    return paramsString
      .split('|')
      .map(item => {
        const [label, value] = item.split(':');
        // Очищаем заголовок: убираем пробелы и удаляем _t или _T в конце
        const cleanLabel = label?.trim().replace(/_t$/i, '');
        return { label: cleanLabel, value: value?.trim() };
      })
      .filter(p => p.label && p.value && p.label !== 'Config_ID' && p.value !== 'nan');
  };

  const techParams = parseTechParams(product.TechParams || "");

  // Функция для быстрого получения значения из тех. параметров
  const getParam = (key: string) => techParams.find(p => p.label === key)?.value;

  const isCommunication = 
    product.BaseSKU?.startsWith("РСТ") || 
    product.BaseSKU?.startsWith("РСК") || 
    product.BaseSKU?.startsWith("РСКК") ||
    product.BaseSKU?.startsWith("РСКТ") || 
    product.BaseSKU?.startsWith("РСТВ");

  const files = [
    { label: 'Схема (PDF)', url: getUrl(product.SchemaFiles), color: 'bg-slate-900', textColor: 'text-white' },
    { label: 'Сертификат', url: getUrl(product.CertificateFiles), color: 'bg-blue-700', textColor: 'text-white' },
    { label: 'Эскиз (DWG)', url: getUrl(product.SketchFiles), color: 'bg-white border border-slate-200', textColor: 'text-slate-900', iconBg: 'bg-slate-100' },
    { label: '3D модель', url: getUrl(product.ModelFiles), color: 'bg-green-600', textColor: 'text-white' }
  ];

  // Инженерные параметры для вертикального списка
  const engineeringSpecs = [
    { label: 'Габаритные размеры', value: product.Dimensions },
    { label: 'Внутренние размеры', value: product.InnerSize },
    { label: 'Размер ниши', value: product.NicheSize },
    { label: 'Межцентровое расстояние', value: product.CenterDist },
    { label: 'Напряжение', value: product.Voltage },
    { label: 'Огнестойкость', value: product.FireResistance },
    { label: 'Рабочая температура', value: product.WorkingTemp },
  ].filter(s => s.value && s.value !== 'nan');

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="border-l-4 border-slate-900 pl-4 py-1">
        <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">Технический паспорт</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic leading-none">
          {isBox ? "Параметры для конструкторов и монтажа" : "Технические данные изделия"}
        </p>
      </div>
      
      {isBox && product.TechnicalSketch && (
        <div className="p-4 bg-white rounded-[24px] border border-slate-200 shadow-sm flex justify-center">
          <img 
            src={getUrl(product.TechnicalSketch)} 
            alt="Схема размеров" 
            className="max-h-[200px] object-contain" 
          />
        </div>
      )}

      {/* ОСНОВНЫЕ ПАРАМЕТРЫ ДЛЯ МОНТАЖНИКА */}
      <div className="space-y-4">
        <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest block italic px-1">Основные параметры</label>
        <div className="grid grid-cols-1 gap-2">
           {engineeringSpecs.map((spec, idx) => (
             <div key={idx} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{spec.label}</span>
                <span className="text-xs font-black text-slate-900 uppercase">{spec.value}</span>
             </div>
           ))}
        </div>
      </div>

      {/* СПЕЦИФИЧЕСКИЕ МОНТАЖНЫЕ ДАННЫЕ (ГРИД) */}
      {isBox && (
        <div className="grid grid-cols-2 gap-3">
            {getParam('InletCount') && (
              <div className="p-4 bg-green-50 rounded-[20px] border border-green-100 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest leading-none">Кол-во вводов</span>
                <span className="font-black text-base text-green-900 uppercase">{getParam('InletCount')}</span>
              </div>
            )}
            {getParam('MaxPipeDiam') && (
              <div className="p-4 bg-green-50 rounded-[20px] border border-green-100 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest leading-none">Макс. Ø трубы</span>
                <span className="font-black text-base text-green-900 uppercase">{getParam('MaxPipeDiam')} мм</span>
              </div>
            )}
        </div>
      )}

      {/* ГЕОМЕТРИЯ КОНСТРУКТОРА (БЕЗ СЛАЙДЕРА, С ПЕРЕНОСОМ) */}
      {isBox && techParams.length > 0 && (
        <div className="space-y-3">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 italic">Геометрия конструктора (мм)</span>
           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
             {techParams.map((p, i) => (
               <div key={i} className="bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-sm transition-transform hover:scale-105">
                 <span className="text-[9px] font-black text-slate-500 uppercase leading-none mb-1">{p.label}</span>
                 <span className="text-sm font-mono font-black text-white">{p.value}</span>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* ФАЙЛЫ */}
      <div className="pt-2 space-y-3">
        <label className="text-[11px] font-bold uppercase text-slate-500 tracking-widest block border-b border-slate-100 pb-2 italic text-center">Документация</label>
        <div className="grid grid-cols-2 gap-2">
          {files.map((file, idx) => (
            <a key={idx} href={file.url || '#'} download className={`flex flex-col gap-2 p-3 ${file.color} ${file.textColor} rounded-[16px] group shadow-md transition-all ${!file.url ? 'opacity-20 grayscale pointer-events-none' : 'hover:opacity-90 active:scale-95'}`}>
               <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${file.iconBg || 'bg-white/10'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5V19M12 19L19 12M12 19L5 12"/>
                </svg>
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-center leading-tight">{file.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}