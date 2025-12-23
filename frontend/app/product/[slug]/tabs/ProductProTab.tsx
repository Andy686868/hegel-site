"use client";

export default function ProductProTab({ product }: any) {
  // Функция формирования URL для файлов
  const getUrl = (fileObj: any) => {
    if (!fileObj || !fileObj.url) return null;
    const url = fileObj.url;
    return url.startsWith('http') ? url : `http://127.0.0.1:1337${url}`;
  };

  // Проверка всех типов коммуникационных розеток (включая РСКТ и РСТВ)
  const isCommunication = 
    product.BaseSKU?.startsWith("РСТ") || 
    product.BaseSKU?.startsWith("РСК") || 
    product.BaseSKU?.startsWith("РСКК") ||
    product.BaseSKU?.startsWith("РСКТ") || 
    product.BaseSKU?.startsWith("РСТВ");

  // Массив всех файлов для скачивания
  const files = [
    { 
      label: 'Схема (PDF)', 
      url: getUrl(product.SchemaFiles), 
      color: 'bg-slate-900', 
      textColor: 'text-white' 
    },
    { 
      label: 'Сертификат', 
      url: getUrl(product.CertificateFiles), 
      color: 'bg-blue-700', 
      textColor: 'text-white' 
    },
    { 
      label: 'Эскиз (DWG)', 
      url: getUrl(product.SketchFiles), 
      color: 'bg-white border border-slate-200', 
      textColor: 'text-slate-900', 
      iconBg: 'bg-slate-100' 
    },
    { 
      label: '3D модель', 
      url: getUrl(product.ModelFiles), 
      color: 'bg-green-600', 
      textColor: 'text-white' 
    }
  ];

  // Значение по умолчанию для "Выхода"
  const getDefaultOutput = () => {
    if (product.BaseSKU?.startsWith("РСТВ")) return "TV (COAX)";
    if (product.BaseSKU?.startsWith("РСКТ")) return "RJ-45 / RJ-11";
    if (product.BaseSKU?.startsWith("РСК")) return "RJ-45";
    if (product.BaseSKU?.startsWith("РСТ")) return "RJ-11";
    return "RJ-45";
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Секция характеристик */}
      <div className="border-l-4 border-slate-900 pl-4 py-1">
        <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">Технический паспорт</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic leading-none">Характеристики изделия</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Поле 1: Степень защиты (Черный цвет) */}
        <div className="p-4 bg-white rounded-[20px] border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Защита</span>
          <span className="font-black text-base text-slate-900 uppercase">
            {product.Vlaga || "IP20"}
          </span>
        </div>

        {/* Поле 2: Напряжение или Выход */}
        <div className="p-4 bg-white rounded-[20px] border border-slate-200 shadow-sm flex flex-col gap-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {isCommunication ? "Выход" : "Напряжение"}
          </span>
          <span className="font-black text-base text-slate-900 uppercase">
            {product.Voltage || (isCommunication ? getDefaultOutput() : "250В ~")}
          </span>
        </div>

        {/* Поле 3: Габариты */}
        <div className="p-4 bg-white rounded-[20px] border border-slate-200 shadow-sm flex flex-col gap-1 col-span-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Габариты</span>
          <span className="font-black text-base text-slate-900 uppercase">
            {product.Dimensions || "70х70х23 мм"}
          </span>
        </div>
      </div>

      {/* Секция файлов */}
      <div className="pt-2 space-y-3">
        <label className="text-[11px] font-bold uppercase text-slate-500 tracking-widest block border-b border-slate-100 pb-2 italic">Файлы и документация</label>
        <div className="grid grid-cols-2 gap-2">
          {files.map((file, idx) => (
            <a 
              key={idx} 
              href={file.url || '#'} 
              download 
              className={`flex flex-col gap-2 p-3 ${file.color} ${file.textColor} rounded-[16px] group shadow-md transition-all ${!file.url ? 'opacity-20 grayscale pointer-events-none' : 'hover:opacity-90 active:scale-95'}`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:translate-y-0.5 ${file.iconBg || 'bg-white/10'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider leading-tight text-center">
                {file.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}