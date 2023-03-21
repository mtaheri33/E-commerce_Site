import React, { createRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setState } from '../state/actions';
const axios = require('axios');
const constants = require('../../../constants');

const SignIn = function (props) {
  const username = createRef();
  const password = createRef();
  const navigate = useNavigate();

  // This handles the form data for a user to sign in.  It sends a POST request to the server.
  // The server side validation checks if the password is correct for the username.  If so, the
  // user becomes logged in and the state is updated.  Then, it navigates to the marketplace page.
  // Otherwise, an error message is displayed.
  const signIn = function (event) {
    event.preventDefault();
    // This prepares and then sends the request.
    let data = JSON.stringify({
      username: username.current.value,
      password: password.current.value,
    });
    const headers = { headers: { 'content-type': 'application/json' } };
    axios.post(constants.serverDomain + '/users/signIn', data, headers)
      .then((result) => {
        // The request was successful, and the user object from the database is sent back.  It is
        // used to set the state.
        props.setState({
          userId: result.data._id.toString(),
          username: result.data.username,
          cart: result.data.cart,
          notifications: [
            { value: 'Visit the marketplace and browse products', link: '/marketplace' },
          ],
          notificationsAmount: 1,
        });
        navigate('/marketplace');
      })
      .catch((error) => {
        if (error.response.status === 403) {
          // The username provided does not exist, or the password for a user's account is not
          // correct.
          alert('Sorry, the username or password is incorrect.');
        }
        else {
          alert('Sorry, an error occured.  Please try again.');
        }
      });
  };

  return (
    <>
      <h1 className='text-center text-primary fw-bold'>Sign In</h1>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-5'>
            <form onSubmit={signIn}>
              <div className='mb-3'>
                <label htmlFor='signInUsername' className='form-label'>Username</label>
                <input type='text' className='form-control' id='signInUsername' ref={username}></input>
              </div>
              <div className='mb-3'>
                <label htmlFor='signInPassword' className='form-label'>Password</label>
                <input type='password' className='form-control' id='signInPassword' ref={password}></input>
              </div>
              <button className='btn btn-primary'>Sign in</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToStore = (dispatch) => {
  return {
    setState: (user) => {
      dispatch(setState(user))
    }
  };
};

export default connect(null, mapDispatchToStore)(SignIn);