// This takes in a user object with properties for the user's id, username, and cart.  It uses this
// object to set the state.
export const setState = (user) => {
  return (dispatch) => {
    dispatch({
      type: 'set state',
      payload: user
    });
  };
};

// This takes in an object with a property for productId: quantity to order.  It adds this to
// the cart state.
export const addToCartState = (product) => {
  return (dispatch) => {
    dispatch({
      type: 'add to cart',
      payload: product
    });
  };
};