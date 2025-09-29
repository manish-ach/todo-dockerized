# node image
FROM node:22-alpine

# workdir
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json .

# install dependencies
RUN npm install

# copy other files
COPY . .

# # generate prisma client
# RUN npx prisma generate

# export the port of the webapp
EXPOSE 8001

# define command to run the app
CMD [ "node", "./src/server.js"]