FROM node:18-alpine

WORKDIR /app

# Copy package files first for layer caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY src/ ./src/
COPY config/ ./config/
COPY scripts/ ./scripts/

EXPOSE 3000
EXPOSE 8080

CMD ["node", "src/index.js"]
