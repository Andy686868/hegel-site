import type { Schema, Struct } from '@strapi/strapi';

export interface ManualVariantsManualVariants extends Struct.ComponentSchema {
  collectionName: 'components_manual_variants_manual_variants';
  info: {
    displayName: 'ManualVariants';
  };
  attributes: {
    FullSKU: Schema.Attribute.String;
    VariantImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'manual-variants.manual-variants': ManualVariantsManualVariants;
    }
  }
}
