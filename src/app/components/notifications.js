import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

const Notifications = function (props) {
  const notifications = props.State.notifications;
  // This is a temporary state variable that is used to store the notifications for a user.
  const [notificationElements, setNotificationElements] = useState(props.State.notificationElements);

  // This creates the html div elements for each of the notifications and then sets the state to
  // these row elements.
  useEffect(() => {
    if (notifications) {
      const rowElements = notifications.map((notification) => {
        return (
          <div className='row' key={notification.value}>
            <div className='col'>
              <NavLink to={notification.link}>{notification.value}</NavLink>
            </div>
          </div >
        );
      });
      setNotificationElements(rowElements);
    }
  }, []);

  return (
    <>
      <h1 className='text-center text-primary fw-bold'>Notifications</h1>

      <div className='container'>
        {notificationElements}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    State: state.reducer
  };
};

export default connect(mapStateToProps, null)(Notifications);