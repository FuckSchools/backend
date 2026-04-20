import express from 'express';
import { clerkClient, getAuth } from '@clerk/express';


export const authMiddleware = async ( req: express.Request, res: express.Response, next: express.NextFunction ): Promise<void> =>
{
  const { isAuthenticated, userId} = getAuth(req);
  if ( !isAuthenticated )
  {
    console.warn('Unauthorized access attempt');
    res.status( 401 ).json( { error: 'Unauthorized' } );
    return;
  }
  const user = await clerkClient.users.getUser( userId );
  await ensureUserExistsInDatabase.call( user );
  next();
}