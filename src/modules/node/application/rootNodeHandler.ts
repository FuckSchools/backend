import type {
  INodePersistentService,
  IRootNodePersistentService,
  IRootNodeRepository,
} from '../domain/interface/node.interface.js';
import {
  RootNodeService,
  type NodeService,
} from '../domain/service/node.service.js';

import {
  NodePersistentService,
  RootNodePersistentService,
} from '../domain/service/nodePresistence.js';
import { NodeContextService } from '../domain/service/nodeContext.service.js';
import type { INodeContextRepository } from '../domain/interface/nodeContext.interface.js';

export const getNodesById =
  (nodeContextRepository: INodeContextRepository) =>
  async (
    parentNodeService: NodeService,
  ): Promise<Array<INodePersistentService>> => {
    const childNodeServices = await parentNodeService.getChildren();
    if (childNodeServices.length === 0) {
      return [];
    }
    const results = await Promise.allSettled(
      childNodeServices.map(
        async (service): Promise<INodePersistentService> => {
          const childNodePersistentService = new NodePersistentService(
            service.getFullEntity()!,
          );
          const contextService = new NodeContextService(
            nodeContextRepository,
            service.getFullEntity()!.id,
          );
          const childResults = await Promise.allSettled([
            contextService.getNodeContext(),
            getNodesById(nodeContextRepository)(service),
          ]);
          if (
            childResults[0].status === 'fulfilled' &&
            childResults[1].status === 'fulfilled'
          ) {
            const contextExisted = childResults[0].value;
            const childNodes = childResults[1].value;
            if (contextExisted) {
              childNodePersistentService.saveContext(
                contextService.getFullEntity()!,
              );
            }
            for (const childNode of childNodes) {
              childNodePersistentService.appendNext(childNode);
            }
          } else {
            console.error('Error fetching child node data:', {
              contextError:
                childResults[0].status === 'rejected' ?
                  childResults[0].reason
                : undefined,
              childrenError:
                childResults[1].status === 'rejected' ?
                  childResults[1].reason
                : undefined,
            });
          }
          return childNodePersistentService;
        },
      ),
    );

    const successfulServices: INodePersistentService[] = [];

    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('Error processing child node service:', result.reason);
      } else {
        successfulServices.push(result.value);
      }
    }
    return successfulServices;
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
    const childNodePersistentServices = await getNodesById(
      repository.getNodeRepository().getNodeContextRepository(),
    )(rootNodeService.getRootNodeAsNode());
    for (const childNodePersistentService of childNodePersistentServices) {
      rootNodePersistentService.appendNext(childNodePersistentService);
    }
    return rootNodePersistentService.output();
  };
