import { connectDB, MONGO_URI, PORT as PORTENV } from '#config';
import * as error from '#middlewares/error.middleware';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import router from './routes/index.js';

const production = (app) => {
  if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    const root_folder = path.join(__dirname, '../');

    app.use(express.static(path.join(root_folder, 'frontend/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(root_folder, 'frontend/dist/index.html'));
    });
  } else {
    app.get('/', (req, res) => {
      res.send('API is running...');
    });
  }
};

const server = (HOST, PORT) => {
  const app = express();

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use('/api', router);

  production(app);

  app.use(error.notFound);
  app.use(error.errorMiddleware);

  const serverInstance = app.listen(PORT, HOST, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on http://${HOST}:${PORT}`);
  });

  return serverInstance;
};

export const run = (HOST = 'localhost', PORT = PORTENV, options = {}) => {
  console.log('\n'.repeat(100));
  connectDB(MONGO_URI, () => server(HOST, PORT));
};
