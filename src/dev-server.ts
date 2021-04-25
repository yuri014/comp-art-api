import debug from 'debug';
import mongoose from 'mongoose';

import app, { PORT } from './app';

mongoose
  .connect(process.env.CLUSTER_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => app.listen(PORT, () => debug.log(`Server running at: ${PORT}`)));
