export interface IRepository<T, P> {
  create(params: T, id?: string): Promise<T & P>;

  getById(id: string): Promise<(T & P) | null>;

  getAll(id: string): Promise<Array<T & P>>;
}
