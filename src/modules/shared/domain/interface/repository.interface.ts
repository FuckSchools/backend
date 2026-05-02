export interface IRepository<TFull> {
  findById(id: string): Promise<TFull | null>;
}

export interface IWriteRepository<TCreate, TFull> extends IRepository<TFull> {
  create(params: TCreate): Promise<TFull>;
  update(id: string, params: TCreate): Promise<TFull>;
}
