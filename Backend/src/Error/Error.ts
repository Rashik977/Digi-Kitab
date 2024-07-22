import HTTP from "http-status-codes";

export class BaseError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = "Bad Request") {
    super(message, HTTP.BAD_REQUEST);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "Not Found") {
    super(message, HTTP.NOT_FOUND);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super(message, HTTP.UNAUTHORIZED);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super(message, HTTP.FORBIDDEN);
  }
}

export class InternalServerError extends BaseError {
  constructor(message = "Internal Server Error") {
    super(message, HTTP.INTERNAL_SERVER_ERROR);
  }
}
