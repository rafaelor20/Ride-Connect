import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'path';
import fs from 'fs';

function findEnvFile(filename: string): string | null {
  if (fs.existsSync(filename)) {
    return filename;
  }
  const parentPath = path.join('..', filename);
  if (fs.existsSync(parentPath)) {
    return parentPath;
  }
  return null;
}

export function loadEnv() {
  let resolvedPath: string | null = null;

  // Se for ambiente de testes, a prioridade absoluta é o .env.test
  if (process.env.NODE_ENV === 'test') {
    resolvedPath = findEnvFile('.env.test') || '.env.test';
  } else {
    // Para todos os outros ambientes, se o .env existir, ele tem prioridade máxima
    const defaultEnv = findEnvFile('.env');
    if (defaultEnv) {
      resolvedPath = defaultEnv;
    } else if (process.env.NODE_ENV === 'development') {
      resolvedPath =
        findEnvFile('.env.local') ||
        findEnvFile('.env.development') ||
        '.env';
    } else {
      resolvedPath = findEnvFile('.env.local') || '.env';
    }
  }

  const currentEnvs = dotenv.config({ path: resolvedPath });
  dotenvExpand.expand(currentEnvs);

  // Fallback para expansao manual caso a DATABASE_URL possua variaveis ${VAR}
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('${')) {
    const user = process.env.POSTGRES_USER || 'postgres';
    const password = process.env.POSTGRES_PASSWORD || 'root';
    const host = process.env.POSTGRES_HOST || 'postgres';
    const port = process.env.POSTGRES_PORT || '5432';
    const db = process.env.POSTGRES_DB || 'ride-connect';
    process.env.DATABASE_URL = `postgresql://${user}:${password}@${host}:${port}/${db}?schema=public`;
  }
}
