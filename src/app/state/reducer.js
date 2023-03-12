let initialState = {
  userId: null,
  username: null,
  cart: null,
};

const reducer = function (state = initialState, action) {
  switch (action.type) {
    case 'set state':
      // The payload is a user object with values for the user's id, username, and cart.  So, this
      // entire object can be used to update the state.
      return action.payload;
    case 'add to cart':
      const newState = { ...state, cart: { ...state.cart } };
      // The payload is an object with a property for productId: quantity to order.
      const productId = Object.keys(action.payload)[0];
      const quantityToOrder = action.payload[productId];
      newState.cart[productId] = quantityToOrder;
      return newState;
    default:
      return state;
  }
};

export default reducer;