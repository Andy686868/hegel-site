const path = require('path');
// Парсим строку подключения postgres://user:pass@host:port/db
const parse = require('pg-connection-string').parse;

module.exports = ({ env }) => {
  // Если есть переменная DATABASE_URL (мы её добавим в облаке), используем Postgres
  if (env('DATABASE_URL')) {
    const config = parse(env('DATABASE_URL'));
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: {
            rejectUnauthorized: false, // Важно для Neon/Render
          },
        },
        debug: false,
      },
    };
  }

  // Иначе (на компьютере) оставляем SQLite
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};