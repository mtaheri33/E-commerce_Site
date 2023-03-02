import { combineReducers, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import reducer from './reducer';

const logger = () => (next) => (action) => {
  next(action);
};

const rootReducer = combineReducers({
  reducer,
});

export default configureStore(
  { reducer: rootReducer },
  {},
  applyMiddleware(logger, thunk)
);