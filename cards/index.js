const express = require('express');
const crypto = require('crypto');
const { writeFile } = require('fs');
const app = express();
const amqp = require('amqplib');
const cards = require('./cards.json');
const router = express.Router()
let channel, connection;

connect();
async function connect() {
  try {
    const amqpserver = "amqp://localhost:5672";
    connection = await amqp.connect(amqpserver);
    channel = await connection.createChannel();
    await channel.assertQueue('DELIVER_CARDS');

    // event listeners
    channel.consume('DELIVER_CARDS', data => workerDeliverUserCards(data));

  } catch (error) {
    console.log(error.message);
  }
}

router.get('/', (req, res) => {
  const userCards = cards.filter(card => card.user === Number(req.headers.user))
  if (userCards.length === 0)
    res.status(400).send('No available cards!');
  else res.json({ cards: userCards })
});

router.get('/:id', (req, res) => {
  const card = cards.find(card =>
    (card.user === Number(req.headers.user) && (card.id === req.params.id)))
  if (card === undefined)
    res.status(400).send('Card not found!');
  else res.json(card)
});


// workers

const workerDeliverUserCards = async (data) => {
  console.log(`Received: ${Buffer.from(data.content)}`)
  let { business, user, quantity, amount } = JSON.parse(Buffer.from(data.content))

  while (quantity > 0) {
    cards.push({
      id: crypto.randomBytes(6).toString("hex"), user, business,
      amount, balance: amount, active: true
    })
    quantity -= 1;
  }

  writeFile('./cards.json', JSON.stringify(cards), (err) => {
    if (err) console.log(err.message);
    console.log('Cards delivered!');
  });

  channel.ack(data)
}

app.use(express.json());
app.use('/cards', router)

app.listen(5004, () => {
  console.log("/cards service running at http://localhost:5004");
});