import express from 'express';
import 'reflect-metadata';
import debug from 'debug';

import './database/connection';
import routes from './routes';

const app = express();
const PORT = 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(PORT, () => debug.log(`Server running at: ${PORT}`));
