## Diagram Classes

```mermaid
classDiagram
    class Customer {
        +id: Int
        +name: String
        +email: String
        +password: String
        +createdAt: DateTime
        +updatedAt: DateTime
        +rides: Ride[]
        +Session: Session[]
    }

    class Session {
        +id: Int
        +customerId: Int
        +token: String
        +createdAt: DateTime
    }

    class Driver {
        +id: Int
        +name: String
        +description: String
        +vehicle: String
        +pricePerKmInCents: Int
        +minKm: Int
        +createdAt: DateTime
        +updatedAt: DateTime
        +rides: Ride[]
    }

    class Review {
        +id: Int
        +rideId: Int
        +rating: Int
        +comment: String
        +createdAt: DateTime
        +updatedAt: DateTime
    }

    class Origin {
        +id: Int
        +address: String
        +rides: Ride[]
    }

    class Destination {
        +id: Int
        +address: String
        +rides: Ride[]
    }

    class Ride {
        +id: Int
        +customerId: Int
        +driverId: Int
        +originId: Int
        +destinationId: Int
        +distanceInKm: Int
        +durationInSec: Int
        +valueInCents: Int
        +createdAt: DateTime
        +updatedAt: DateTime
        +review: Review[]
    }

    %% Relationships
    Customer "1" --o "1..*" Session : has
    Customer "1" --o "1..*" Ride : has
    Driver "1" --o "1..*" Ride : has
    Ride "1" --o "1" Review : has
    Ride "1" --o "1" Origin : startsAt
    Ride "1" --o "1" Destination : endsAt

```


## Endpoints

POST "/users"
Body: { name, email, password }
Response: {
          id,
          email,
          username,
}

POST "/auth/sign-in"
Body: { email, password }
Response: {
    token
  };

POST "/ride/estimate"
Body: {origin, destination }
Response: {
      origin: {
        latitude,
        longitude,
      },
      destination: {
        latitude,
        longitude,
      },
      distance,
      duration,
      options:{ ## multiple drivers
          id: driver.id,
          name: driver.name,
          description: driver.description,
          vehicle: driver.vehicle,
          review:{ ## multiple reviews
                  rating: review.rating,
                  comment: review.comment,
              },
          value:,
      }
      routeResponse,
    }

PATCH "/ride/confirm"
Body: {origin, destination, distance, duration, driver, value}
Response: { success: true }

GET "/ride/?driver_id"
Query: {driver_id}
Response: {
    rides: { ## multiple rides
        id: number;
        customerId: number;
        driverId: number;
        originId: number;
        destinationId: number;
        distanceInKm: number;
        durationInSec: number;
        valueInCents: number;
        createdAt: Date;
        updatedAt: Date;
    } ## Rides can be filtered by driverId
}