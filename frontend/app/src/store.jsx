import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// Product reducers
import {
  productListReducers,
  productDetailsReducer,
  productCreateReducer,
  productDeleteReducer,
  productUpdateReducer,
} from "./reducers/productReducers";

// User reducers
import {
  userListReducer,
  userLoginReducers,
  userSignupReducers,
  userDeleteReducer,
  userDetailsReducer,
  userUpdateReducer,
  userUpdateProfileReducer,
} from "./reducers/usersReducers";

// Cart reducer
import { cartReducers } from "./reducers/cartReducers";

// Order reducers
import {
  orderCreateReducer,
  orderDeliverReducer,
  orderDetailsReducer,
  orderListMyReducer,
  orderListReducer,
} from "./reducers/orderReducers";

// Helper function to safely get data from localStorage
const getValidJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    if (!value || value === "undefined") return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Load from localStorage
const userInfoFromStorage = getValidJSON("userInfo", null);
const cartItemsFromStorage = getValidJSON("cartItems", []);
const shippingAddressFromStorage = getValidJSON("shippingAddress", {});
const paymentMethodFromStorage = getValidJSON("paymentMethod", "");

// Combine all reducers
const reducer = combineReducers({
  // Product
  productList: productListReducers,
  productDetails: productDetailsReducer,
  productCreate: productCreateReducer,
  productDelete: productDeleteReducer,
  productUpdate: productUpdateReducer,

  // User
  userLogin: userLoginReducers,
  userSignup: userSignupReducers,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userDetails: userDetailsReducer,
  userUpdate: userUpdateReducer,
  userUpdateProfile: userUpdateProfileReducer,

  // Cart
  cart: cartReducers,

  // Order
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderDeliver: orderDeliverReducer,
  orderList: orderListReducer,
  orderMyList:orderListMyReducer,
});

// Initial state
const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
  userLogin: {
    userInfo: userInfoFromStorage,
  },
};

// Middleware
const middleware = [thunk];

// Create store
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
