import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import cors from '@fastify/cors';
import mongoose from 'mongoose';
import { config } from './config';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { logger, requestLogger } from './utils/logger';
import { AppError, errorHandler } from './utils/errorHandler';

const server = Fastify({
  logger: true,
});


server.register(cors, { origin: '*' });
server.register(fastifyJwt, {
  secret: config.jwtSecret,
  sign: {
    expiresIn: '24h'
  }
});


server.addHook('onRequest', (request, reply, done) => {
  requestLogger.request(request);
  done();
});

server.addHook('onResponse', (request, reply, done) => {
  requestLogger.response(request, reply);
  done();
});

server.addHook('onError', (request, reply, error, done) => {
  requestLogger.error(request, reply, error);
  errorHandler(error, request, reply);
  done();
});


mongoose.connect(config.mongoUri)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));


server.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err: any) {
      logger.error('Authentication error:', err);
      
      if (err.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
        throw new AppError(401, 'Token has expired. Please login again.');
      }
      
      if (err.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
        throw new AppError(401, 'Invalid token. Please login again.');
      }
      
      throw new AppError(401, 'Authentication failed');
    }
  }
);


server.register(authRoutes, { prefix: '/auth' });
server.register(userRoutes, { prefix: '/users' });


server.listen({ port: Number(config.port) }).then(() => {
  logger.info(`Server listening on http://localhost:${config.port}`);
});
