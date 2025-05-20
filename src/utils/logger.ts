import pino from 'pino';
import { config } from '../config';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
  },
});

export const logger = pino({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
}, transport);

// Request logger middleware
export const requestLogger = {
  request: (request: any) => {
    logger.info({
      type: 'request',
      method: request.method,
      url: request.url,
      params: request.params,
      query: request.query,
      body: request.body,
      ip: request.ip,
    });
  },
  response: (request: any, reply: any) => {
    logger.info({
      type: 'response',
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: reply.getResponseTime(),
    });
  },
  error: (request: any, reply: any, error: any) => {
    logger.error({
      type: 'error',
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  },
}; 