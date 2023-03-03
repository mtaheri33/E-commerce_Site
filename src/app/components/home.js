import React from 'react';

const Home = function () {
  return (
    <>
      <div id='homeBreak'></div>
      <div className='container text-center'>
        <div className='row'>
          <div className='col'>
            <a href='/signUp' className='link-primary fw-bold text-decoration-none'>Sign Up</a>
          </div>
          <div className='col'>
            <a href='/signIn' className='link-primary fw-bold text-decoration-none'>Sign In</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;