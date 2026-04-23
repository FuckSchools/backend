import type { sessionEntity } from "@/entities/session.entity.js";
import type z from "zod";

export interface ISessionRepository
{
  updateSession(session: z.infer<typeof sessionEntity>): Promise<z.infer<typeof sessionEntity>>;

  
}