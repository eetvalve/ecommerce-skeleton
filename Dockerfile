# Use the official Node.js image as a base
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the SvelteKit project
RUN npm run buildProd

# Expose the port the app will run on
EXPOSE 3000

# Start the SvelteKit app using Node
CMD ["node", "build"]
