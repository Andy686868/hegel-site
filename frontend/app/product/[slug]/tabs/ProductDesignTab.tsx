// tabs/ProductDesignTab.tsx
import { colorMap, bgPalette } from '@/utils/constants';

export default function ProductDesignTab({ 
  product, selectedColor, handleColorChange, bgPreview, 
  setBgPreview, setCustomBg, customBg, exportAsImage 
}: any) {
  const colorIds = product.AvailableColors?.split(',').map((c: string) => c.trim()) || [];

  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      {/* СЕКЦИЯ ЦВЕТА КОРПУСА */}
      <div className="space-y-4">
        <label className="text-[12px] font-bold uppercase text-slate-800 tracking-wider block">
          Цвет корпуса
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {colorIds.map((c: any) => (
            <div key={c} className="flex flex-col items-center gap-1.5 group">
              <button 
                onClick={() => handleColorChange(c)} 
                className={`w-11 h-11 rounded-lg transition-all border ${
                  selectedColor === c 
                  ? 'border-blue-600 border-2 scale-105 shadow-none' 
                  : 'border-slate-200 hover:border-slate-300'
                }`} 
                style={{ 
                  backgroundColor: colorMap[c]?.hex,
                  boxShadow: selectedColor === c ? 'none' : 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }} 
              />
              <span className={`text-[9px] font-bold uppercase text-center leading-tight h-5 flex items-center ${
                selectedColor === c ? 'text-blue-600' : 'text-slate-500'
              }`}>
                {colorMap[c]?.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* СЕКЦИЯ ВИЗУАЛИЗАЦИИ */}
      <div className="pt-8 border-t border-slate-100 space-y-6">
        <div className="flex flex-col gap-1">
            <h3 className="text-[12px] font-bold uppercase text-slate-800 tracking-wider">Примерка на стену</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-tight">Матовые пресеты для фона</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {bgPalette.map((bg) => (
            <button 
              key={bg.hex} 
              onClick={() => { setBgPreview(bg.hex); setCustomBg(null); }} 
              className={`w-12 h-12 rounded-xl border transition-all ${
                !customBg && bgPreview === bg.hex 
                ? 'border-green-600 border-2 scale-110' 
                : 'border-transparent shadow-sm'
              }`} 
              style={{ backgroundColor: bg.hex }} 
            />
          ))}
          
          <div className="relative w-12 h-12 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center bg-white cursor-pointer overflow-hidden">
            <input 
              type="color" 
              value={bgPreview} 
              onChange={(e) => { setBgPreview(e.target.value); setCustomBg(null); }} 
              className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer opacity-0" 
            />
            <span className="text-lg grayscale opacity-50">🎨</span>
          </div>
        </div>

        <div className="space-y-3">
            <label 
              htmlFor="bg-final" 
              className="flex items-center justify-center py-5 bg-slate-50/50 rounded-[20px] border-2 border-dashed border-slate-200 cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-all text-[11px] font-bold uppercase tracking-widest text-slate-400"
            >
              {customBg ? '✨ Обои загружены' : 'Загрузить свои обои'}
            </label>
            <input 
              type="file" 
              id="bg-final" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setCustomBg(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }} 
            />
            
            <button 
              onClick={exportAsImage} 
              className="w-full py-5 bg-slate-900 text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-none active:scale-[0.98]"
            >
              💾 Сохранить изображение
            </button>
        </div>
      </div>
    </div>
  );
}