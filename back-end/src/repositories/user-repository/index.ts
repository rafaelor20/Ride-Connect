import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function findByEmail(email: string, select?: Prisma.CustomerSelect) {
  const params: Prisma.CustomerFindFirstArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.customer.findFirst(params);
}

async function create(data: Prisma.CustomerUncheckedCreateInput) {
  return prisma.customer.create({
    data,
  });
}

async function findById(id: number, select?: Prisma.CustomerSelect) {
  const params: Prisma.CustomerFindUniqueArgs = {
    where: {
      id,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.customer.findUnique(params);
}

const userRepository = {
  findByEmail,
  create,
  findById,
};

export default userRepository;
