import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

async function main() {
  // Hash passwords
  const mainHashedPassword = await bcrypt.hash('qwerasdf', 12);
  const hashedPassword1 = await bcrypt.hash('user1Password123', 12);
  const hashedPassword2 = await bcrypt.hash('user2Password456', 12);

  // Create customers
  const user1 = await prisma.customer.create({
    data: {
      name: 'Main User',
      email: 'user@test.com',
      password: mainHashedPassword,
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword1,
    },
  });

  // Create drivers
  const driver1 = await prisma.driver.create({
    data: {
      name: 'Homer Simpson',
      description:
        'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
      vehicle: 'Plymouth Valiant 1973 rosa e enferrujado',
      pricePerKmInCents: 250,
      minKm: 1,
    },
  });

  const driver2 = await prisma.driver.create({
    data: {
      name: 'Dominic Toretto',
      description:
        'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
      vehicle: 'Dodge Charger R/T 1970 modificado',
      pricePerKmInCents: 500,
      minKm: 5,
    },
  });

  const driver3 = await prisma.driver.create({
    data: {
      name: 'James Bond',
      description:
        'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
      vehicle: 'Aston Martin DB5 clássico',
      pricePerKmInCents: 1000,
      minKm: 10,
    },
  });

  const origin1 = await prisma.origin.create({
    data: {
      address: 'Rua dos Bobos, 0',
    },
  });

  const destination1 = await prisma.destination.create({
    data: {
      address: 'Rua dos Bobos, 1',
    },
  });

  const HomerRide = await prisma.ride.create({
    data: {
      customerId: user1.id,
      driverId: driver1.id,
      originId: origin1.id,
      destinationId: destination1.id,
      distanceInKm: 250,
      durationInSec: 1,
      valueInCents: 250 * driver1.pricePerKmInCents * 100,
    },
  });

  const HomerReview = await prisma.review.create({
    data: {
      rideId: HomerRide.id,
      rating: 2,
      comment: 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts',
    },
  });

  const DomRide = await prisma.ride.create({
    data: {
      customerId: user1.id,
      driverId: driver2.id,
      originId: origin1.id,
      destinationId: destination1.id,
      distanceInKm: 500,
      durationInSec: 1,
      valueInCents: 500 * driver2.pricePerKmInCents * 100,
    },
  });

  const DomReview = await prisma.review.create({
    data: {
      rideId: DomRide.id,
      rating: 4,
      comment:
        'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!',
    },
  });

  const BondRide = await prisma.ride.create({
    data: {
      customerId: user1.id,
      driverId: driver3.id,
      originId: origin1.id,
      destinationId: destination1.id,
      distanceInKm: 1000,
      durationInSec: 1,
      valueInCents: 1000 * driver3.pricePerKmInCents * 100,
    },
  });

  const BondReview = await prisma.review.create({
    data: {
      rideId: BondRide.id,
      rating: 5,
      comment:
        'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
