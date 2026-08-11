import dotenv from 'dotenv';
import app, { init } from '@/app';

dotenv.config();

const port = Number(process.env.PORT) || 5000;

init()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      /* eslint-disable-next-line no-console */
      console.log(`Server is listening on port ${port}.`);
    });
  })
  .catch((err) => {
    /* eslint-disable-next-line no-console */
    console.error('Failed to start server:', err);
    process.exit(1);
  });

