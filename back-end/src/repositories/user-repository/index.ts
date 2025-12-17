import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function findByEmail(email: string, select?: Prisma.CustomerSelect) {
  const params: Prisma.CustomerFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.customer.findUnique(params);
}

async function findByToken(token: string, select?: Prisma.CustomerSelect) {
  const params: Prisma.CustomerFindFirstArgs = {
    where: {
      token,
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

async function update(id: number, data: Prisma.CustomerUncheckedUpdateInput) {
  return prisma.customer.update({
    where: {
      id,
    },
    data,
  });
}

const userRepository = {
  findByEmail,
  create,
  findById,
  findByToken,
  update,
};

export default userRepository;
