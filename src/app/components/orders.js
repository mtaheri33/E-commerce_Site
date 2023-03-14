import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
const axios = require('axios');
const constants = require('../../../constants');

const Orders = function (props) {
  const userId = props.State.userId;
  // This is a temporary state variable that is used to store the orders of a user.
  const [orders, setOrders] = useState(props.State.orders);

  // This gets all of the orders for a user from the database.  It creates the html div elements
  // for each of the orders and then sets the state to these row elements.
  useEffect(() => {
    axios.get(constants.serverDomain + `/users/orders?userId=${userId}`)
      .then((result) => {
        // result.data is an array of objects.  Each object is an order document.  The map method
        // iterates through the array to create the html element for the order.
        const rowElements = result.data.map((order) => {
          const link = '/orders/' + order._id.toString();
          return (
            <div className='row' key={order._id.toString()}>
              <div className='col'>
                <NavLink to={link}>{order._id.toString()}</NavLink>
              </div>
            </div >
          );
        });
        // After the map method, rowElements is an array of div elements.  Each element is a row
        // for the container div.  This sets the products state to these rows.  After the state is
        // set, the rows will be displayed in the container.
        setOrders(rowElements);
      })
      .catch(() => { });
  }, []);

  return (
    <>
      <h1 className='text-center text-primary fw-bold'>Orders</h1>

      <div className='container'>
        {orders}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    State: state.reducer
  };
};

export default connect(mapStateToProps, null)(Orders);