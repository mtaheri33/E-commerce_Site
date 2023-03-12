const mongoose = require('mongoose');
const constants = require('../constants');
mongoose.set('strictQuery', false);

// The structure for a user document is:
// String username,
// String password,
// {String product id: Number quantity to order, ...} cart,
// Array<String order id> orders,
// Array<String product id> products,
// {String product id: Number rating, ...} ratings,
const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  cart: { type: Object, default: {} },
  orders: [String],
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

// The structure for a product document is:
// String name,
// Decimal128 price,
// Number quantity,
// String description,
// String createdBy,
// {String user id: Number rating, ...} ratings,
const productsSchema = new mongoose.Schema({
  name: String,
  price: mongoose.Decimal128,
  quantity: Number,
  description: String,
  createdBy: String,
  ratings: { type: Object, default: {} },
}, { minimize: false });
const Product = mongoose.model('Product', productsSchema);

// This takes in a product object with properties for name, price, quantity, description, and
// createdBy.  It creates and then saves a new Product document in the database using the product
// object.  It also updates the related user document to add the product.  The new product document
// object is then returned.
const addProduct = async function (product) {
  await mongoose.connect(constants.databaseDomain);
  // This creates and saves the new product.
  const productDocumentToSave = new Product(product);
  result = await productDocumentToSave.save();
  // This adds the product to the user document.
  const userDocument = await User.findOne({ _id: product.createdBy });
  userDocument.products.push(result._id.toString());
  await userDocument.save();
  // This closes the database connection and returns the new product document.
  await mongoose.connection.close();
  return result;
};

// This takes in a user id.  It finds all of the product documents for that user and returns them
// in an array.
const getProducts = async function (userId) {
  await mongoose.connect(constants.databaseDomain);
  // This gets the product ids from the user document.
  const userDocument = await User.findOne({ _id: userId });
  const products = userDocument.products;
  // This iterates through the product ids and finds the product documents from the database.
  // For each one, it adds it to the result array.
  const result = [];
  for (let productId of products) {
    const productDocument = await Product.findOne({ _id: productId });
    result.push(productDocument);
  }
  // This closes the database connection and returns the product documents.
  await mongoose.connection.close();
  return result;
}

// This takes in a product id.  It finds and then returns the related product document.
const getProduct = async function (productId) {
  await mongoose.connect(constants.databaseDomain);
  const productDocument = await Product.findById(productId).exec();
  // This closes the database connection and returns the product document.
  await mongoose.connection.close();
  return productDocument;
};

// This takes in a user id.  It finds and then returns the related user document.
const getUser = async function (userId) {
  await mongoose.connect(constants.databaseDomain);
  const userDocument = await User.findById(userId).exec();
  // This closes the database connection and returns the user document.
  await mongoose.connection.close();
  return userDocument;
};

module.exports = { addUser, checkUser, addProduct, getProducts, getProduct, getUser };

// {String order number: {} order details, ...} orders
//   {
//     products: {String product id: Number quantity ordered, ...},
//     address: {name: String name, street: String street, city: String city, state: String state,
//               zipCode: String zip code},
//     card: {name: String name, number: String number, expirationDate: String expiration date,
//            code: Number code},
//     date: String date ordered,
//   } order details,