import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
const axios = require('axios');
const constants = require('../../../constants');

const Cart = function (props) {
  const userId = props.State.userId;
  const cart = props.State.cart;
  // This is a temporary state variable that is used to store the html elements for the products in
  // the cart.
  const [products, setProducts] = useState(props.State.products);
  // This calculates the total price of all the products in the cart.
  let totalPrice = 0;
  for (let product of cart) {
    totalPrice += product.totalPrice;
  }
  const navigate = useNavigate();

  // This moves the user to the checkout page after they review their cart.
  const checkout = function (event) {
    event.preventDefault();
    navigate('/checkout');
  };

  // This takes the current cart state and saves it in the user document in the database for the
  // logged in user.
  const saveCart = function (event) {
    event.preventDefault();
    const headers = { headers: { 'content-type': 'application/json' } };
    let data = JSON.stringify({ cart: cart });
    axios.post(constants.serverDomain + `/users/cart/${userId}`, data, headers)
      .then(() => {
        // The request was successful, and the cart was saved.
        navigate('/');
      })
      .catch(() => {
        alert('Sorry, an error occured.  Please try again.');
      });
  };

  useEffect(() => {
    // cart is an array of objects.  Each object contains details about the product.  The map
    // method iterates through the array to create the html element for the products.
    const rowElements = cart.map((product) => {
      return (
        <div className='row' key={product.productId}>
          <div className='col'>
            {product.productName}
          </div>
          <div className='col'>
            {product.orderQuantity}
          </div>
          <div className='col'>
            {product.totalPrice}
          </div>
        </div >
      );
    });
    // After the map method, rowElements is an array of div elements.  Each element is a row
    // for the container div.  This sets the products state to these rows.  After the state is
    // set, the rows will be displayed in the container.
    setProducts(rowElements);
  }, []);

  return (
    <>
      <h1 className='text-center text-primary fw-bold'>Cart</h1>
      <div className='container'>
        <div className='row'>
          <div className='col'>
            Product Name
          </div>
          <div className='col'>
            Quantity
          </div>
          <div className='col'>
            Price
          </div>
        </div>

        {products}

        <div className='row'>
          <div className='col'></div>
          <div className='col'>Total Price:</div>
          <div className='col'>
            {totalPrice}
          </div>
        </div>

        <div className='row mt-4 text-center'>
          <div className='col'>
            <button className='btn btn-primary' onClick={checkout}>Checkout</button>
          </div>
          <div className='col'>
            <button className='btn btn-primary' onClick={saveCart}>Save Cart</button>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    State: state.reducer
  };
};

export default connect(mapStateToProps, null)(Cart);