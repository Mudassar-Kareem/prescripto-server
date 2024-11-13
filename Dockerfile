# Start with the base Node image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Rebuild bcrypt for Linux compatibility
RUN npm rebuild bcrypt --build-from-source

# Expose the application port
EXPOSE 4001

# Start the server
CMD ["npm", "start"]
