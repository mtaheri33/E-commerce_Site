import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setState, resetNotificationsAmount } from '../state/actions';

const Header = function (props) {
  const username = props.State.username;
  const notificationsAmount = props.State.notificationsAmount;
  const navigate = useNavigate();

  // This sets all of the states to null when a user signs out.
  const signOut = function (event) {
    event.preventDefault();
    props.setState({
      userId: null,
      username: null,
      cart: null,
      notifications: null,
      notificationsAmount: null,
    });
    navigate('/');
  };

  // This redirects the user to the notifications page and resets the notifications amount.
  const navToNotifications = function (event) {
    event.preventDefault();
    props.resetNotificationsAmount();
    navigate('/notifications');
  };

  return (
    <header>
      <nav className='navbar navbar-expand-lg fixed-top bg-primary' data-bs-theme='dark'>
        <div className='container-fluid'>
          <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNavAltMarkup' aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
            <div className='navbar-nav'>
              <NavLink className='nav-link text-light fw-bold' to='/'>Home</NavLink>
              <NavLink className='nav-link text-light fw-bold' to='/marketplace'>Marketplace</NavLink>
              <NavLink className='nav-link text-light fw-bold' to='/cart'>Cart</NavLink>
              <NavLink className='nav-link text-light fw-bold' to='/orders'>Orders</NavLink>
              <NavLink className='nav-link text-light fw-bold' to='/products'>Products</NavLink>
            </div>
            <div className='ms-auto'>
              <span className='text-light me-3'>{username}</span>
              <button type='button' className='btn btn-light me-3' onClick={navToNotifications}>
                Notifications <span className='badge text-bg-primary'>{notificationsAmount}</span>
              </button>
              <button type='button' className='btn btn-light' onClick={signOut}>Sign out</button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const mapDispatchToStore = (dispatch) => {
  return {
    setState: (user) => {
      dispatch(setState(user))
    },
    resetNotificationsAmount: () => {
      dispatch(resetNotificationsAmount())
    },
  };
};

const mapStateToProps = (state) => {
  return {
    State: state.reducer
  }
}

export default connect(mapStateToProps, mapDispatchToStore)(Header);