# FROM node:17-alpine3.12

# WORKDIR /app

# COPY package.json /app

# RUN npm install

# COPY . /app

# EXPOSE 5001

# CMD [ "npm", "start" ]

FROM node:17-alpine3.12

WORKDIR /app

COPY package.json /app

COPY packages/common/package.json /app/packages/common/

COPY packages/business/package.json /app/packages/business/

RUN npm install

COPY packages/common/. /app/packages/common/

COPY packages/business/. /app/packages/business/

EXPOSE 5001

CMD npm start -w @app/business
