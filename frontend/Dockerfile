# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest as build
RUN npm install -g @angular/cli@10.1.3

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN ng build --prod

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/tesis-asn /usr/share/nginx/html

# Expose port 80
EXPOSE 80
