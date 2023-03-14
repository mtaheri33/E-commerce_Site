const express = require('express');
const router = express.Router();
const { addUser, checkUser, getUserProducts, getUser, saveCart, getUserOrders } = require('../mongoose');

// req.body should be an object with properties for username and password.  This takes the object
// from the request and runs the addUser function to create the new user in the database.  If the
// user is successfully created, this sends back the newly created user object from the database.
// Otherwise, it sends back the status bad request.
router.post('/', (req, res) => {
  addUser(req.body)
    .then((data) => {
      if (!data) {
        // The username from the request already exists, so a new user cannot be created.
        res.status(400).send('username already exists');
      } else {
        res.status(201).send(data);
      }
    })
    .catch(() => {
      res.status(400).send();
    });
});

// req.body should be an object with properties for username and password.  This takes the object
// from the request and runs the getUser function to check if the password is correct for the given
// user.  If it is, this sends back the user object from the database.  Otherwise, it sends back
// the status forbidden.  If the passed in object is not the proper format, it instead sends back
// the status bad request.
router.post('/signIn', (req, res) => {
  checkUser(req.body)
    .then((data) => {
      if (!data) {
        // The password is not correct.
        res.status(403).send();
      } else {
        res.status(200).send(data);
      }
    })
    .catch(() => {
      res.status(400).send();
    });
});

// req.query should have a parameter and value for userId.  This takes the user id from the request
// and runs the getUserProducts function to get the product documents of the products the user
// created from the database.  If it is successful, this sends back an array of the product
// documents.  Otherwise, it sends back the status bad request.
router.get('/products', (req, res) => {
  getUserProducts(req.query.userId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(400).send();
    });
});

// req.query should have a parameter and value for userId.  This takes the user id from the request
// and runs the getUserOrders function to get the order documents of the orders the user
// has in the database.  If it is successful, this sends back an array of the order
// documents.  Otherwise, it sends back the status bad request.
router.get('/orders', (req, res) => {
  getUserOrders(req.query.userId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(400).send();
    });
});

// This is used to get the user document from the database with the user id from the route.
router.get('/:userId', (req, res) => {
  getUser(req.params.userId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(400).send();
    });
});

// req.body should be an object with a property for cart that equals a cart array.
// This runs the saveCart function to save the passed in cart in the database for the user document
// with the given user id.  It then sends back the status created.  If an error occurs, it sends
// back the status bad request.
router.post('/cart/:userId', (req, res) => {
  saveCart(req.body.cart, req.params.userId)
    .then(() => {
      res.status(201).send();
    })
    .catch(() => {
      res.status(400).send();
    });
});

module.exports = router;