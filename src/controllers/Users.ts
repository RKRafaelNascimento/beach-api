import { Request, Response } from 'express';
import { Post, Controller } from '@overnightjs/core';
import { User } from '@src/models/user';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('user')
export class UserController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
