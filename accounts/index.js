const express = require('express');
const { writeFile } = require('fs');
const dateToString = require('common');
const app = express();
const accounts = require('./accounts.json');
const router = express.Router()

router.get('/', (req, res) => {
  res.send(`Welcome to accounts. ${dateToString(Date.now())}`)
})

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  accounts.push({
    id: Date.now(),
    email, password,
    role: accounts.length === 0 ? 'admin' : 'user'
  });
  writeFile('./accounts.json', JSON.stringify(accounts), (err) => {
    if (err) res.status(400).send(err.message);
    res.send('Account created!');
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const account = accounts.find(acct => acct.email === email && acct.password === password)
  if (account === undefined)
    res.status(400).send('Invalid credentials');
    else res.json(account)
});

app.use(express.json());
app.use('/accounts', router)

app.listen(5000, () => {
  console.log("/accounts service running at http://localhost:5000");
});