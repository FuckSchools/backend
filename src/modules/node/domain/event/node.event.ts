import { createEvent } from '@/shared/domain/event/domain.event.js';
import type { NodeStatus } from '../value-object/nodeStatus.js';

export const nodeEvents = {
  nodeUpdated: (nodeId: string, status: NodeStatus, projectId: string) =>
    createEvent('node_updated', { nodeId, status, projectId }),

  blockerDetected: (nodeId: string, blocker: string, projectId: string) =>
    createEvent('blocker_detected', { nodeId, blocker, projectId }),

  stepDown: (fromNodeId: string, toNodeId: string, projectId: string) =>
    createEvent('step_down', { fromNodeId, toNodeId, projectId }),

  stepUp: (fromNodeId: string, toNodeId: string, projectId: string) =>
    createEvent('step_up', { fromNodeId, toNodeId, projectId }),

  goAround: (blockedNodeId: string, alternativeNodeId: string, projectId: string) =>
    createEvent('go_around', { blockedNodeId, alternativeNodeId, projectId }),
} as const;

export type NodeUpdatedEvent = ReturnType<typeof nodeEvents.nodeUpdated>;
export type BlockerDetectedEvent = ReturnType<typeof nodeEvents.blockerDetected>;
export type StepDownEvent = ReturnType<typeof nodeEvents.stepDown>;
export type StepUpEvent = ReturnType<typeof nodeEvents.stepUp>;
export type GoAroundEvent = ReturnType<typeof nodeEvents.goAround>;
