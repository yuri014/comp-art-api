import debug from 'debug';
import https from 'https';
import fs from 'fs-extra';
import mongoose from 'mongoose';

import app, { PORT } from './app';

require('dotenv').config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

const options = {
  // tls
  key: fs.readFileSync('/etc/letsencrypt/live/compart.leonardoflores.dev/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/compart.leonardoflores.dev/fullchain.pem'),
};

const serverHttps = https.createServer(options, app);

mongoose
  .connect(process.env.CLUSTER_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => serverHttps.listen(PORT, () => debug.log(`Server running at: ${PORT}`)));
