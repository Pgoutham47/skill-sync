
import { PrismaClient } from '../../generated/prisma';
import prisma from '../config/database';
import bcrypt from 'bcryptjs';

class UserModel {
  /**
   * Find a user by their ID
   */
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find a user by their email
   */
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Create a new user
   */
  static async createUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    return prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {
            additionalSkills: [],
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  /**
   * Update a user
   */
  static async updateUser(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Compare a password with a user's hashed password
   */
  static async comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}

export default UserModel;
