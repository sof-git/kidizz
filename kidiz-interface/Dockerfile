# Stage 1: Build the Vue application
FROM node:18 AS build
WORKDIR /app

# Copy only the package.json and package-lock.json initially to optimize caching
COPY package*.json ./
RUN npm install

# Copy all source files to the container
COPY . .

# Build the Vue application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Remove the default Nginx static assets (optional, for cleanup)
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the previous stage to Nginx's default serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config file to container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]