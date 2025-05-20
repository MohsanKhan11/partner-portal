import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { validatePassword } from '../utils/password';
import { AppError } from '../utils/errorHandler';
import { Role } from '../types/enums';
import { CacheService, CacheKey } from './cacheService';

export class UserService {
  static async getUserByUsername(username: string) {
    const cacheService = CacheService.getInstance();
    

    const cached = await cacheService.get<IUser>(CacheKey.USER, username);
    if (cached) {
      return cached;
    }

    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const userData = user.toObject();
    await cacheService.set(CacheKey.USER, userData, username);

    return userData;
  }

  static async getAllUsers() {
    const cacheService = CacheService.getInstance();
    
    const cached = await cacheService.get<IUser[]>(CacheKey.ALL_USERS);
    if (cached) {
        console.log('Cache hit for all users');
      return cached;
    }

    const users = await User.find().select('-password');
    await cacheService.set(CacheKey.ALL_USERS, users);

    return users;
  }

  static async updateUser(username: string, updateData: Partial<IUser>, updater: { username: string; role: Role }) {
    
    if (updater.role === Role.EDITOR && updateData.role) {
      throw new AppError(403, 'Editors cannot manage roles');
    }
    if (updater.role === Role.VIEWER) {
      throw new AppError(403, 'Viewers cannot update users');
    }

    if (updateData.password) {
      const validation = validatePassword(updateData.password);
      if (!validation.isValid) {
        throw new AppError(400, `Password validation failed: ${JSON.stringify(validation.errors)}`);
      }
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      throw new AppError(404, 'User not found');
    }


    const cacheService = CacheService.getInstance();
    await cacheService.invalidateUserCaches(username);

    return updatedUser;
  }

  static async deleteUser(username: string) {
    const deletedUser = await User.findOneAndDelete({ username });
    if (!deletedUser) {
      throw new AppError(404, 'User not found');
    }

    const cacheService = CacheService.getInstance();
    await cacheService.invalidateUserCaches(username);
  }
} 