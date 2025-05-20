import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { validatePassword } from '../utils/password';
import { addUsernameToBloom, checkUsernameBloom } from '../redisClient';
import { AppError } from '../utils/errorHandler';
import { Role } from '../types/enums';
import { CacheService } from './cacheService';
import { config } from '../config';

interface SignupData {
  email: string;
  password: string;
  username: string;
  fullName?: string;
  adminKey?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResult {
  username: string;
  role: Role;
}

export class AuthService {
  static async signup(data: SignupData) {
    const { email, password, username, fullName, adminKey } = data;

    const validation = validatePassword(password);
    if (!validation.isValid) {
      throw new AppError(400, `Password validation failed: ${JSON.stringify(validation.errors)}`);
    }

    const usernameExistsInBloom = await checkUsernameBloom(username);
    if (usernameExistsInBloom) {
      if (await User.findOne({ username })) {
        throw new AppError(409, 'Username already taken');
      }
    }

    if (await User.findOne({ email })) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Determine role based on adminKey
    let role = Role.VIEWER;
    if (adminKey && adminKey === config.adminKey) {
      role = Role.ADMIN;
    }

    const user = new User({
      email,
      password: hashedPassword,
      username,
      fullName,
      role,
    });

    await user.save();
    await addUsernameToBloom(username);

    const cacheService = CacheService.getInstance();
    await cacheService.invalidateUserCaches();

    return { message: 'User registered successfully' };
  }

  static async login(data: LoginData): Promise<LoginResult> {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new AppError(401, 'Invalid credentials');
    }

    return {
      username: user.username,
      role: user.role
    };
  }

  static async validateUsername(username: string) {
    const possiblyExists = await checkUsernameBloom(username);
    if (!possiblyExists) {
      return { available: true };
    }
    
    const existsInDb = await User.findOne({ username });
    return { available: !existsInDb };
  }
} 