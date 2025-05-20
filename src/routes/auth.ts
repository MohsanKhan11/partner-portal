import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/authController';
import { rateLimit } from '../middlewares/rateLimit';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', {
    preHandler: rateLimit,
  }, AuthController.signup);

  fastify.post('/login', {
    preHandler: rateLimit,
  }, AuthController.login);

  fastify.get('/validate/:username', AuthController.validateUsername);
} 