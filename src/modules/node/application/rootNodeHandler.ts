import type {
  INodePersistentService,
  IRootNodePersistentService,
  IRootNodeRepository,
} from '../domain/interface/node.interface.js';
import { RootNodeService } from '../domain/service/node.service.js';
import type { NodeService } from '../domain/service/node.service.js';

import {
  NodePersistentService,
  RootNodePersistentService,
} from '../domain/service/nodePresistence.js';

const buildNodeTree = async (
  parentNodeService: NodeService,
): Promise<Array<INodePersistentService>> => {
  const childNodeServices = await parentNodeService.getChildren();
  if (childNodeServices.length === 0) {
    return [];
  }
  return Promise.all(
    childNodeServices.map(async (service): Promise<INodePersistentService> => {
      const data = service.getFullEntity();
      if (!data) {
        throw new Error(
          `Child node data missing during tree construction`,
        );
      }
      const persistentService = new NodePersistentService(data);
      const context = service.getCachedContext();
      if (context) {
        persistentService.saveContext(context);
      }
      const grandchildren = await buildNodeTree(service);
      for (const grandchild of grandchildren) {
        persistentService.appendNext(grandchild);
      }
      return persistentService;
    }),
  );
};

export const getNodesByProjectId =
  (repository: IRootNodeRepository) =>
  async (
    projectId: string,
  ): Promise<ReturnType<IRootNodePersistentService['output']> | undefined> => {
    const rootNodeService = new RootNodeService(repository, projectId);
    if (!(await rootNodeService.getRootNode())) {
      return;
    }
    const rootNode = rootNodeService.getFullEntity();
    if (!rootNode) {
      return;
    }
    const rootNodePersistentService = new RootNodePersistentService(rootNode);
    const children = await buildNodeTree(rootNodeService.getRootNodeAsNode());
    for (const child of children) {
      rootNodePersistentService.appendNext(child);
    }
    return rootNodePersistentService.output();
  };
