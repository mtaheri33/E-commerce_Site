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

// This clears the cart state.
export const clearCart = () => {
  return (dispatch) => {
    dispatch({
      type: 'clear cart'
    });
  };
};

// This takes in an object with properties and link.  It adds this to
// the notifications state.
export const addNotificationState = (notification) => {
  return (dispatch) => {
    dispatch({
      type: 'add notification',
      payload: notification
    });
  };
};

// This increments the notifications amount.
export const incrementNotificationsAmount = () => {
  return (dispatch) => {
    dispatch({
      type: 'increment notifications amount'
    });
  };
};

// This resets the notifications amount.
export const resetNotificationsAmount = () => {
  return (dispatch) => {
    dispatch({
      type: 'reset notifications amount'
    });
  };
};