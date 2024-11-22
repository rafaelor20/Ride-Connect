import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function createOrigin(data: Prisma.OriginUncheckedCreateInput) {
  return prisma.origin.create({
    data,
  });
}

async function findById(id: number, select?: Prisma.OriginSelect) {
  const params: Prisma.OriginFindUniqueArgs = {
    where: {
      id,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.origin.findUnique(params);
}

const originRepository = {
  createOrigin,
  findById,
};

export default originRepository;
