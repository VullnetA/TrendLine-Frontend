# Step 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Step 2: Serve the application with Nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Remove the default Nginx static assets
RUN rm -rf ./*

# Copy the built React app from the previous stage
COPY --from=build /app/build .

# Copy custom Nginx configuration if necessary
# Uncomment the next line if you have a custom nginx.conf
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
