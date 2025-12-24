import Link from 'next/link';
import Image from 'next/image';
import AddToEstimateBtn from './AddToEstimateBtn';

interface ProductCardProps {
  data: any;
}

export default function ProductCard({ data }: ProductCardProps) {
  // Strapi 5 возвращает данные плоским списком. 
  // Если вдруг придут старые данные через .attributes, оставляем поддержку.
  const product = data.attributes || data;
  
  // Унифицируем поля. В коробках и product2s мы используем BaseSKU
  const { Name, BaseSKU, SKU, Series, Images, MainImage, Slug } = product;
  const finalSKU = BaseSKU || SKU || "—";

  // Универсальный поиск URL картинки (проверяем MainImage, потом Images)
  const getImageUrl = () => {
    const rawImg = (MainImage && MainImage[0]) || (Images && Images[0]) || (Images?.data && Images.data[0]);
    
    // Обработка разных форматов Strapi (массив объектов или вложенный attributes)
    const url = rawImg?.url || rawImg?.attributes?.url;
    
    if (!url) return null;
    return url.startsWith('http') ? url : `http://127.0.0.1:1337${url}`;
  };

  const imgUrl = getImageUrl();

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative flex flex-col h-full">
      
      <Link href={`/product/${Slug}`} className="block relative h-64 overflow-hidden bg-gray-50 p-4">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={Name}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-110"
              unoptimized // Чтобы не было проблем с доменами localhost в Next.js
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-100 transition-colors group-hover:bg-gray-200">
                <span className="text-4xl mb-2">📷</span>
                <span className="text-xs uppercase font-bold tracking-widest">Нет фото</span>
            </div>
          )}
          
          {Series && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
              {Series}
            </span>
          )}
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-[10px] text-green-700 font-bold mb-1 uppercase tracking-wider opacity-70">
          Артикул: {finalSKU}
        </div>
        
        <Link href={`/product/${Slug}`} className="group-hover:text-green-800 transition-colors">
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight mb-4 h-12" title={Name}>
                {Name}
            </h3>
        </Link>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
            <AddToEstimateBtn product={{...product, SKU: finalSKU}} />
        </div>
      </div>
    </div>
  );
}