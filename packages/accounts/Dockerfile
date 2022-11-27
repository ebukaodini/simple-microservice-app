# FROM node:17-alpine3.12

# WORKDIR /app

# COPY package.json /app

# RUN npm install

# COPY . /app

# EXPOSE 5000

# CMD [ "npm", "start" ]

FROM node:17-alpine3.12

WORKDIR /app

COPY package.json /app

COPY packages/common/package.json /app/packages/common/

COPY packages/accounts/package.json /app/packages/accounts/

RUN npm install

COPY packages/common/. /app/packages/common/

COPY packages/accounts/. /app/packages/accounts/

EXPOSE 5000

CMD npm start -w @app/accounts
