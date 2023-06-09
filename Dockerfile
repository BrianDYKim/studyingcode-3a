# Build Stage
FROM node:18-alpine as BUILDER
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN npm run build

# Running Stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
COPY .env .
RUN npm ci --omit=dev && npm i -g pm2
COPY --from=BUILDER /app/dist ./dist
EXPOSE 3000
CMD ["pm2-runtime", "dist/main.js"]