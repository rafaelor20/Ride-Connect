import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function create(data: Prisma.DriverUncheckedCreateInput) {
  return prisma.driver.create({
    data,
  });
}

async function getDrivers() {
  return prisma.driver.findMany();
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

  return prisma.customer.findUnique(params);
}

const driverRepository = {
  create,
  findById,
  getDrivers,
};

export default driverRepository;
