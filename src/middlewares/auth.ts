import express from 'express';
import { getAuth } from '@clerk/express';


export const authMiddleware = async ( req: express.Request, res: express.Response, next: express.NextFunction ): Promise<void> =>
{
  const { isAuthenticated, userId} = getAuth(req);
  if ( !isAuthenticated )
  {
    console.warn('Unauthorized access attempt');
    res.status( 401 ).json( { error: 'Unauthorized' } );
    return;
  }
  req.body.userId = userId;
  next();
}