FROM node:20-slim

# Instala dependencias necessarias para o Prisma Engine
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src

COPY . .

RUN npm i && npx prisma generate && npm run build

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]