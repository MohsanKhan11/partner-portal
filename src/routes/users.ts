import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/userController';
import { requirePermission } from '../middlewares/rbac';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

export async function userRoutes(fastify: FastifyInstance) {

  fastify.get('/', { 
    preHandler: [fastify.authenticate] 
  }, UserController.getCurrentUser);

  fastify.get('/all', { 
    preHandler: [fastify.authenticate, requirePermission('readUsers')] 
  }, UserController.getAllUsers);

  fastify.patch('/:username', { 
    preHandler: [fastify.authenticate, requirePermission('updateUsers')] 
  }, UserController.updateUser);


  fastify.delete('/:username', { 
    preHandler: [fastify.authenticate, requirePermission('deleteUsers')] 
  }, UserController.deleteUser);
} 