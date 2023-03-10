const express = require('express');
const app = express();
const cors = require('cors');
const constants = require('../constants');

app.use(express.json());
app.use(cors());

const usersRouter = require('./routes/usersRouter')
app.use('/users', usersRouter);

const productsRouter = require('./routes/productsRouter')
app.use('/products', productsRouter);

const ordersRouter = require('./routes/ordersRouter')
app.use('/orders', ordersRouter);

app.use((req, res) => {
  res.send('Sorry, the route does not exist.');
});

app.listen(constants.serverPort, () => {
  console.log('Server started on port ' + constants.serverPort);
});