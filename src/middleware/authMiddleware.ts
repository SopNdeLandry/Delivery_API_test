/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, Request, Response } from 'express';

import { type JwtPayload } from 'jsonwebtoken';
const jwt = require('jsonwebtoken');
import RedisClient from '../databases/redis';

const permissions = {
  admin: ['getAllPackage', 'createPackage', 'updatePackage', 'deletePackage', 'viewPackage','createDelivery', 'getAllDelivery','viewDelivery','updateDelivery','deleteDelivery'],
  driver: ['viewPackage', 'updatePackageStatus','viewDelivery','updateDelivery'],
  customer: ['viewPackage','viewDelivery']
};

function authMiddleware(requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token'];
    console.log(token);
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
    RedisClient.EXISTS(token).then((isExist) => {
      if (isExist) {
        // @ts-ignore
        jwt.verify(token, process.env['jwtSecret'], (err: unknown, payload: JwtPayload) => {
          if (err) return res.status(401).json({ success: false, message: 'Invalid token 400' });
          // @ts-ignore
          const userRole = payload['role'];
          // @ts-ignore
          const userPermissions = permissions[userRole];
          // @ts-ignore
          if (!userPermissions.some(permission => requiredPermissions.includes(permission))) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
          }
          // @ts-ignore
          req.user = payload;
          next();
        })
      } else {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
    }).catch(() => {
      return res.status(401).json({ success: false, message: 'Invalid token ' });
    })
  }

}


export default authMiddleware;
