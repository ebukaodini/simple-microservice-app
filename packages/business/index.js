const express = require('express');
const { writeFile } = require('fs');
const app = express();
const businesses = require('./businesses.json');
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    businesses: businesses
  });
});

router.post('/', (req, res) => {
  const { business, description, branches } = req.body;
  const { role } = req.headers
  if (role === 'admin') {
    businesses.push({
      id: Date.now(),
      business, description, branches
    });
    writeFile('./businesses.json', JSON.stringify(businesses), (err) => {
      if (err) res.status(400).send(err.message);
      res.send('Business added!');
    });
  } else res.send('Unauthorized access')
});

router.get('/:id', (req, res) => {
  const business = businesses.find(biz => biz.id === Number(req.params.id))
  if (business === undefined)
    res.status(400).send('Business not found!');
    else res.json(business)
});


app.use(express.json());
app.use('/businesses', router)

app.listen(5001, () => {
  console.log("/businesses service running at http://localhost:5001");
});