# Backend image: dependencies are installed at build time, not on every container start.
#
# Packages live in /node_modules (one level above the app). Node resolves modules by walking
# up from /app, so the source can be bind-mounted at /app for development (docker-compose
# hides any host-side server/node_modules with an empty tmpfs) without shadowing them.
FROM node:20-alpine

WORKDIR /
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force
ENV PATH=/node_modules/.bin:$PATH

WORKDIR /app
COPY . .

EXPOSE 5000
CMD ["node", "index.js"]
