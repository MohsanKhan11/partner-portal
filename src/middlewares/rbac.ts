import { FastifyReply, FastifyRequest } from 'fastify';

type Role = 'admin' | 'editor' | 'viewer';
type Permission = 'readUsers' | 'updateUsers' | 'deleteUsers' | 'manageRoles';

const permissionsMatrix: Record<Role, Record<Permission, boolean>> = {
  admin: { readUsers: true, updateUsers: true, deleteUsers: true, manageRoles: true },
  editor: { readUsers: true, updateUsers: true, deleteUsers: false, manageRoles: false },
  viewer: { readUsers: true, updateUsers: false, deleteUsers: false, manageRoles: false },
};

export function requirePermission(permission: Permission) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { role: Role };
    if (!user || !permissionsMatrix[user.role]?.[permission]) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
  };
}
