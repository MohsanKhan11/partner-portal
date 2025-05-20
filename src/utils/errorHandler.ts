import { FastifyReply } from 'fastify';


export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (error: Error, request: any, reply: FastifyReply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: error.status,
      message: error.message
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return reply.status(401).send({
      status: 'fail',
      message: 'Invalid token. Please login again.'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return reply.status(401).send({
      status: 'fail',
      message: 'Token has expired. Please login again.'
    });
  }

  return reply.status(500).send({
    status: 'error',
    message: 'Something went wrong'
  });
};