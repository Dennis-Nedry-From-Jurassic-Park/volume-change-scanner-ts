# https://hub.docker.com/_/node/tags?page=2
FROM node:18.8.0-alpine3.16

RUN apk add --no-cache python3 make g++

RUN mkdir /app
WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
COPY package*.json /app/

RUN npm install

#RUN npm init -y
#RUN npm install -g -typescript
#RUN npm i -g @nestjs/cli
#RUN npm install pkginfo

# A wildcard is used to ensure both package.json AND package-lock.json are copied


#RUN ls -a
#CMD [ "pwd" ]
#CMD [ "ls", "-a" ]

# Install app dependencies
#RUN npm install
# Bundle app source
COPY . .

RUN npm run build

#RUN npm run start
#CMD ["nest", "start"]


#RUN npm run build
# npm run .start

EXPOSE 9200

#CMD [ "npm", "run", "start" ]
#CMD ["node", "dist/dist/src/main.js"]

