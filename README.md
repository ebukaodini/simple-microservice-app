# Simple Ecommerce App.
A simple application to reflect a custom e-commerce store using the micro-service design architecture. Technologies used are NodeJs, JavaScript, RabbitMQ.

## Services
- accounts
- business
- orders
- payments
- cards

## User story
User can create account and log into the store. They can view businesses in the store, view the business details and order cards from these businesses. They can place orders for cards from these businesses and make payment. They can monitor the status of their order (pending, paid, delivered). They can view the cards they ordered, view details of these cards and check the balance on the cards.

## Admin story
An admin can add new businesses to the business record. An admin can also toggle the status of the order to delivered. This operation triggers a worker that adds the ordered cards to the user's cards record.

## Endpoints
- account
  - `POST /accounts/register` - to register a new user account
  - `POST /accounts/login` - to authenticate a user
- business
  - `POST /businesses` - to add new businesses (admin only)
  - `GET /businesses` - to get the list of businesses
  - `GET /businesses/details/:id` - to get the business details
- order
  - `GET /orders` - to get all orders (admin only)
  - `POST /orders` - to place a new order
  - `GET /orders/:id` - to get the order details
  - `PATCH /orders/deliver/:id` - to update the status of the order to delivered (admin only)
  - events:
    - `DELIVER_CARDS` - event to deliver cards to user
  - workers:
    - `PAYMENT_ADDED` - update the status of the order to paid
- payment
  - `POST /payments/checkout` - to complete payment for an order
  - events:
    - `PAYMENT_ADDED` - event to deliver cards to user
- card
  - `GET /cards` - to get list of user cards
  - `GET /cards/:id` - to get cards details
  - workers:
    - `DELIVER_CARDS` - adds ordered cards for user

## Postman Docs:
https://documenter.getpostman.com/view/6884204/2s8YYJp2Td

## Build
Build Docker containers locally

```bash
$ docker-compose up --build -d
```

## Usage
After you've spun up the container, run

```bash
$ docker-compose up -d
```

> NOTE: This project is not done with best practice in mind. Do not use for production.

> PS: The database feature was implemented with basic JSON files.
