const buildDatabaseConfig = () => {
  const common = { type: 'postgres', synchronize: true };

  if (process.env.DATABASE_URL) {
    return { ...common, url: process.env.DATABASE_URL };
  }

  return {
    ...common,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
};

export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    useCors: process.env.USE_CORS === 'true' || process.env.USE_CORS === '1',
    corsOrigin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((item) => item.trim())
      : 'http://localhost:3000',
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    database: buildDatabaseConfig(),
  };
};
