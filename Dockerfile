FROM node:18-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build your React application for production
RUN npm run build

# Stage 2 - Serve the production build with nginx
FROM nginx:1.21-alpine


# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outer world
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
