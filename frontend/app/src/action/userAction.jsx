import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
} from "../constants/userConstants";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Login Action
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      `${API_BASE_URL}/api/users/login/`,
      { username: email, password },
      config
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
};

// Signup Action
export const signup =
  (firstname, lastname, email, password) => async (dispatch) => {
    try {
      dispatch({ type: USER_SIGNUP_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.post(
        `${API_BASE_URL}/api/users/register/`,
        {
          fname: firstname,
          lname: lastname,
          email,
          password,
        },
        config
      );

      dispatch({ type: USER_SIGNUP_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_SIGNUP_FAIL,
        payload: error.response?.data?.detail || error.message,
      });
      console.error("❌ Signup error: ", error.response?.data || error.message);
    }
  };

// Helper function to get auth config for protected routes
const getAuthConfig = (getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  // Use token or access depending on backend response
  const token = userInfo.token || userInfo.access;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// List Users (Admin only)
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    const config = getAuthConfig(getState);

    const { data } = await axios.get(`${API_BASE_URL}/api/users/getallusers/`, config);

    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// Delete User (Admin only)
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    const config = getAuthConfig(getState);

    await axios.delete(`${API_BASE_URL}/api/users/delete/${id}/`, config);

    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// Get User Profile (logged in user)
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const config = getAuthConfig(getState);

    const { data } = await axios.get(`${API_BASE_URL}/api/users/${id}/`, config);

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Update User (Admin only)
export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    const config = getAuthConfig(getState);

    const { data } = await axios.put(
      `${API_BASE_URL}/api/users/update/${user.id}/`,
      user,
      config
    );

    dispatch({ type: USER_UPDATE_SUCCESS });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// Update Own Profile (User Profile Screen)
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const config = getAuthConfig(getState);

    const { data } = await axios.put(
      `${API_BASE_URL}/api/users/profile/update/`,
      user,
      config
    );

    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data }); // update login state with profile changes
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};
