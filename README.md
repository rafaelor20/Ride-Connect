# About

This project is a ride-hailing application inspired by Uber. It leverages the Google Maps API to calculate the distance between user-specified pickup and drop-off locations. Based on the calculated distance, the app displays a list of available drivers along with the estimated ride prices.

## How to run the application using docker-compose

First of all, you need a google api key, you can get one here:

```bash
https://cloud.google.com/apis?hl=pt-BR
```

Create two .env files, one in the front-end folder and the other in the back-end folder.

Copy and paste the contents from .env.example and the google api ket in to the new .env files

```bash
docker compose -f 'docker-compose.yml' up -d --build
```


After executing the command, access http://localhost:8080/ on your browser and use the credentials below to test app or create a new one at http://localhost:8080/sign-up

```bash
email: user@test.com
```


```bash
password: qwerasdf
```
