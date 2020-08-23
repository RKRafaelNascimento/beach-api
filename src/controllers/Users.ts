import { Request, Response } from 'express';
import { Post, Controller } from '@overnightjs/core';
import { User } from '@src/models/user';

@Controller('user')
export class UserController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(201).send(newUser);
  }
}
