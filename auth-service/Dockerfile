FROM node:20-alpine3.20 AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json tsconfig.json ./
COPY src ./src

RUN npm ci --no-audit --no-fund && npx tsc && npm prune --omit=dev

FROM node:20-alpine3.20

WORKDIR /app

RUN apk update && apk upgrade \
  && addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "dist/main/index.js"]
