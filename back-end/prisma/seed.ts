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

  // Create main user
  const mainUser = await prisma.customer.create({
    data: {
      name: 'Main User',
      email: 'testuser@teste.com',
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

  const driver3 = await prisma.driver.create({
    data: {
      name: 'Alice Johnson',
      description: 'Friendly driver with eco-friendly options',
      vehicle: 'Tesla Model 3',
      pricePerKmInCents: 150,
      minKm: 7,
    },
  });

  const driver4 = await prisma.driver.create({
    data: {
      name: 'Tom Davis',
      description: 'Punctual driver with a premium sedan',
      vehicle: 'Mercedes-Benz C-Class',
      pricePerKmInCents: 200,
      minKm: 8,
    },
  });

  const driver5 = await prisma.driver.create({
    data: {
      name: 'Emma Wilson',
      description: 'Professional driver with a focus on safety',
      vehicle: 'Honda CR-V',
      pricePerKmInCents: 110,
      minKm: 6,
    },
  });

  const driver6 = await prisma.driver.create({
    data: {
      name: 'Chris Taylor',
      description: 'Experienced with long-distance trips',
      vehicle: 'Chevrolet Suburban',
      pricePerKmInCents: 180,
      minKm: 15,
    },
  });

  const driver7 = await prisma.driver.create({
    data: {
      name: 'Sophie Lee',
      description: 'Flexible driver with a compact car',
      vehicle: 'Hyundai Elantra',
      pricePerKmInCents: 90,
      minKm: 4,
    },
  });

  const driver8 = await prisma.driver.create({
    data: {
      name: 'Jack Miller',
      description: 'Knowledgeable driver with a powerful truck',
      vehicle: 'Ford F-150',
      pricePerKmInCents: 170,
      minKm: 12,
    },
  });

  // Create origins and destinations
  const origin1 = await prisma.origin.create({
    data: {
      address: '123 Main St, City, Country',
    },
  });

  const destination1 = await prisma.destination.create({
    data: {
      address: '456 Oak St, City, Country',
    },
  });

  const origin2 = await prisma.origin.create({
    data: {
      address: '789 Maple Ave, City, Country',
    },
  });

  const destination2 = await prisma.destination.create({
    data: {
      address: '321 Pine St, City, Country',
    },
  });

  const origin3 = await prisma.origin.create({
    data: {
      address: '567 Birch Rd, City, Country',
    },
  });

  const destination3 = await prisma.destination.create({
    data: {
      address: '890 Cedar Ln, City, Country',
    },
  });

  const origin4 = await prisma.origin.create({
    data: {
      address: '234 Elm St, City, Country',
    },
  });

  const destination4 = await prisma.destination.create({
    data: {
      address: '678 Spruce Dr, City, Country',
    },
  });

  const origin5 = await prisma.origin.create({
    data: {
      address: '345 Walnut St, City, Country',
    },
  });

  const destination5 = await prisma.destination.create({
    data: {
      address: '901 Chestnut Blvd, City, Country',
    },
  });

  console.log('Origins and destinations seeded successfully');
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

  const ride12 = await prisma.ride.create({
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

  const ride22 = await prisma.ride.create({
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

  //create more riders
  const ride3 = await prisma.ride.create({
    data: {
      customerId: customer1.id,
      driverId: driver3.id,
      originId: origin3.id,
      destinationId: destination3.id,
      distanceInKm: 15,
      durationInSec: 900,
      valueInCents: 1500,
    },
  });

  const ride33 = await prisma.ride.create({
    data: {
      customerId: customer1.id,
      driverId: driver3.id,
      originId: origin3.id,
      destinationId: destination3.id,
      distanceInKm: 15,
      durationInSec: 900,
      valueInCents: 1500,
    },
  });

  const ride4 = await prisma.ride.create({
    data: {
      customerId: customer2.id,
      driverId: driver4.id,
      originId: origin4.id,
      destinationId: destination4.id,
      distanceInKm: 25,
      durationInSec: 1500,
      valueInCents: 2500,
    },
  });

  const ride44 = await prisma.ride.create({
    data: {
      customerId: customer2.id,
      driverId: driver4.id,
      originId: origin4.id,
      destinationId: destination4.id,
      distanceInKm: 25,
      durationInSec: 1500,
      valueInCents: 2500,
    },
  });

  const ride5 = await prisma.ride.create({
    data: {
      customerId: customer1.id,
      driverId: driver5.id,
      originId: origin5.id,
      destinationId: destination5.id,
      distanceInKm: 12,
      durationInSec: 720,
      valueInCents: 1320,
    },
  });

  const ride55 = await prisma.ride.create({
    data: {
      customerId: customer1.id,
      driverId: driver5.id,
      originId: origin5.id,
      destinationId: destination5.id,
      distanceInKm: 12,
      durationInSec: 720,
      valueInCents: 1320,
    },
  });

  const ride6 = await prisma.ride.create({
    data: {
      customerId: customer2.id,
      driverId: driver6.id,
      originId: origin1.id,
      destinationId: destination1.id,
      distanceInKm: 30,
      durationInSec: 1800,
      valueInCents: 3000,
    },
  });

  const ride66 = await prisma.ride.create({
    data: {
      customerId: customer2.id,
      driverId: driver6.id,
      originId: origin1.id,
      destinationId: destination1.id,
      distanceInKm: 30,
      durationInSec: 1800,
      valueInCents: 3000,
    },
  });

  const ride7 = await prisma.ride.create({
    data: {
      customerId: customer1.id,
      driverId: driver7.id,
      originId: origin2.id,
      destinationId: destination2.id,
      distanceInKm: 8,
      durationInSec: 480,
      valueInCents: 720,
    },
  });

  const ride77 = await prisma.ride.create({
    data: {
      customerId: customer1.id,
      driverId: driver7.id,
      originId: origin2.id,
      destinationId: destination2.id,
      distanceInKm: 8,
      durationInSec: 480,
      valueInCents: 720,
    },
  });

  const ride8 = await prisma.ride.create({
    data: {
      customerId: customer2.id,
      driverId: driver8.id,
      originId: origin3.id,
      destinationId: destination3.id,
      distanceInKm: 18,
      durationInSec: 1080,
      valueInCents: 1800,
    },
  });

  const ride88 = await prisma.ride.create({
    data: {
      customerId: customer2.id,
      driverId: driver8.id,
      originId: origin3.id,
      destinationId: destination3.id,
      distanceInKm: 18,
      durationInSec: 1080,
      valueInCents: 1800,
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
      rideId: ride12.id,
      rating: 5,
      comment: 'Great ride, smooth and quick!',
    },
  });

  await prisma.review.create({
    data: {
      rideId: ride12.id,
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

  await prisma.review.create({
    data: {
      rideId: ride22.id,
      rating: 4,
      comment: 'Good ride, but a little slow.',
    },
  });

  await prisma.review.create({
    data: {
      rideId: ride3.id,
      rating: 3,
      comment: 'Average ride, nothing special.',
    },
  });

  await prisma.review.create({
    data: {
      rideId: ride33.id,
      rating: 3,
      comment: 'Average ride, nothing special.',
    },
  });

  await prisma.review.create({
    data: {
      rideId: ride2.id,
      rating: 4,
      comment: 'Good ride, but a little slow.',
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
