import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.sendStatus(401);
  }

  const token = authorization.replace('Bearer', '').trim();
  try {
    const data = jwt.verify(token, process.env.SECRET as string);
    const { id } = data as TokenPayload;

    req.params.userId = id;

    return next();
  } catch {
    return res.sendStatus(401);
  }
};

export default authMiddleware;
