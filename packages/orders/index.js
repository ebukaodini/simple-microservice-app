const express = require('express');
const { writeFile } = require('fs');
const app = express();
const amqp = require('amqplib');
const orders = require('./orders.json');
const router = express.Router()
let channel, connection;

connect();
async function connect() {
  try {
    const amqpserver = "amqp://localhost:5672";
    connection = await amqp.connect(amqpserver);
    channel = await connection.createChannel();
    await channel.assertQueue('PAYMENT_ADDED');

    // event listeners
    channel.consume('PAYMENT_ADDED', data => workerUpdateOrderStatusToPaid(data));

  } catch (error) {
    console.log(error.message);
  }
}

router.get('/', (req, res) => {
  const { role } = req.headers
  if (role === 'admin') {
    res.json({
      orders: orders
    });
  } else res.send('Unauthorized access')
});

router.post('/', (req, res) => {
  const { business, quantity, amount } = req.body;
  const { user } = req.headers
  orders.push({
    id: Date.now(), user: Number(user),
    business, quantity, amount,
    total: Number(amount) * Number(quantity),
    status: 'pending'
  });
  writeFile('./orders.json', JSON.stringify(orders), (err) => {
    if (err) res.status(400).send(err.message);
    res.send('Order added!');
  });
});

router.get('/:id', (req, res) => {
  const order = orders.find(order => order.id === Number(req.params.id))
  if (order === undefined)
    res.status(400).send('Order not found!');
  else res.json(order)
});

router.patch('/deliver/:id', (req, res) => {
  const { role } = req.headers
  if (role === 'admin') {
    const order = orders.find(order => order.id === Number(req.params.id))
    if (order === undefined)
      res.status(400).send('Order not found!');
    else {
      const index = orders.indexOf(order)
      orders.splice(index, 1, { ...order, status: 'delivered' })
      writeFile('./orders.json', JSON.stringify(orders), (err) => {
        if (err) res.status(400).send(err.message);
        // intiate the DELIVER_CARDS event
        const { business, user, quantity, amount } = order
        eventDeliverCards({ business, user, quantity, amount })
        res.send('Order status updated!');
      });
    }
  } else res.send('Unauthorized access')
});

// events

const eventDeliverCards = async (data) => {
  console.log('sent', 'DELIVER_CARDS', data);
  await channel.sendToQueue("DELIVER_CARDS", Buffer.from(JSON.stringify(data)));
  await channel.close();
  await connection.close();
};

// workers

const workerUpdateOrderStatusToPaid = async (data) => {
  console.log(`Received: ${Buffer.from(data.content)}`)
  const { order: orderId } = JSON.parse(Buffer.from(data.content))

  const order = orders.find(order => order.id === orderId)
  if (order === undefined)
    console.log('Order not found!');
  else {
    const index = orders.indexOf(order)
    orders.splice(index, 1, { ...order, status: 'paid' })
    writeFile('./orders.json', JSON.stringify(orders), (err) => {
      if (err) console.log(err.message);
      console.log('Order status updated!');
    });
  }

  channel.ack(data)
}

app.use(express.json());
app.use('/orders', router)

app.listen(5002, () => {
  console.log("/orders service running at http://localhost:5002");
});