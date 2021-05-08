import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { RateLimiterMongo } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMongo({
  storeClient: mongoose.connection,
  keyPrefix: 'limiter-middleware',
  points: 10,
  duration: 1,
});

const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  rateLimiter
    .consume(req.ip, 1)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
};

export default rateLimiterMiddleware;
