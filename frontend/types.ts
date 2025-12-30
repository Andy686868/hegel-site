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
  Slug: string;
  BaseSKU?: string;
  SKU?: string;
  Images?: any;
  MainImage?: any;
  createdAt: string;
  Variants: ProductVariant[];
}

// НОВОЕ: Интерфейс для коробок
export interface ProductBox {
  id: number;
  documentId: string;
  Name: string;
  BaseSKU: string;
  Slug: string;
  Series: string;
  Type: string;
  InnerSize?: string;
  NicheSize?: string;
  Dimensions?: string;
  Material?: string;
  Voltage?: string;
  Vlaga?: string;
  PackCount?: string;
  FireResistance?: string;
  WorkingTemp?: string;
  TechParams?: string; // Строка с тех. параметрами через |
  Images?: any;
  MainImage?: any;
  createdAt: string;
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

// НОВОЕ: Объединенный тип для списков
export type AnyProduct = Product | ProductBox;