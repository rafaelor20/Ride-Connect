# ==============================================================================
# Stage 1: Build do Frontend com Node.js (Builder)
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de definicao de pacotes
COPY package*.json ./

# Instala dependencias para a compilacao
RUN npm install

# Copia o codigo fonte da aplicacao
COPY . .

# Executa o build de producao do Vite (gera pasta /app/dist)
RUN npm run build

# ==============================================================================
# Stage 2: Sincronizador de Volume Ultra-Leve (Runner)
# ==============================================================================
FROM alpine:latest AS runner

WORKDIR /app

# Copia apenas os arquivos estaticos compilados (sem node_modules e sem Node.js ~5MB)
COPY --from=builder /app/dist ./dist

# Ao iniciar o container, sincroniza os arquivos compilados no volume compartilhado
CMD ["sh", "-c", "mkdir -p /var/www/html && rm -rf /var/www/html/* && cp -rf /app/dist/* /var/www/html/ && echo 'Frontend build sincronizado com sucesso no volume!'"]
