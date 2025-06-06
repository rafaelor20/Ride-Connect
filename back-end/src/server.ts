import dotenv from 'dotenv';
import app, { init } from '@/app';

dotenv.config();

const port = +process.env.PORT;

init().then(() => {
  app.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Server is listening on port ${port}.`);
  });
});
