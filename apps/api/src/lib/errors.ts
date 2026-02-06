import type { ErrorCode } from '@workalaya/shared';
import { ERROR_CODES } from '@workalaya/shared';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;

  constructor(message: string, code: ErrorCode, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, ERROR_CODES.NOT_FOUND, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, ERROR_CODES.VALIDATION_ERROR, 400);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, ERROR_CODES.FORBIDDEN, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, ERROR_CODES.CONFLICT, 409);
  }
}
