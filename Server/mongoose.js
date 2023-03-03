const mongoose = require('mongoose');
const constants = require('../constants');
mongoose.set('strictQuery', false);

// The structure for a user document is:
// String username,
// String password,
// {String product id: Number quantity to order, ...} cart,
// {String order number: {} order details, ...} orders
//   {
//     products: {String product id: Number quantity ordered, ...},
//     address: {name: String name, street: String street, city: String city, state: String state,
//               zipCode: String zip code},
//     card: {name: String name, number: String number, expirationDate: String expiration date,
//            code: Number code},
//     date: String date ordered,
//   } order details,
// Array<String product id> products,
// {String product id: Number rating, ...} ratings,
const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  cart: { type: Object, default: {} },
  orders: { type: Object, default: {} },
  products: [String],
  ratings: { type: Object, default: {} },
}, { minimize: false });
const User = mongoose.model('User', usersSchema);

// This takes in a user object with properties for username and password.  It checks if the
// username from the user object already exists in the database.  If so, it returns false.
// Otherwise, it creates and then saves a new User document in the database using the user object.
// The new document object is then returned.
const addUser = async function (user) {
  await mongoose.connect(constants.databaseDomain);
  const userExists = await User.findOne({ username: user.username });
  if (userExists) {
    return false;
  }
  // The username does not alredy exist.
  const userDocumentToSave = new User(user);
  const userDocumentCreated = await userDocumentToSave.save();
  await mongoose.connection.close();
  return userDocumentCreated;
};

module.exports = { addUser };