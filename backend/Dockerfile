FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 7000

CMD ["node", "src/index.js"]
