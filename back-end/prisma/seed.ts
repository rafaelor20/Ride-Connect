import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

async function main() {
  // Hash passwords
  const hashedPassword1 = await bcrypt.hash('user1Password123', 12);
  const hashedPassword2 = await bcrypt.hash('user2Password456', 12);

  // Create customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword1,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      password: hashedPassword2,
    },
  });

  // Create drivers
  const driver1 = await prisma.driver.create({
    data: {
      name: 'Jane Smith',
      description: 'Experienced driver with 5 years on the road',
      vehicle: 'Toyota Prius',
      pricePerKmInCents: 100,
      minKm: 5,
    },
  });

  const driver2 = await prisma.driver.create({
    data: {
      name: 'Bob Brown',
      description: 'Reliable driver with a spacious van',
      vehicle: 'Ford Transit',
      pricePerKmInCents: 120,
      minKm: 10,
    },
  });

  // Create origin and destination
  const origin1 = await prisma.origin.create({
    data: {
      address: '123 Main St, City, Country',
      latitude: 12345678, // Example Int (could use Float)
      longitude: 98765432, // Example Int (could use Float)
    },
  });

  const destination1 = await prisma.destination.create({
    data: {
      address: '456 Oak St, City, Country',
      latitude: 23456789, // Example Int (could use Float)
      longitude: 87654321, // Example Int (could use Float)
    },
  });

  const origin2 = await prisma.origin.create({
    data: {
      address: '789 Maple Ave, City, Country',
      latitude: 34567890,
      longitude: 76543210,
    },
  });

  const destination2 = await prisma.destination.create({
    data: {
      address: '321 Pine St, City, Country',
      latitude: 45678901,
      longitude: 65432109,
    },
  });

  // Create rides
  const ride1 = await prisma.ride.create({
    data: {
      customerId: customer1.id,
      driverId: driver1.id,
      originId: origin1.id,
      destinationId: destination1.id,
      distanceInKm: 10,
      durationInSec: 600,
      valueInCents: 1000,
    },
  });

  const ride2 = await prisma.ride.create({
    data: {
      customerId: customer2.id,
      driverId: driver2.id,
      originId: origin2.id,
      destinationId: destination2.id,
      distanceInKm: 20,
      durationInSec: 1200,
      valueInCents: 2400,
    },
  });

  // Create reviews
  await prisma.review.create({
    data: {
      rideId: ride1.id,
      rating: 5,
      comment: 'Great ride, smooth and quick!',
    },
  });

  await prisma.review.create({
    data: {
      rideId: ride2.id,
      rating: 4,
      comment: 'Good ride, but a little slow.',
    },
  });

  // Generate JWT tokens for customers and drivers
  const customerToken1 = jwt.sign({ id: customer1.id, email: customer1.email }, JWT_SECRET, { expiresIn: '1h' });
  const customerToken2 = jwt.sign({ id: customer2.id, email: customer2.email }, JWT_SECRET, { expiresIn: '1h' });
  const driverToken1 = jwt.sign({ id: driver1.id, email: driver1.email }, JWT_SECRET, { expiresIn: '1h' });
  const driverToken2 = jwt.sign({ id: driver2.id, email: driver2.email }, JWT_SECRET, { expiresIn: '1h' });

  console.log('Customer 1 Token:', customerToken1);
  console.log('Customer 2 Token:', customerToken2);
  console.log('Driver 1 Token:', driverToken1);
  console.log('Driver 2 Token:', driverToken2);
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


