import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
const axios = require('axios');
const constants = require('../../../constants');

const Marketplace = function (props) {
  // This is a temporary state variable that is used to store all of the products.
  const [products, setProducts] = useState(props.State.products);

  // This gets all of the products from the database.  It creates the html div elements
  // for each of the products and then sets the state to these row elements.
  useEffect(() => {
    axios.get(constants.serverDomain + '/products')
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

  return (
    <>
      <h1 className='text-center text-primary fw-bold'>Marketplace</h1>
      <div className='container'>
        {products}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    State: state.reducer
  };
};

export default connect(mapStateToProps, null)(Marketplace);