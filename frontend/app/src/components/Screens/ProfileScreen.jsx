import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserDetails, updateUserProfile } from "../../action/userAction";
import Loader from "../Loader";
import Message from "../Message";
import { USER_UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import { listMyOrders } from "../../action/orderAction";

function ProfileScreen() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMyList = useSelector((state) => state.orderMyList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMyList;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (
        !user ||
        !user.fname ||
        !user.lname ||
        success ||
        userInfo._id !== user._id
      ) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        if (userInfo._id) {
          dispatch(getUserDetails(userInfo._id));
        }
      } else {
        setFname(user.fname);
        setLname(user.lname);
      }
    }
    dispatch(listMyOrders());
  }, [dispatch, userInfo, success, navigate]);

  useEffect(() => {
    if (success) {
      setMessage("Profile Updated Successfully");
      const timer = setTimeout(() => {
        setMessage("");
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          fname,
          lname,
          password,
        })
      );
      setMessage("");
    }
  };

  const handleClose = () => setMessage("");

  return (
    <Row>
      <Col md={6}>
        <h2>User Profile</h2>
        {message && (
          <Message
            variant={
              message === "Profile Updated Successfully" ? "success" : "danger"
            }
            onClose={handleClose}
          >
            {message}
          </Message>
        )}
        {error && (
          <Message variant="danger" onClose={handleClose}>
            {error}
          </Message>
        )}
        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="fname" className="my-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter First name"
              value={fname}
              autoComplete="first-name"
              onChange={(e) => setFname(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="lname" className="my-2">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Last name"
              value={lname}
              autoComplete="last-name"
              onChange={(e) => setLname(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="my-2">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="my-2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              autoComplete="new-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="my-3">
            Update
          </Button>
        </Form>
      </Col>

      <Col md={6}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger" onClose={handleClose}>
            {errorOrders}
          </Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id || index}>
                  <td>{order.id}</td>
                  <td>{order.createdAt?.substring(0, 10) || "N/A"}</td>
                  <td>Rs {Number(order.totalPrice).toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt?.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>

                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt?.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>

                  <td>
                    <Button
                      variant="dark"
                      className="btn-sm"
                      onClick={() => {
                        navigate(`/order/${order._id || order.id}`);
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default ProfileScreen;
