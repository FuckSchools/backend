import z from 'zod';

function deepFreeze<T>(value: T): Readonly<T> {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);

    for (const key of Object.keys(value as Record<string, unknown>)) {
      deepFreeze((value as Record<string, unknown>)[key]);
    }
  }

  return value as Readonly<T>;
}

export class Entity<T extends z.ZodObject = z.ZodObject> {
  private _data: Readonly<z.infer<T>>;
  private _id: string;

  constructor(
    data: z.infer<T>,
    public readonly schema: T,
    id?: string,
  ) {
    this._data = deepFreeze(this.schema.parse(data));
    this._id = id ? z.uuidv4().parse(id) : crypto.randomUUID();
  }

  get data(): Readonly<z.infer<T>> {
    return this._data;
  }

  get id(): string {
    return this._id;
  }

  public updateData(newData: z.infer<T>): void {
    this._data = deepFreeze(this.schema.parse(newData));
  }

  protected updateId(newId: string): void {
    this._id = z.uuidv4().parse(newId);
  }

  public toJSON(): z.infer<T> & { id: string } {
    return { ...this.data, id: this.id };
  }

  public equals(otherEntityId: string): boolean {
    return this.id === otherEntityId;
  }
}
