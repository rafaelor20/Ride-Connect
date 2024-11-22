import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function createDestination(data: Prisma.DestinationUncheckedCreateInput) {
  return prisma.destination.create({
    data,
  });
}

async function findById(id: number, select?: Prisma.DestinationSelect) {
  const params: Prisma.DestinationFindUniqueArgs = {
    where: {
      id,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.destination.findUnique(params);
}

const destinationRepository = {
  createDestination,
  findById,
};

export default destinationRepository;
