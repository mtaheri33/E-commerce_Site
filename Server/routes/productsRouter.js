const express = require('express');
const router = express.Router();
const { addProduct, getProduct } = require('../mongoose');

// req.body should be an object with properties for name, price, quantity, description, and
// createdBy.  This takes the object from the request and runs the addProduct function to create
// the new product in the database.  If the product is successfully created, this sends back the
// newly created product object from the database.  Otherwise, it sends back the status bad
// request.
router.post('/', (req, res) => {
  addProduct(req.body)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch(() => {
      res.status(400).send();
    });
});

// This is used to get the product document from the database with the product id from the route.
router.get('/:productId', (req, res) => {
  getProduct(req.params.productId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(400).send();
    });
});

module.exports = router;