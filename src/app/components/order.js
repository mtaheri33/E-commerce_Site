import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { addToCartState } from '../state/actions';
const axios = require('axios');
const constants = require('../../../constants');

const Order = function (props) {
  const params = useParams();
  let orderId = params['orderId'];
  // This is a temporary state variable that is used to store the html elements for the order.
  const [order, setOrder] = useState(props.State.order);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(constants.serverDomain + `/orders/${orderId}`)
      .then((result) => {
        let totalPrice = 0;
        // products is an array of objects.  Each object contains details about the product.  The map
        // method iterates through the array to create the html element for the products and
        // calculate the total price.
        const cartElements = result.data.products.map((product) => {
          totalPrice += product.totalPrice;
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
        const elements = (
          <div className='container'>
            <div className='row'>
              <div className='col'>
                Address: {result.data.address}
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                Card: {result.data.card}
              </div>
            </div>

            <div className='row mt-4'>
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
            {cartElements}

            <div className='row'>
              <div className='col'></div>
              <div className='col'>Total Price:</div>
              <div className='col'>
                {totalPrice}
              </div>
            </div>
          </div>
        );
        setOrder(elements);
      })
      .catch(() => { });
  }, []);

  // This adds the products from the order to the cart.
  const reorder = function (event) {
    event.preventDefault();
    axios.get(constants.serverDomain + `/orders/${orderId}`)
      .then((result) => {
        for (let product of result.data.products) {
          props.addToCartState(product);
        }
        navigate('/cart');
      })
      .catch(() => { });
  };

  return (
    <>
      <h1 className='text-center text-primary fw-bold'>Order Details</h1>

      {order}

      <div className='container mt-4'>
        <div className='row'>
          <div className='col'>
            <button className='btn btn-primary' onClick={reorder}>Reorder</button>
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
    addToCartState: (order) => {
      dispatch(addToCartState(order))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToStore)(Order);