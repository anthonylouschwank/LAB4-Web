FROM node:18-alpine

# Instala http-server de forma global
RUN npm install -g http-server

WORKDIR /app

# Copia todos los archivos estáticos (JS, SVG, HTML, etc.)
COPY . .

# Puerto donde correrá http-server (usa el 8080 directamente)
EXPOSE 8080

# Inicia el servidor (--bind 0.0.0.0 es clave para Docker)
CMD ["http-server", "--port", "8080", "--bind", "0.0.0.0"]