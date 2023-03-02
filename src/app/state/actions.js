const axios = require('axios');
const constants = require('../../../constants');

// This function sends a user to the reducer to update the state.
const addUserState = (user) => {
  return {
    type: 'addUser',
    payload: user,
  };
};

// This function is used to send a POST request to the server to create a new user.  
export const addUser = (user) => {
  return (dispatch) => {
    // This prepares and then sends the request.
    let data = JSON.stringify(user);
    const headers = { headers: { 'content-type': 'application/json' } };
    axios.post(constants.serverDomain + '/users', data, headers)
      .then((result) => {
        // The request was successful.  The object sent back by the server is used in the reducer
        // to update the state.
        dispatch(addUserState({
          userId: result.data.userId,
          username: result.data.username,
          cart: {},
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };
};