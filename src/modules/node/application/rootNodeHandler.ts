import type { NodeType } from 'prisma/enums.js';
import type {
  INodeRepository,
  IRootNodeRepository,
} from '../domain/interface/node.interface.js';
import { RootNodeService } from '../domain/service/node.service.js';
import type { RootNodeFull } from '../domain/entity/node.entity.js';

export const getNodesByProjectId =
  (repository: IRootNodeRepository) => async (projectId: string) => {
    const rootNodeService = new RootNodeService(repository, projectId);
    if (await rootNodeService.getRootNode()) {
    }
  };
