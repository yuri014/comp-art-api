import debug from 'debug';
import mongoose from 'mongoose';
import { createServer } from 'http';

import app, { server, PORT } from './app';

const httpServer = createServer(app);

const logs = [
  () => debug.log(`Server ready at: http://localhost:${PORT}${server.graphqlPath}`),
  () => debug.log(`Subscriptions ready at: ws://localhost:${PORT}${server.subscriptionsPath}`),
];

server.installSubscriptionHandlers(httpServer);

mongoose
  .connect(process.env.CLUSTER_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => httpServer.listen(PORT, () => logs.map(log => log())))
  .catch(error => {
    throw new Error(error);
  });
