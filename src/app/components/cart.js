import React from 'react';
import { connect } from 'react-redux';

const Cart = function (props) {
  const cart = props.State.cart;
  console.log(cart);

  return (
    <>
      Cart
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    State: state.reducer
  };
};

export default connect(mapStateToProps, null)(Cart);