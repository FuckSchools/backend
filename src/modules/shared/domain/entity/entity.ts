import z from 'zod';

export class Entity<T extends z.ZodType = z.ZodType> {
  private _data: z.infer<T>;
  private _id: string;

  constructor(data: z.infer<T>, schema: T, id?: string) {
    this._data = schema.parse(data);
    this._id = id ? z.uuidv4().parse(id) : crypto.randomUUID();
  }

  get data(): z.infer<T> {
    return this._data;
  }

  get id(): string {
    return this._id;
  }

  public updateData(newData: z.infer<T>, schema: T): void {
    this._data = schema.parse(newData);
  }

  protected updateId(newId: string): void {
    this._id = z.uuidv4().parse(newId);
  }
}
