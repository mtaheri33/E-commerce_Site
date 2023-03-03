import React, { createRef } from 'react';
import { useNavigate } from 'react-router-dom';
const axios = require('axios');
const constants = require('../../../constants');

const SignUp = function () {
  const username = createRef();
  const password = createRef();
  const navigate = useNavigate();

  // This handles the form data for creating a new user.  It sends a POST request to the server.
  // The server side validation checks if the username already exists in the database.  If so, the
  // new user is not created and an error message is shown.  Otherwise, if the user is created it
  // navigates to the sign in page.
  const createUser = function (event) {
    event.preventDefault();
    // This prepares and then sends the request.
    let data = JSON.stringify({
      username: username.current.value,
      password: password.current.value,
    });
    const headers = { headers: { 'content-type': 'application/json' } };
    axios.post(constants.serverDomain + '/users', data, headers)
      .then(() => {
        // The request was successful, and the user was created.
        navigate('/signIn');
      })
      .catch((error) => {
        if (error.response.data === 'username already exists') {
          alert('Sorry, the username already exists.  Please try a different one.');
        } else {
          alert('Sorry, an error occured.  Please try again.');
        }
      });
  };

  return (
    <>
      <h1 className='text-center text-primary fw-bold'>Sign Up</h1>
      <div className='container'>
        <div className='row'>
          <div className='col'></div>
          <div className='col-5'>
            <form onSubmit={createUser}>
              <div className='mb-3'>
                <label htmlFor='signUpUsername' className='form-label'>Username</label>
                <input type='text' className='form-control' id='signUpUsername' ref={username}></input>
              </div>
              <div className='mb-3'>
                <label htmlFor='signUpPassword' className='form-label'>Password</label>
                <input type='text' className='form-control' id='signUpPassword' ref={password}></input>
              </div>
              <button className='btn btn-primary'>Submit</button>
            </form>
          </div>
          <div className='col'></div>
        </div>
      </div>
    </>
  );
};

export default SignUp;