import path from 'path';

export default ({ env }) => {
  // Если есть ссылка на облачную базу — включаем Postgres. Если нет — старый добрый SQLite.
  const client = env('DATABASE_URL') ? 'postgres' : 'sqlite';

  const connections = {
    postgres: {
      connection: {
        connectionString: env('DATABASE_URL'),
        ssl: { rejectUnauthorized: false }, // Нужно для Neon/Render
      },
      pool: { min: 2, max: 10 },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};