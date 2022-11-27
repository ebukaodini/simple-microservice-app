# FROM node:17-alpine3.12

# WORKDIR /app

# COPY package.json /app

# RUN npm install

# COPY . /app

# EXPOSE 5003

# CMD [ "npm", "start" ]

FROM node:17-alpine3.12

WORKDIR /app

COPY package.json /app

COPY packages/common/package.json /app/packages/common/

COPY packages/payments/package.json /app/packages/payments/

RUN npm install

COPY packages/common/. /app/packages/common/

COPY packages/payments/. /app/packages/payments/

EXPOSE 5003

CMD npm start -w @app/payments
