export interface ProductVariant {
    id: number;
    ColorName: string;
    ColorCode: string;
    SKU: string;
  }
  
  export interface Product {
    id: number;
    documentId: string;
    Name: string;
    Series: string;
    Amperage: string;
    PlateType: string;
    Dimensions?: string;
    ExtraInfo?: string;
    Variants: ProductVariant[]; // Тот самый массив с цветами
  }
  
  // Тип для ответа от Strapi
  export interface StrapiResponse<T> {
    data: T[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }