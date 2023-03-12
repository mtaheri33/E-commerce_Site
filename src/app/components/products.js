import React, { createRef, useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
const axios = require('axios');
const constants = require('../../../constants');

const Products = function (props) {
  const name = createRef();
  const price = createRef();
  const quantity = createRef();
  const description = createRef();
  const userId = props.State.userId;
  // This is a temporary state variable that is used to store the products of a user.
  const [products, setProducts] = useState(props.State.products);
  const navigate = useNavigate();

  // This gets all of the products for a user from the database.  It creates the html div elements
  // for each of the products and then sets the state to these row elements.
  useEffect(() => {
    axios.get(constants.serverDomain + `/users/products?userId=${userId}`)
      .then((result) => {
        // result.data is an array of objects.  Each object is a product document.  The map method
        // iterates through the array to create the html element for the product.
        const rowElements = result.data.map((product) => {
          const link = '/products/' + product._id.toString();
          return (
            <div className='row' key={product._id.toString()}>
              <div className='col'>
                <NavLink to={link}>{product.name}</NavLink>
              </div>
            </div >
          );
        });
        // After the map method, rowElements is an array of div elements.  Each element is a row
        // for the container div.  This sets the products state to these rows.  After the state is
        // set, the rows will be displayed in the container.
        setProducts(rowElements);
      })
      .catch(() => { });
  }, []);

  // This handles the form data for creating a new product.  It sends a POST request to the server.
  // If the new product is not created an error message is shown.  Otherwise, if the product is
  // created it navigates to the current page, products, in order to display the new item.
  const createProduct = function (event) {
    event.preventDefault();
    // This prepares and then sends the request.
    let data = JSON.stringify({
      name: name.current.value,
      price: Number(price.current.value),
      quantity: Number(quantity.current.value),
      description: description.current.value,
      createdBy: userId,
    });
    const headers = { headers: { 'content-type': 'application/json' } };
    axios.post(constants.serverDomain + '/products', data, headers)
      .then(() => {
        // The request was successful, and the product was created.
        navigate('/products');
      })
      .catch(() => {
        alert('Sorry, an error occured.  Please try again.');
      });
  };

  return (
    <>
      <h1 className='text-center text-primary fw-bold'>Products</h1>
      <div className='container'>
        <h2 className='text text-primary fw-bold'>Your Products</h2>
        {products}
      </div>

      <div className='container mt-4'>
        <div className='row'>
          <h2 className='text text-primary fw-bold'>Add Product</h2>
        </div>
        <div className='row'>
          <div className='col-5'>
            <form onSubmit={createProduct}>
              <div className='mb-3'>
                <label htmlFor='addProductName' className='form-label'>Name</label>
                <input type='text' className='form-control' id='addProductName' ref={name}></input>
              </div>
              <div className='mb-3'>
                <label htmlFor='addProductPrice' className='form-label'>Price</label>
                <input type='text' className='form-control' id='addProductPrice' ref={price}></input>
              </div>
              <div className='mb-3'>
                <label htmlFor='addProductQuantity' className='form-label'>Quantity</label>
                <input type='text' className='form-control' id='addProductQuantity' ref={quantity}></input>
              </div>
              <div className='mb-3'>
                <label htmlFor='addProductDescription' className='form-label'>Description</label>
                <input type='text' className='form-control' id='addProductDescription' ref={description}></input>
              </div>
              <button className='btn btn-primary'>Submit</button>
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

export default connect(mapStateToProps, null)(Products);