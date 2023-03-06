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