# Use the official Node.js 20 image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

ENV node_env=dev
ENV PORT=5000
ENV mongoDbUri=mongodb://127.0.0.1:27017/delivery
ENV redisUri=redis://:masterpassword123@127.0.0.1:7000
ENV expirationTime=3600
ENV jwtSecret=Gozem_api_secret

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Build TypeScript files
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Run the app
CMD ["npm", "start"]