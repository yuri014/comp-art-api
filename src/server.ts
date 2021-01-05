import express from 'express';
import 'reflect-metadata';
import cors from 'cors';
import debug from 'debug';

import './database/connection';

const app = express();
const PORT = 3333;

app.use(cors());

app.listen(PORT, () => debug.log(`Server running at: ${PORT}`));
