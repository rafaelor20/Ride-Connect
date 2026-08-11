import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'path';
import fs from 'fs';

export function loadEnv() {
  const envFilename =
    process.env.NODE_ENV === 'test'
      ? '.env.test'
      : process.env.NODE_ENV === 'development'
      ? '.env.development'
      : '.env';

  // Check current directory first, then parent directory
  const resolvedPath = fs.existsSync(envFilename)
    ? envFilename
    : fs.existsSync(path.join('..', envFilename))
    ? path.join('..', envFilename)
    : envFilename;

  const currentEnvs = dotenv.config({ path: resolvedPath });
  dotenvExpand.expand(currentEnvs);

  // Fallback string interpolation if DATABASE_URL contains unexpanded ${VARIABLES}
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('${')) {
    const user = process.env.POSTGRES_USER || 'postgres';
    const password = process.env.POSTGRES_PASSWORD || 'root';
    const host = process.env.POSTGRES_HOST || 'postgres';
    const port = process.env.POSTGRES_PORT || '5432';
    const db = process.env.POSTGRES_DB || 'ride-connect';
    process.env.DATABASE_URL = `postgresql://${user}:${password}@${host}:${port}/${db}?schema=public`;
  }
}

