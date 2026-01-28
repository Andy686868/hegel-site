module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      header: '*',
      origin: ['*'], // 👈 ЗВЕЗДОЧКА разрешает доступ всем (localhost, 127.0.0.1 и т.д.)
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];