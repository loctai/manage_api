import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import prisma from '@/dbclient';

//
// if endpointPerCodes is empty the user of all group and all permission can use this enpoint
// 
const authMiddleware = (endpointPerCodes: number[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

      if (Authorization) {
        const secretKey: string = SECRET_KEY;
        const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
        const userId = verificationResponse.id;
        const userPermisionCodes = verificationResponse.permisionCodes;
        const findUser = await prisma.user.findUnique({ where: { id: userId } })

        if (findUser) {
          var foundCode = endpointPerCodes.find(endpointPerCode => userPermisionCodes.includes(endpointPerCode))
          if (foundCode || endpointPerCodes.length == 0) {
            req.user = findUser;
            next();
          } else {
            next(new HttpException(401, 'Unauthorize'));
          }
        } else {
          next(new HttpException(401, 'Wrong authentication token'));
        }
      } else {
        next(new HttpException(401, 'Authentication token missing'));
      }
    } catch (error) {
      next(new HttpException(401, 'Wrong authentication token'));
    }
  };
}

export default authMiddleware;
