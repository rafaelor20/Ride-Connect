# ==============================================================================
# Stage 1: Build & Dependencies (Builder)
# ==============================================================================
FROM node:20-slim AS builder

# Instala dependencias do sistema necessarias para compilacao e geracao do Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src

# Copia arquivos de definicao de pacotes e esquema do Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instala todas as dependencias (incluindo devDependencies necessarias para build)
RUN npm install

# Gera o cliente Prisma com os binarios configurados
RUN npx prisma generate

# Copia o codigo fonte
COPY . .

# Compila TypeScript para JavaScript na pasta dist
RUN npm run build

# ==============================================================================
# Stage 2: Imagem Final de Producao (Runner)
# ==============================================================================
FROM node:20-slim AS runner

# Instala apenas as bibliotecas necessarias em tempo de execucao
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src

ENV NODE_ENV=production

# Copia as definicoes de pacotes e configuracoes do Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Copia os modulos instalados e o build compilado da etapa builder
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/dist ./dist

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]