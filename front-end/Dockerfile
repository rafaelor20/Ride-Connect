FROM node:20-alpine

WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Instala dependencias e gera o build
RUN npm i && npm run build

# Ao iniciar o container, garante que o volume compartilhado /var/www/html receba os arquivos da nova build
CMD ["sh", "-c", "mkdir -p /var/www/html && rm -rf /var/www/html/* && cp -rf /app/dist/* /var/www/html/ && echo 'Frontend build sincronizado com sucesso no volume!'"]
