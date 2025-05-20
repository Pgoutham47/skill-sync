
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
   * Find a user by Google ID
   */
  static async findByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: { googleId },
    });
  }

  /**
   * Find a user by GitHub ID
   */
  static async findByGithubId(githubId: string) {
    return prisma.user.findUnique({
      where: { githubId },
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
   * Create or update a user from OAuth (Google/GitHub)
   */
  static async createOrUpdateOAuthUser({
    name,
    email,
    provider,
    providerId,
  }: {
    name: string;
    email: string;
    provider: 'google' | 'github';
    providerId: string;
  }) {
    // Check if user exists by email
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      // Update the existing user with OAuth provider ID
      return prisma.user.update({
        where: { id: existingUser.id },
        data: {
          ...(provider === 'google' ? { googleId: providerId } : {}),
          ...(provider === 'github' ? { githubId: providerId } : {}),
        },
        include: {
          profile: true,
        },
      });
    }

    // Create a new user with OAuth provider ID
    return prisma.user.create({
      data: {
        name,
        email,
        ...(provider === 'google' ? { googleId: providerId } : {}),
        ...(provider === 'github' ? { githubId: providerId } : {}),
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
