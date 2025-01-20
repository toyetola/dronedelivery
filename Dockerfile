# Use the official Node.js image as the base image
FROM node:22

# Create and change to the app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
RUN npm install

COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]