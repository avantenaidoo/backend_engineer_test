import { GraphQLError } from 'graphql';

export class NotFoundError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'NOT_FOUND' } });
  }
}

export class ValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'BAD_USER_INPUT' } });
  }
}

export class ApiError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'API_ERROR' } });
  }
}