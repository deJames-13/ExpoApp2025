import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import { connectDB } from './config/db.js';
import { MONGO_URI, PORT, HOST } from './config/env.js';
import * as err from './middlewares/error.middleware.js';
import router from './routes/index.js';

const parseArgs = () => {
  const args = process.argv.slice(2);
  const params = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      params[key] = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
    }
  }

  return params;
};

const server = () => {
  const app = express();
  const args = parseArgs();
  const serverHost = args.host || HOST;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser());
  app.use('/api', router);

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

  app.use(err.notFound);
  app.use(err.errorHandler);

  connectDB(MONGO_URI, () => {
    app.listen(PORT, serverHost, () => {
      console.log(`Server is running on ${serverHost}:${PORT}`);
    });
  });
};

server();
