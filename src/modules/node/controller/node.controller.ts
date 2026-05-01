import { getProject } from '@/userCollections/application/getProject.js';
import { UserCollectionRepository } from '@/userCollections/infrastructure/repository/user.repository.js';
import express from 'express';
export const nodeController = async ( req: express.Request, res: express.Response ) =>
{
  try
  {
    const userId = res.locals[ 'userId' ] as string;
    const projectId = req.params[ 'projectId' ] as string;

    const project = await getProject( new UserCollectionRepository() )( projectId, userId );

    

  } catch (error) {
    res.status( 500 ).json( { error: 'Internal Server Error' } );
    throw error;
  }
}