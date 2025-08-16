import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../Message";
import Loader from "../Loader";
import { getUserDetails, updateUser } from "../../action/userAction";
import { USER_UPDATE_RESET } from "../../constants/userConstants";

function UserEditScreen() {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Added for success popup

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      setSuccessMessage("User updated successfully ✅"); // ✅ Set success message

      setTimeout(() => {
        dispatch({ type: USER_UPDATE_RESET });
        navigate("/admin/userlist"); // ✅ Navigate after short delay
      }, 2000);
    } else {
      if (!user.name || user.id !== Number(userId)) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, userId, successUpdate, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id: userId, name, email, isAdmin }));
  };

  return (
    <>
      <Button className="btn btn-light my-3" onClick={() => navigate("/admin/userlist")}>
        Go Back
      </Button>
      <h2>Edit User</h2>

      {/* ✅ Show Success Message */}
      {successMessage && <Message variant="success">{successMessage}</Message>}

      {/* ✅ Error or Loading UI */}
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler} style={{ maxWidth: "600px" }}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="isadmin" className="my-3">
            <Form.Check
              type="checkbox"
              label="Is Admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            ></Form.Check>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-3">
            Update
          </Button>
        </Form>
      )}
    </>
  );
}

export default UserEditScreen;
