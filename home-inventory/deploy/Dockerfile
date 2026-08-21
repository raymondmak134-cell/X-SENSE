FROM node:22-bookworm-slim AS deps

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

RUN npm install

FROM deps AS build
COPY . .
RUN npm run build -w client

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV DATA_DIR=/data

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/
RUN npm install --omit=dev

COPY server ./server
COPY --from=build /app/client/dist ./client/dist

RUN mkdir -p /data
VOLUME ["/data"]
EXPOSE 3001

CMD ["npm", "run", "start", "-w", "server"]
