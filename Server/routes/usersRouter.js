const express = require('express');
const router = express.Router();
const { addUser, checkUser } = require('../mongoose');

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

module.exports = router;