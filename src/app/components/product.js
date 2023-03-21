import React, { createRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { addToCartState, addNotificationState, incrementNotificationsAmount } from '../state/actions';
const axios = require('axios');
const constants = require('../../../constants');

const Product = function (props) {
  const params = useParams();
  let productId = params['productId'];
  const userId = props.State.userId;
  // This is a temporary state variable that is used to store the html elements for the product and
  // an object to store the data on the product.
  const [product, setProduct] = useState(props.State.product);
  let productData;
  const quantityToOrder = createRef();
  const rating = createRef();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(constants.serverDomain + `/products/${productId}`)
      .then((result) => {
        // This calculates the average rating of the product.
        const ratings = [];
        for (let key of Object.keys(result.data.ratings)) {
          ratings.push(result.data.ratings[key]);
        }
        let avgRatings;
        if (ratings.length === 0) {
          avgRatings = 'N/A';
        } else {
          const sumRatings = ratings.reduce((cumulativeSum, currentElement) => {
            return cumulativeSum + currentElement;
          });
          avgRatings = (sumRatings / ratings.length).toFixed(1);
        }
        // This stores data in the product data object.
        productData = {
          name: result.data.name,
          price: result.data.price,
          quantity: result.data.quantity,
          description: result.data.description,
          rating: avgRatings,
        };
        // This sends another request to the server to get the username of the user id that created
        // the product.
        return axios.get(constants.serverDomain + `/users/${result.data.createdBy}`);
      })
      .then((result) => {
        const elements = (
          <div>
            <h1 className='text-center text-primary fw-bold'>{productData.name}</h1>
            <div className='container'>
              <div className='row'>
                <div className='col'>
                  Price: {productData.price}
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  Quantity Available: {productData.quantity}
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  Description: {productData.description}
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  Sold by: {result.data.username}
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  Rating: {productData.rating}
                </div>
              </div>
            </div>
          </div>
        );
        setProduct(elements);
      })
      .catch(() => { });
  }, []);

  // This handles the form on a product page to add a specified quantity to the cart.  It passes
  // the product id and quantity to order to the reducer to update the cart in the state.
  const addToCart = function (event) {
    event.preventDefault();
    // This finds the unit price of the product in order to calculate the total price.  It then
    // creates the cart object to add to the cart state.
    axios.get(constants.serverDomain + `/products/${productId}`)
      .then((result) => {
        const productDetails = {
          productId: productId,
          productName: result.data.name,
          orderQuantity: Number(quantityToOrder.current.value),
          totalPrice: Number(quantityToOrder.current.value) * result.data.price,
        };
        props.addToCartState(productDetails);
        props.addNotificationState({
          value: `You added ${result.data.name} to your cart`,
          link: '/cart',
        });
        props.incrementNotificationsAmount();
        navigate('/cart');
      })
      .catch(() => { });
  };

  // This handles the form to rate a product.  It uses the product id, user id, and rating selected
  // in a GET request to the server.  The product and rating will be stored under the user, and the
  // user and rating will be stored under the product.
  const rateProduct = function (event) {
    event.preventDefault();
    axios.get(
      constants.serverDomain + `/products/${productId}/${userId}/${rating.current.value}`
    )
      .catch(() => { });
  };

  return (
    <>
      {product}

      <div className='container'>
        <div className='row'>
          <div className='col-5'>
            <form onSubmit={addToCart}>
              <div className='mb-3'>
                <label htmlFor='quantityToOrder' className='form-label'>Quantity to Order:</label>
                <input type='number' className='form-control' id='quantityToOrder' ref={quantityToOrder}></input>
              </div>
              <button className='btn btn-primary'>Add to Cart</button>
            </form>
          </div>
        </div>
      </div>

      <div className='container mt-4'>
        <div className='row'>
          <div className='col-5'>
            <form onSubmit={rateProduct}>
              <div className='mb-3'>
                <label htmlFor='ratingDropdown'>Rate Product:</label>
                <select className='form-select' id='ratingDropdown' ref={rating}>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>
                  <option value='5'>5</option>
                </select>
              </div>
              <button className='btn btn-primary'>Rate</button>
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
    addToCartState: (product) => {
      dispatch(addToCartState(product))
    },
    addNotificationState: (notification) => {
      dispatch(addNotificationState(notification))
    },
    incrementNotificationsAmount: () => {
      dispatch(incrementNotificationsAmount())
    },
  };
};

export default connect(mapStateToProps, mapDispatchToStore)(Product);