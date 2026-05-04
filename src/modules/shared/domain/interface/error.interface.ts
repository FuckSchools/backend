export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class PrismaError extends Error {
  constructor(message: string = 'Prisma Error') {
    super(message);
    this.name = 'PrismaError';
  }
}

export class DuplicatedCreationError extends Error {
  constructor(message: string = 'Duplicated Creation') {
    super(message);
    this.name = 'DuplicatedCreationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class NodeUnknownError extends Error {
  constructor(message: string = 'Unknown Error') {
    super(message);
    this.name = 'NodeUnknownError';
  }
}

export class IllegalOperationError extends Error {
  constructor(message: string = 'Illegal Operation') {
    super(message);
    this.name = 'IllegalOperationError';
  }
}

export const MyError = {
  UnauthorizedError,
  PrismaError,
  DuplicatedCreationError,
  NotFoundError,
  NodeUnknownError,
  IllegalOperationError,
};
