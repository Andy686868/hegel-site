import Link from 'next/link';
import Image from 'next/image';
import AddToEstimateBtn from './AddToEstimateBtn';

interface ProductCardProps {
  data: any;
}

export default function ProductCard({ data }: ProductCardProps) {
  const product = data.attributes || data;
  const { Name, SKU, Series, Images, Slug } = product;

  let imgUrl = null;
  if (Images?.data?.[0]?.attributes?.url) {
    imgUrl = `http://localhost:1337${Images.data[0].attributes.url}`;
  } else if (Array.isArray(Images) && Images[0]?.url) {
    imgUrl = `http://localhost:1337${Images[0].url}`;
  }

  return (
    // Добавили: group (для управления вложенными элементами при ховере), 
    // hover:-translate-y-2 (подъем), hover:shadow-2xl (тень)
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative flex flex-col">
      
      <Link href={`/product/${Slug}`} className="block relative h-64 overflow-hidden bg-gray-50 p-4">
         {/* Добавили: group-hover:scale-110 (увеличение картинки при наведении на карточку) */}
         {imgUrl ? (
            <Image
              src={imgUrl}
              alt={Name}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-100 transition-colors group-hover:bg-gray-200">
                <span className="text-4xl mb-2">📷</span>
                <span className="text-xs uppercase font-bold tracking-widest">Нет фото</span>
            </div>
          )}
          {/* Серия товара (значок сверху) */}
          {Series && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
              {Series}
            </span>
          )}
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-green-700 font-bold mb-1 uppercase tracking-wider opacity-70">Артикул: {SKU}</div>
        {/* Название с ховер-эффектом */}
        <Link href={`/product/${Slug}`} className="group-hover:text-green-800 transition-colors">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-4" title={Name}>
                {Name}
            </h3>
        </Link>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
            <AddToEstimateBtn product={product} />
        </div>
      </div>
    </div>
  );
}