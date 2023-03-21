import React, { createRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearCart, addNotificationState, incrementNotificationsAmount } from '../state/actions';
const axios = require('axios');
const constants = require('../../../constants');

const Checkout = function (props) {
  const address = createRef();
  const card = createRef();
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
        </div >
      );
    });
    // After the map method, rowElements is an array of div elements.  Each element is a row
    // for the container div.  This sets the products state to these rows.  After the state is
    // set, the rows will be displayed in the container.
    setProducts(rowElements);
  }, []);

  // This handles the form data for creating a new order.  It sends a POST request to the server.
  // If the new order is not created an error message is shown.  Otherwise, if the order is
  // created it clears the state cart and navigates to the orders page.
  const createOrder = function (event) {
    event.preventDefault();
    // This prepares and then sends the request.
    let data = JSON.stringify({
      orderedBy: userId,
      products: cart,
      address: address.current.value,
      card: card.current.value,
    });
    const headers = { headers: { 'content-type': 'application/json' } };
    axios.post(constants.serverDomain + '/orders', data, headers)
      .then((result) => {
        // The request was successful, and the order was created.
        // This clears the state cart.
        props.clearCart();
        // This adds a notification about the order.
        props.addNotificationState({
          value: 'You successfully checked out',
          link: `/orders/${result.data._id.toString()}`,
        });
        props.incrementNotificationsAmount();
        navigate('/orders');
      })
      .catch(() => {
        alert('Sorry, an error occured.  Please try again.');
      });
  };

  return (
    <>
      <h1 className='text-center text-primary fw-bold'>Checkout</h1>

      <div className='container'>
        <div className='row'>
          <div className='col-5'>
            <form onSubmit={createOrder}>
              <div className='mb-3'>
                <label htmlFor='address' className='form-label'>Address</label>
                <input type='text' className='form-control' id='address' ref={address}></input>
              </div>
              <div className='mb-3'>
                <label htmlFor='card' className='form-label'>Card</label>
                <input type='text' className='form-control' id='card' ref={card}></input>
              </div>

              <div className='row'>
                <div className='col'>
                  Product Name
                </div>
                <div className='col'>
                  Quantity
                </div>
              </div>
              {products}

              <div className='row mt-3'>
                <div className='col fw-bold'>Total Price: {totalPrice}</div>
              </div>

              <button className='btn btn-primary mt-3'>Order</button>
            </form>
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

const mapDispatchToStore = (dispatch) => {
  return {
    clearCart: () => {
      dispatch(clearCart())
    },
    addNotificationState: (notification) => {
      dispatch(addNotificationState(notification))
    },
    incrementNotificationsAmount: () => {
      dispatch(incrementNotificationsAmount())
    },
  };
};

export default connect(mapStateToProps, mapDispatchToStore)(Checkout);