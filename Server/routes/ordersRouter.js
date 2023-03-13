const express = require('express');
const router = express.Router();
const { addOrder } = require('../mongoose');

// req.body should be an object with properties for orderedBy, products, address, and card.  This takes
// the object from the request and runs the addOrder function to create the new order in the
// database.  If the order is successfully created, this sends back the newly created order object
// from the database.  Otherwise, it sends back the status bad request.
router.post('/', (req, res) => {
  addOrder(req.body)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch(() => {
      res.status(400).send();
    });
});

module.exports = router;