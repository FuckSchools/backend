import type z from "zod";
import type { IRepository } from "../interface/repository.interface.js";
import { BaseService } from "./base.service.js";

export abstract class PersistencyService<T, K> extends BaseService<T, K>
{
  protected state: ( T & K ) | undefined;
  constructor ( repository: IRepository<T, K>, parser: z.ZodType<T & K> )
  {
    super ( repository, parser );
  }

  abstract persist (): Promise<void> | void;
}