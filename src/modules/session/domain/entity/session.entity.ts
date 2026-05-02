import { Entity } from "@/shared/domain/entity/entity.js";
import { sessionSchema } from "../schema/session.schema.js";
import type z from "zod";

export class SessionEntity extends Entity<typeof sessionSchema>
{
  constructor(data: z.infer<typeof sessionSchema>, private readonly _projectId: string, id?: string) {
    super(data, sessionSchema, id);
  }

  public get projectId() : string {
    return this._projectId;
  }

}