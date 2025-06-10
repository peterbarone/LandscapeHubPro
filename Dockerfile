FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Bundle app source
COPY . .

# Create a non-root user with an explicit UID and add permission to access the /app folder
# For security: this user will run the application
RUN adduser -D -u 1001 appuser && \
    chown -R appuser:appuser /app

USER appuser

# Your app binds to port 3000 by default
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
