import { colorMap } from '@/utils/constants';

export default function ProductInfoTab({ 
  product, scenario, selectedAmp, setSelectedAmp, 
  selectedColor, setSelectedPlateType, selectedPlateType,
  hasShutters, setHasShutters, currentRule, setActiveTab 
}: any) {
  const availableAmps = [product.has10A && "10", product.has16A && "16"].filter(Boolean) as string[];
  
  // Определяем типы изделий для логики интерфейса
  const isDimmer = product.BaseSKU?.startsWith("ДС");
  // Рамка - если начинается на Р, но не РС (Master) и не РСТ (Communication)
  const isFrame = product.BaseSKU?.startsWith("Р") && 
                  !product.BaseSKU?.startsWith("РС") && 
                  !product.BaseSKU?.startsWith("РСТ");

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
      <h1 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase leading-[0.9] tracking-tighter">
        {product.Name}
      </h1>
      
      <div className="flex gap-4">
        {/* Карточка цвета */}
        <div className="flex-1 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-slate-200" style={{ backgroundColor: colorMap[selectedColor]?.hex }} />
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Цвет</p>
            <p className="text-sm font-black text-slate-900 uppercase">{colorMap[selectedColor]?.name}</p>
          </div>
        </div>

        {/* Кнопка перехода к дизайну */}
        <div className="flex-1 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3 cursor-pointer hover:bg-blue-100 transition-all group" onClick={() => setActiveTab('design')}>
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xl shadow-md group-hover:scale-110 transition-transform">🎨</div>
          <p className="text-[10px] text-blue-700 font-bold underline decoration-blue-300 italic">Изменить цвет →</p>
        </div>
      </div>

      {/* БЛОК СИЛА ТОКА — Скрываем для рамок */}
      {!isFrame && (scenario.showAmps || isDimmer) && (
        <div className="space-y-3">
          <label className="text-[12px] font-bold uppercase text-slate-500 tracking-widest block italic">Сила тока</label>
          <div className="flex gap-3">
            {isDimmer ? (
              <button disabled className="flex-1 py-3 rounded-2xl font-black border-2 bg-slate-900 border-slate-900 text-white shadow-lg cursor-default">
                2А
              </button>
            ) : (
              availableAmps.map((a) => {
                const isBlocked = currentRule?.amps && !currentRule.amps.includes(a);
                return (
                  <button key={a} disabled={isBlocked} onClick={() => setSelectedAmp(a)}
                    className={`flex-1 py-3 rounded-2xl font-black border-2 transition-all ${isBlocked ? 'opacity-20 bg-slate-100' : (selectedAmp === a ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-300 text-slate-700 hover:border-slate-900')}`}
                  > {a}А </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* ШТОРКИ — Скрываем для рамок */}
      {!isFrame && scenario.showShutters && (
        <div className="space-y-3">
          <label className="text-[12px] font-bold uppercase text-slate-500 tracking-widest block italic">Защитные шторки</label>
          <div className="flex gap-3">
            <button 
              onClick={() => setHasShutters(false)} 
              className={`flex-1 py-4 rounded-2xl font-bold text-sm border-2 transition-all ${!hasShutters ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              Без шторок
            </button>
            <button 
              onClick={() => setHasShutters(true)} 
              className={`flex-1 py-4 rounded-2xl font-bold text-sm border-2 transition-all ${hasShutters ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              Со шторками
            </button>
          </div>
        </div>
      )}

      {/* ПЛАСТИНЫ — Скрываем для рамок */}
      {!isFrame && scenario.showPlates && (
        <div className="space-y-3">
          <label className="text-[12px] font-bold uppercase text-slate-500 tracking-widest block italic">Тип комплектации</label>
          <div className="grid grid-cols-1 gap-2">
            {[{ id: "none", label: "Без пластин" }, { id: "izol", label: "С пластиной изолирующей" }, { id: "mont", label: "С пластиной монтажной" }].map(p => {
              const testSKU = scenario.generateSKU({ amp: selectedAmp, color: selectedColor, plateType: p.id, shutters: hasShutters });
              const checkDigit = testSKU.split('-')[1]?.charAt(2);
              const isBlocked = currentRule?.plates && !currentRule.plates.includes(checkDigit);

              return (
                <button 
                  key={p.id} 
                  disabled={isBlocked} 
                  onClick={() => setSelectedPlateType(p.id)}
                  className={`px-6 py-4 rounded-2xl font-bold text-[13px] border-2 transition-all text-left uppercase ${isBlocked ? 'opacity-20 bg-slate-100' : (selectedPlateType === p.id ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-600')}`}
                > 
                  {p.label} 
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Сообщение для рамок, чтобы экран не казался пустым */}
      {isFrame && (
        <div className="mt-10 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">
            Для данного изделия дополнительные параметры не предусмотрены
          </p>
        </div>
      )}
    </div>
  );
}