# FROM node:17-alpine3.12

# WORKDIR /app

# COPY package.json /app

# RUN npm install

# COPY . /app

# EXPOSE 5004

# CMD [ "npm", "start" ]

FROM node:17-alpine3.12

WORKDIR /app

COPY package.json /app

COPY packages/common/package.json /app/packages/common/

COPY packages/cards/package.json /app/packages/cards/

RUN npm install

COPY packages/common/. /app/packages/common/

COPY packages/cards/. /app/packages/cards/

EXPOSE 5004

CMD npm start -w @app/cards
