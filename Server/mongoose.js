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
  let result;
  const userExists = await User.findOne({ username: user.username });
  if (userExists) {
    result = false;
  } else {
    // The username does not alredy exist.
    const userDocumentToSave = new User(user);
    result = await userDocumentToSave.save();
  }
  await mongoose.connection.close();
  return result;
};

// This takes in a user object with properties for username and password.  It checks if the
// password from the user object is the correct password for the user.  If so, it returns the user
// document from the database.  Otherwise, it returns false.
const checkUser = async function (user) {
  await mongoose.connect(constants.databaseDomain);
  let result;
  const userDocument = await User.findOne({ username: user.username });
  // The format of the user object may be correct, but the username does not exist.  In this case,
  // the value returned by the database will be null, and trying to access the password property
  // will cause an error.  So, a check is performed on the document object, userDocument, first.
  if (userDocument && (user.password === userDocument.password)) {
    result = userDocument;
  } else {
    result = false;
  }
  await mongoose.connection.close();
  return result;
};

module.exports = { addUser, checkUser };