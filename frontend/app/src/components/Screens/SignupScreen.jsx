import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { signup } from "../../action/userAction";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Message";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";

function SignupScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userSignup = useSelector((state) => state.userSignup);
  const { loading, error, userInfo } = userSignup;

  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    termsAccepted: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [activationLink, setActivationLink] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.activation_link) {
      setSuccessMessage(userInfo.details);
      setActivationLink(userInfo.activation_link);

      setFormValues({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: "",
        termsAccepted: false,
      });

      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setActivationLink(null);
        navigate("/login");
      }, 30000); // ⏳ 30 seconds

      return () => clearTimeout(timer);
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    validateField(name, newValue);
  };

  const getValidationClass = (name) => {
    if (formValues[name] === "") return "";
    return formErrors[name] ? "is-invalid" : "is-valid";
  };

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case "firstname":
      case "lastname":
        if (!value.trim()) error = "This field is required.";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = "Invalid email format.";
        break;
      case "password":
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(value)) {
          error =
            "Password must be 8+ characters, include uppercase, lowercase, number & special character.";
        }
        break;
      case "confirmpassword":
        if (value !== formValues.password)
          error = "Passwords do not match.";
        break;
      case "termsAccepted":
        if (!value)
          error = "You must accept the terms and conditions.";
        break;
      default:
        break;
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const isFormValid = () => {
    return (
      Object.values(formErrors).every((error) => error === null) &&
      Object.entries(formValues).every(([key, value]) =>
        typeof value === "boolean" ? value === true : value.trim() !== ""
      )
    );
  };

  const togglePassword = (field) => {
    if (field === "password") {
      setShowPassword(true);
      setTimeout(() => setShowPassword(false), 1000);
    } else {
      setShowConfirmPassword(true);
      setTimeout(() => setShowConfirmPassword(false), 1000);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      dispatch(
        signup(
          formValues.firstname,
          formValues.lastname,
          formValues.email,
          formValues.password
        )
      );
    }
  };

  return (
    <Container>
      <Row>
        <Col md={3}></Col>
        <Col md={6}>
          <Form onSubmit={submitHandler} autoComplete="off">
            <h3 className="text-center mt-4">Signup Here</h3>

            {successMessage && <Message variant="success">{successMessage}</Message>}
            {activationLink && (
              <div className="alert alert-info mt-2 text-break">
                <strong>Activation Link:</strong><br />
                <a href={activationLink} target="_blank" rel="noreferrer">
                  {activationLink}
                </a>
              </div>
            )}
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}

            <Form.Group className="mt-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your first name"
                name="firstname"
                value={formValues.firstname}
                onChange={handleChange}
                isInvalid={!!formErrors.firstname}
                className={getValidationClass("firstname")}
                autoComplete="given-name"
              />
              <Form.Control.Feedback type="invalid">{formErrors.firstname}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your last name"
                name="lastname"
                value={formValues.lastname}
                onChange={handleChange}
                isInvalid={!!formErrors.lastname}
                className={getValidationClass("lastname")}
                autoComplete="family-name"
              />
              <Form.Control.Feedback type="invalid">{formErrors.lastname}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                isInvalid={!!formErrors.email}
                className={getValidationClass("email")}
                autoComplete="email"
              />
              <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  isInvalid={!!formErrors.password}
                  className={getValidationClass("password")}
                  autoComplete="new-password"
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => togglePassword("password")}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </Button>
              </div>

              {/* Show format rules dynamically when typing */}
              {formValues.password && (
                <Form.Text className="text-muted">
                  Must be 8+ characters with uppercase, lowercase, number & symbol.
                </Form.Text>
              )}

              <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  name="confirmpassword"
                  value={formValues.confirmpassword}
                  onChange={handleChange}
                  isInvalid={!!formErrors.confirmpassword}
                  className={getValidationClass("confirmpassword")}
                  autoComplete="new-password"
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => togglePassword("confirmpassword")}
                >
                  <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                {formErrors.confirmpassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mt-4">
              <Form.Check
                type="checkbox"
                name="termsAccepted"
                label="I agree to the terms and conditions"
                checked={formValues.termsAccepted}
                onChange={handleChange}
                isInvalid={!!formErrors.termsAccepted}
                feedback={formErrors.termsAccepted}
                className={getValidationClass("termsAccepted")}
              />
            </Form.Group>

            <Button
              type="submit"
              className="mt-4 w-100"
              variant="success"
              disabled={!isFormValid()}
            >
              Register
            </Button>

            <div className="text-center mt-3">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                style={{ color: "#0d6efd", cursor: "pointer", textDecoration: "underline" }}
              >
                Login here
              </span>
            </div>
          </Form>
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  );
}

export default SignupScreen;
