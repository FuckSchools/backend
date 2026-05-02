export type DomainEvent<TType extends string, TPayload> = {
  readonly type: TType;
  readonly payload: TPayload;
  readonly occurredAt: Date;
};

export const createEvent = <TType extends string, TPayload>(
  type: TType,
  payload: TPayload,
): DomainEvent<TType, TPayload> =>
  Object.freeze({ type, payload, occurredAt: new Date() });

type EventHandler<TEvent> = (event: TEvent) => void | Promise<void>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEvent = DomainEvent<string, any>;

/**
 * A simple in-process synchronous event bus. Subscribers receive events
 * after the action that produced them has been persisted.
 */
export class DomainEventBus {
  private readonly handlers = new Map<string, EventHandler<AnyEvent>[]>();

  on<TType extends string, TPayload>(
    type: TType,
    handler: EventHandler<DomainEvent<TType, TPayload>>,
  ): void {
    const existing = this.handlers.get(type) ?? [];
    this.handlers.set(type, [
      ...existing,
      handler as EventHandler<AnyEvent>,
    ]);
  }

  async emit<TType extends string, TPayload>(
    event: DomainEvent<TType, TPayload>,
  ): Promise<void> {
    const handlers = this.handlers.get(event.type) ?? [];
    await Promise.all(handlers.map((h) => h(event)));
  }
}

export const domainEventBus = new DomainEventBus();
