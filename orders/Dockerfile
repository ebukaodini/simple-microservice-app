FROM node:17-alpine3.12

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 5002

CMD [ "npm", "start" ]