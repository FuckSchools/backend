import { AggregateRoot } from "@/shared/domain/service/base.service.js";
import type { SessionEntity } from "../entity/session.entity.js";

export class SessionAggregateRoot extends AggregateRoot<SessionEntity>
{
  constructor(rootEntity: SessionEntity) {
    super(rootEntity);
  }
}