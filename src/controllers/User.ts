import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../entities/User';

export default class UserController {
  async store(req: Request, res: Response) {
    const repository = getRepository(User);

    const { name, username, profile, email, password } = req.body;
    const emailExists = await repository.findOne({ where: { email } });

    if (emailExists) {
      return res.sendStatus(409);
    }

    const user = repository.create({ name, username, profile, email, password });
    await repository.save(user);

    return res.json(user);
  }
}
