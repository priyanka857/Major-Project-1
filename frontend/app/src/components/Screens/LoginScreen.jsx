import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../action/userAction";
import Loader from "../Loader";
import Message from "../Message";

function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Automatically hide password after 1 second
  useEffect(() => {
    let timer;
    if (showPassword) {
      timer = setTimeout(() => {
        setShowPassword(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showPassword]);

  useEffect(() => {
    if (submitted && userInfo) {
      setSuccessMessage("Login successful!");
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        navigate(redirect);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [userInfo, submitted, navigate, redirect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Invalid email format.";
    }
    if (name === "password" && value.length < 6) {
      error = "Password must be at least 6 characters.";
    }
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isFormValid =
    Object.values(formErrors).every((err) => err === "") &&
    Object.values(formValues).every((val) => val.trim() !== "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setSubmitted(true);
      dispatch(login(formValues.email, formValues.password));
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form className="mt-4" onSubmit={submitHandler}>
            <h3 className="text-center mb-4">Login Here</h3>

            {error && submitted && <Message variant="danger">{error}</Message>}
            {successMessage && <Message variant="success">{successMessage}</Message>}
            {loading && <Loader />}

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your Email"
                value={formValues.email}
                onChange={handleChange}
                isInvalid={!!formErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your Password"
                  value={formValues.password}
                  onChange={handleChange}
                  isInvalid={!!formErrors.password}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(true)}
                  type="button"
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </Button>
                <Form.Control.Feedback type="invalid">
                  {formErrors.password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              className="mt-4 w-100"
              variant="success"
              disabled={!isFormValid}
            >
              Login
            </Button>

            {/* 👇 New User Link */}
            <div className="text-center mt-3">
              New user?{" "}
              <span
                onClick={() => navigate("/signup")}
                style={{ color: "#0d6efd", cursor: "pointer", textDecoration: "underline" }}
              >
                Register here
              </span>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginScreen;
