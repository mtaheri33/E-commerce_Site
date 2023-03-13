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
      const newState = { ...state, cart: [...state.cart] };
      // The payload is an object of product details.
      newState.cart.push(action.payload);
      return newState;
    default:
      return state;
  }
};

export default reducer;