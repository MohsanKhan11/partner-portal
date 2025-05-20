import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/authService';
import { errorHandler } from '../utils/errorHandler';

export class AuthController {
  static async signup(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password, username, fullName, adminKey } = request.body as any;
      const result = await AuthService.signup({ email, password, username, fullName, adminKey });
      reply.send(result);
    } catch (error: any) {
      errorHandler(error, request, reply);
    }
  }

  static async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = request.body as any;
      const result = await AuthService.login({ email, password });
      const token = request.server.jwt.sign(
        { username: result.username, role: result.role },
        { expiresIn: '24h' }
      );
      reply.send({ token });
    } catch (error: any) {
      errorHandler(error, request, reply);
    }
  }

  static async validateUsername(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { username } = request.params as { username: string };
      const result = await AuthService.validateUsername(username);
      reply.send(result);
    } catch (error: any) {
      errorHandler(error, request, reply);
    }
  }
} 