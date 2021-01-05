import { createConnection } from 'typeorm';
import debug from 'debug';

createConnection()
  .then(() => debug.log('Database connected'))
  .catch(error => debug.log(error));
