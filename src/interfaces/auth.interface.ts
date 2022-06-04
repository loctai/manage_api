import { Request } from 'express';
import { User } from '@prisma/client';

export interface DataStoredInToken {
  id: number;
  username: string
  permisionCodes: number[]
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
