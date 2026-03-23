# =============================
# BUILD DO ANGULAR
# =============================
FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas package.json primeiro (melhor cache)
COPY package*.json ./
RUN npm ci

# Copia o restante do Angular
COPY . .

# Build
RUN npm run build

# =============================
# NGINX RUNTIME
# =============================
FROM nginx:alpine

# Remove config default
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia config customizado
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/app/browser /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]