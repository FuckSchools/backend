import type z from 'zod';

export class Event<T extends z.ZodObject = z.ZodObject> {
  private readonly _data: z.infer<T>;
  private readonly _name: string;
  private readonly _timestamp: Date;

  constructor(name: string, data: z.infer<T>, timestamp?: Date) {
    this._name = name;
    this._data = data;
    this._timestamp = timestamp || new Date();
  }

  get name(): string {
    return this._name;
  }

  get data(): z.infer<T> {
    return this._data;
  }

  get timestamp(): Date {
    return this._timestamp;
  }
}
