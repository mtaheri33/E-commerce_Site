const mongoose = require('mongoose');
const constants = require('../constants');
mongoose.set('strictQuery', false);

// The structure for a user document is:
// String username,
// String password,
// Array<Object product details> cart
//   {String product id, String product name, Number quantity to order, Number total price} product details,
// Array<String order id> orders,
// Array<String product id> products,
// {String product id: Number rating, ...} ratings,
const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  cart: [Object],
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
  price: Number,
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
const getUserProducts = async function (userId) {
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

// This finds and returns all of the products documents in the database.
const getProducts = async function () {
  await mongoose.connect(constants.databaseDomain);
  const productDocuments = await Product.find().exec();
  // This closes the database connection and returns the product documents.
  await mongoose.connection.close();
  return productDocuments;
};

// This takes in a cart array and user id.  It saves the cart for the user in the database and
// returns true.
const saveCart = async function (cart, userId) {
  await mongoose.connect(constants.databaseDomain);
  const userDocument = await User.findById(userId).exec();
  userDocument.cart = cart;
  await userDocument.save();
  await mongoose.connection.close();
  return true;
};

// This takes in a rating value, user id, and product id.  It saves the rating in the user and
// product documents then returns true.
const rateProduct = async function (rating, userId, productId) {
  await mongoose.connect(constants.databaseDomain);
  const userDocument = await User.findById(userId).exec();
  // This creates new ratings objects with all of the old ratings.  It then adds the rating and
  // sets the ratings properties to the new objects.
  const newUserRatings = { ...userDocument.ratings };
  newUserRatings[productId] = rating;
  userDocument.ratings = newUserRatings;
  await userDocument.save();
  const productDocument = await Product.findById(productId).exec();
  const newProductRatings = { ...productDocument.ratings };
  newProductRatings[userId] = rating;
  productDocument.ratings = newProductRatings;
  await productDocument.save();
  await mongoose.connection.close();
  return true;
};

// The structure for an order document is:
// String orderedBy,
// Array<Object product details> products
//   {String product id, String product name, Number quantity to order, Number total price} product details,
// String address,
// String card,
const ordersSchema = new mongoose.Schema({
  orderedBy: String,
  products: [Object],
  address: String,
  card: String,
});
const Order = mongoose.model('Order', ordersSchema);

// This takes in an order object with properties for orderedBy, products, address, and card.  It
// creates and then saves a new Order document in the database using the order object.  It then
// uses the id of the newly created order and saves it in the user document of the user who sent
// the order while also clearing the saved cart of the user.  It also updates the quantities of the
// products.  The new order document object is then returned.
const addOrder = async function (order) {
  await mongoose.connect(constants.databaseDomain);
  // This creates and saves the new order.
  let result;
  const orderDocument = new Order(order);
  result = await orderDocument.save();
  // This saves the order id of the new order and clears the saved cart in the user document.
  const userDocument = await User.findById(order.orderedBy).exec();
  userDocument.orders.push(result._id.toString());
  userDocument.cart = [];
  await userDocument.save();
  // This updates the quantities of the products that were ordered.
  for (let product of order.products) {
    const productDocument = await Product.findById(product.productId).exec();
    productDocument.quantity -= product.quantityToOrder;
    await productDocument.save();
  }
  await mongoose.connection.close();
  return result;
};

module.exports = {
  addUser, checkUser, addProduct, getUserProducts, getProduct, getUser, getProducts, saveCart,
  rateProduct, addOrder
};