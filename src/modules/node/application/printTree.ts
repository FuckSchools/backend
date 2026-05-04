import { TreeHandler } from './tree.service.js';

export class PrintTree extends TreeHandler {
  async execute(projectId: string) {
    await this.resumeExistingNodeFactoryByProjectId(projectId);
    return this.nodeFactory ? this.nodeFactory.printTree() : undefined;
  }
}
