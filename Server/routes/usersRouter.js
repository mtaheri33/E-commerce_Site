const express = require('express');
const router = express.Router();
const { addUser } = require('../mongoose');

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

module.exports = router;