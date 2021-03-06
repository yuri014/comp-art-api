import debug from 'debug';
import https from 'https';
import fs from 'fs-extra';
import mongoose from 'mongoose';

import app, { server, PORT } from './app';

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

const serverHttps = https.createServer(options, app);

server.installSubscriptionHandlers(serverHttps);

mongoose
  .connect(process.env.CLUSTER_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => serverHttps.listen(PORT, () => debug.log(`Server running at: ${PORT}`)))
  .catch(error => {
    throw new Error(error);
  });
