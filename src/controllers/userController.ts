import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService';
import { Role } from '../types/enums';
import { errorHandler } from '../utils/errorHandler';

export class UserController {
  static async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const username = (request.user as any).username;
      const user = await UserService.getUserByUsername(username);
      reply.send(user);
    } catch (error: any) {
      errorHandler(error, request, reply);
    }
  }

  static async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await UserService.getAllUsers();
      reply.send(users);
    } catch (error: any) {
      errorHandler(error, request, reply);
    }
  }

  static async updateUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const username = (request.params as any).username;
      const updater = request.user as { username: string; role: Role };
      const updateData = request.body as any;
      
      const updatedUser = await UserService.updateUser(username, updateData, updater);
      reply.send(updatedUser);
    } catch (error: any) {
      errorHandler(error, request, reply);
    }
  }

  static async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const username = (request.params as any).username;
      await UserService.deleteUser(username);
      reply.send({ success: true });
    } catch (error: any) {
      errorHandler(error, request, reply);
    }
  }
} 