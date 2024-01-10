import {combineReducers} from 'redux';
import productReducers from './productReducers';
import notificationsReducers from './notificationsReducers';

export default combineReducers({
    products: productReducers,
    notifications:notificationsReducers
})