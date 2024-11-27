import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

export function loadEnv() {
  const path = '.env'; // default path

  const currentEnvs = dotenv.config({ path });
  dotenvExpand.expand(currentEnvs);
}
