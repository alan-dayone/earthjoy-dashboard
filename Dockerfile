# Check out https://hub.docker.com/_/node to select a new base image
FROM node:12.16.1-slim

RUN apt-get update && apt-get install -y git-core

# Set to a non-root built-in user `node`
# Create app directory (with user `node`)
RUN mkdir -p /app/

WORKDIR /app/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
#
## Bundle app source code
COPY . .
#


RUN npm run build

#RUN cp -r build/* .
#RUN cp -r build-bundle/* .

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0
