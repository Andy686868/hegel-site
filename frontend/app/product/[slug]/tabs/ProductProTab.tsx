"use client";

export default function ProductProTab({ product, isBox }: any) {
  // Формирование URL для файлов
  const getUrl = (fileObj: any) => {
    if (!fileObj || !fileObj.url) return null;
    const url = fileObj.url;
    return url.startsWith('http') ? url : `http://127.0.0.1:1337${url}`;
  };

  // Парсинг динамических параметров (D:68, d:65, B:45, H:47)
  const parseTechParams = (paramsString: string) => {
    if (!paramsString) return [];
    return paramsString.split(',').map(item => {
      const [label, value] = item.split(':');
      return { label: label?.trim(), value: value?.trim() };
    }).filter(p => p.label && p.value);
  };

  const techParams = parseTechParams(product.TechParams || "");

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

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="border-l-4 border-slate-900 pl-4 py-1">
        <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">Технический паспорт</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic leading-none">
          {isBox ? "Характеристики монтажного оборудования" : "Технические данные изделия"}
        </p>
      </div>
      
      {/* 1. Блок визуальной схемы для коробок */}
      {isBox && product.TechnicalSketch && (
        <div className="p-4 bg-white rounded-[24px] border border-slate-200 shadow-sm flex justify-center">
          <img 
            src={getUrl(product.TechnicalSketch)} 
            alt="Схема размеров" 
            className="max-h-[200px] object-contain" 
          />
        </div>
      )}
      

      {/* 2. Основная сетка параметров */}
      <div className="grid grid-cols-2 gap-3">
        {isBox ? (
          <>
            <div className="p-4 bg-white rounded-[20px] border border-slate-200 shadow-sm flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">В упаковке</span>
              <span className="font-black text-base text-slate-900 uppercase">{product.PackCount || "—"}</span>
            </div>
            <div className="p-4 bg-white rounded-[20px] border border-slate-200 shadow-sm flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Защита IP</span>
              <span className="font-black text-base text-slate-900 uppercase">{product.Vlaga || "IP20"}</span>
            </div>
            <div className="p-4 bg-white rounded-[20px] border border-slate-200 shadow-sm flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Огнестойкость</span>
              <span className="font-black text-base text-slate-900 uppercase">{product.FireResistance || "850°C"}</span>
            </div>
            <div className="p-4 bg-white rounded-[20px] border border-slate-200 shadow-sm flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Температура</span>
              <span className="font-black text-sm text-slate-900 uppercase">{product.WorkingTemp || "-25+40°C"}</span>
            </div>
            <div className="p-4 bg-white rounded-[20px] border border-slate-200 shadow-sm flex flex-col gap-1 col-span-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Материал / Напряжение</span>
              <span className="font-black text-sm text-slate-900 uppercase">
                {product.Material || "ПОЛИПРОПИЛЕН"} / {product.Voltage || "400В"}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 bg-white rounded-[20px] border border-slate-200 shadow-sm flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Защита</span>
              <span className="font-black text-base text-slate-900 uppercase">{product.Vlaga || "IP20"}</span>
            </div>
            <div className="p-4 bg-white rounded-[20px] border border-slate-200 shadow-sm flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isCommunication ? "Выход" : "Напряжение"}</span>
              <span className="font-black text-base text-slate-900 uppercase">{product.Voltage || "250В ~"}</span>
            </div>
          </>
        )}
      </div>

      {/* 3. Динамическая таблица размеров (D, d, B, H...) */}
      {isBox && techParams.length > 0 && (
        <div className="overflow-hidden border border-slate-200 rounded-[24px] bg-white shadow-sm">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Геометрические параметры (мм)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  {techParams.map((p, i) => (
                    <th key={i} className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase border-r border-slate-100 last:border-0">{p.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {techParams.map((p, i) => (
                    <td key={i} className="px-3 py-3 text-sm font-black text-slate-900 border-r border-slate-100 last:border-0">{p.value}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Внешние габариты (общие) */}
      <div className="p-4 bg-slate-900 rounded-[20px] flex justify-between items-center text-white">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Внешние габариты</span>
        <span className="font-black text-base uppercase">{product.Dimensions || "—"}</span>
      </div>

      {/* 5. Документация */}
      <div className="pt-2 space-y-3">
        <label className="text-[11px] font-bold uppercase text-slate-500 tracking-widest block border-b border-slate-100 pb-2 italic text-center">Файлы и чертежи</label>
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