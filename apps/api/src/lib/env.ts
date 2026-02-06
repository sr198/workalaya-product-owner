export const env = {
  PORT: Number(process.env.PORT) || 3001,
  HOST: process.env.HOST || '0.0.0.0',
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_SECRET: process.env.JWT_SECRET,
} as const;

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (!env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
