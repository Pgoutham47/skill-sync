
import { PrismaClient } from '../../generated/prisma';

// Create a singleton instance of PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

// Define the PrismaClientSingleton type
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Create a global variable for PrismaClient
const globalForPrisma = global as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Export the PrismaClient instance, creating it if it doesn't exist
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
