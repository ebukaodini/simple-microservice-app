const express = require('express');
const { writeFile } = require('fs');
const app = express();
const amqp = require('amqplib');
const payments = require('./payments.json');
const router = express.Router()
let channel, connection;

connect();
async function connect() {
  try {
    const amqpserver = "amqp://localhost:5672";
    connection = await amqp.connect(amqpserver);
    channel = await connection.createChannel();
  } catch (error) {
    console.log(error.message);
  }
}

router.get('/', (req, res) => {
  const { role } = req.headers
  if (role === 'admin') {
    res.json({
      payments: payments
    });
  } else res.send('Unauthorized access')
});

router.post('/checkout', (req, res) => {
  const { order, total } = req.body;
  const { user } = req.headers
  payments.push({
    id: Date.now(), user: Number(user),
    order, total, status: 'success'
  });
  writeFile('./payments.json', JSON.stringify(payments), (err) => {
    if (err) res.status(400).send(err.message);

    // trigger the PAYMENT_ADDED event
    eventPaymentAdded({order})
    res.send('Payment successful!');
  });
});


// events

const eventPaymentAdded = async (data) => {
  console.log('sent', 'PAYMENT_ADDED', data);
  await channel.sendToQueue("PAYMENT_ADDED", Buffer.from(JSON.stringify(data)));
  await channel.close();
  await connection.close();
};

app.use(express.json());
app.use('/payments', router)

app.listen(5003, () => {
  console.log("/payments service running at http://localhost:5003");
});