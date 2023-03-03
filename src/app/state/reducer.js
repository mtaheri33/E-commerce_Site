let initialState = {
  userId: null,
  username: null,
  cart: null,
};

const reducer = function (state = initialState, action) {
  switch (action.type) {
    // case 'addUser':
    //   return action.payload;
    default:
      return state;
  }
}

export default reducer;