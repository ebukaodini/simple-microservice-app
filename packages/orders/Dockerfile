# FROM node:17-alpine3.12

# WORKDIR /app

# COPY package.json /app

# RUN npm install

# COPY . /app

# EXPOSE 5002

# CMD [ "npm", "start" ]

FROM node:17-alpine3.12

WORKDIR /app

COPY package.json /app

COPY packages/common/package.json /app/packages/common/

COPY packages/orders/package.json /app/packages/orders/

RUN npm install

COPY packages/common/. /app/packages/common/

COPY packages/orders/. /app/packages/orders/

EXPOSE 5002

CMD npm start -w @app/orders
