import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../FormContainer';
import CheckoutSteps from '../CheckoutSteps';
import { savePaymentMethod } from '../../action/cartAction';
import { createOrder } from '../../action/orderAction';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, } = orderCreate;

  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }

    if (success && order) {
      navigate(`/order/${order.id}`);
    }
  }, [navigate, shippingAddress, success, order]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));

    const orderData = {
      orderItems: cartItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
      shippingPrice: 100,
      taxPrice: 0,
      totalPrice:
        cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) + 100,
    };

    dispatch(createOrder(orderData));
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Check
            type="radio"
            label="Cash On Delivery"
            id="cod"
            name="paymentMethod"
            value="Cash On Delivery"
            checked={paymentMethod === 'Cash On Delivery'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
          <Form.Check
            type="radio"
            label="UPI"
            id="upi"
            name="paymentMethod"
            value="UPI"
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
          <Form.Check
            type="radio"
            label="Credit Card"
            id="card"
            name="paymentMethod"
            value="Credit Card"
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
