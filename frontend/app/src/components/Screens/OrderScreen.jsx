import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { getOrderDetails } from '../../action/orderAction';
import Loader from '../Loader';
import Message from '../Message';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(true);

  const handleClose = () => {
    setShowError(false);
  };

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(getOrderDetails(orderId));
      setShowError(true); // Reset error visibility when navigating
    }
  }, [dispatch, orderId, userInfo, navigate]);

  const formatPrice = (num) => (typeof num === 'number' ? num.toFixed(2) : '0.00');

  if (!order) return null;

  const itemsPrice = order.orderItems
    ? order.orderItems.reduce(
        (acc, item) => acc + Number(item.price || 0) * (item.qty || 0),
        0
      )
    : 0;

  const shippingPrice = typeof order.shippingPrice === 'number' ? order.shippingPrice : 0;
  const taxPrice = typeof order.taxPrice === 'number' ? order.taxPrice : 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return loading ? (
    <Loader />
  ) : error && showError ? (
    <Message variant="danger" onClose={handleClose}>
      {error}
    </Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong> {order.user?.name}
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a>
              </p>
              <p>
                <strong>Address:</strong>{' '}
                {order.shippingAddress?.address}, {order.shippingAddress?.city}{' '}
                {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">Delivered on {order.deliveredAt}</Message>
              ) : (
                <Message variant="danger"onClose={handleClose} dismissible>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger"onClose={handleClose} dismissible>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => {
                    const price = Number(item.price) || 0;
                    const total = price * (item.qty || 0);
                    return (
                      <ListGroup.Item key={index}>
                        <Row className="align-items-center">
                          <Col md={2}>
                            <Image src={item.image} alt={item.name} fluid rounded />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x ₹{formatPrice(price)} = ₹{formatPrice(total)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{formatPrice(itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{formatPrice(shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{formatPrice(taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{formatPrice(totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
