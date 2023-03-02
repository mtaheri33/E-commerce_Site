import React from 'react';
import { connect } from 'react-redux';

const Header = function (props) {
  const username = props.state.username;
  return (
    <header>
      <nav className='navbar navbar-expand-lg fixed-top bg-primary' data-bs-theme='dark'>
        <div className='container-fluid'>
          <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNavAltMarkup' aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
            <div className='navbar-nav'>
              <a className='nav-link text-light fw-bold' href='/'>Home</a>
              <a className='nav-link text-light fw-bold' href='/marketplace'>Marketplace</a>
              <a className='nav-link text-light fw-bold' href='/cart'>Cart</a>
              <a className='nav-link text-light fw-bold' href='/orders'>Orders</a>
              <a className='nav-link text-light fw-bold' href='/products'>Products</a>
              <a className='nav-link text-light fw-bold' href='/ratings'>Ratings</a>
            </div>
            <div className='ms-auto'>
              <span className='text-light pe-3'>{username}</span>
              <button type='button' className='btn btn-light'>Sign out</button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const mapStateToProps = (state) => {
  return {
    state: state.reducer
  }
}

export default connect(mapStateToProps, null)(Header);