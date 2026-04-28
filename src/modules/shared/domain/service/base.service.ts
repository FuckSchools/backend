import type z from 'zod';
import type { IRepository } from '../interface/repository.interface.js';

export abstract class BaseService<T, K> {
  constructor(
    protected repository: IRepository<T, K>,
    protected parser: z.ZodType<T & K>,
  ) {
    this.repository = repository;
    this.parser = parser;
  }

  public async parse(data: (T & K) | null): Promise<(T & K) | null> {
    return data ? await this.parser.parseAsync(data) : data;
  }

  public async parseMany(data: Array<T & K>): Promise<Array<T & K>> {
    return await this.parser.array().parseAsync(data);
  }

  public async create(params: T, id?: string) {
    return await this.repository.create(params, id);
  }

  public async getById(id: string) {
    return await this.parse(await this.repository.getById(id));
  }

  public async getAll(id: string) {
    return await this.parseMany(await this.repository.getAll(id));
  }
}
