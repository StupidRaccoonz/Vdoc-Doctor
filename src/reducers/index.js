import { combineReducers } from 'redux';
import CurrentAddressReducer from './CurrentAddressReducer.js';

const allReducers = combineReducers({
  current_location:CurrentAddressReducer,
  
});

export default allReducers;