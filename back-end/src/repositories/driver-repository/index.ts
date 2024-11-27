import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function create(data: Prisma.DriverUncheckedCreateInput) {
  return prisma.driver.create({
    data,
  });
}

async function getDriversWithReviews() {
  return prisma.driver.findMany({
    include: {
      //take one review
      rides: {
        select: {
          review: {
            select: {
              rating: true,
              comment: true,
            },
          },
        },
      },
    },
  });
}

async function findById(id: number, select?: Prisma.DriverSelect) {
  const params: Prisma.DriverFindUniqueArgs = {
    where: {
      id,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.driver.findUnique(params);
}

const driverRepository = {
  create,
  findById,
  getDriversWithReviews,
};

export default driverRepository;
