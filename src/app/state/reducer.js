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
      const newStateAddToCart = { ...state, cart: [...state.cart] };
      // The payload is an object of product details.
      newStateAddToCart.cart.push(action.payload);
      return newStateAddToCart;
    case 'clear cart':
      const newStateClearCart = { ...state, cart: [...state.cart] };
      newStateClearCart.cart.splice(0, newStateClearCart.cart.length);
      return newStateClearCart;
    default:
      return state;
  }
};

export default reducer;