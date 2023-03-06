import React from 'react';
import { NavLink } from 'react-router-dom';

const Home = function () {
  return (
    <>
      <div id='homeBreak'></div>
      <div className='container text-center'>
        <div className='row'>
          <div className='col'>
            <NavLink className='link-primary fw-bold text-decoration-none' to='/signUp'>Sign Up</NavLink>
          </div>
          <div className='col'>
            <NavLink className='link-primary fw-bold text-decoration-none' to='/signIn'>Sign In</NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;