// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { Container } from "react-bootstrap";
import Home from "./components/Home";
import Footer from "./components/Footer";
import SignupScreen from "./components/Screens/SignupScreen";
import LoginScreen from "./components/Screens/LoginScreen";
import ProductDetails from "./components/Screens/ProductDetails";
import CartScreen from "./components/Screens/CartScreen";
import ShippingScreen from "./components/Screens/ShippingScreen";
import PlaceOrderScreen from "./components/Screens/PlaceOrderScreen";
import PaymentScreen from "./components/Screens/PaymentScreen";
import OrderScreen from "./components/Screens/OrderScreen";
import ProductListScreen from "./components/Screens/ProductListScreen";
import ProductEditScreen from "./components/Screens/ProductEditScreen";
import OrderListScreen from "./components/Screens/OrderListScreen";
import UserListScreen from "./components/Screens/UserListScreen";
import UserEditScreen from "./components/Screens/UserEditScreen";
import ProfileScreen from "./components/Screens/ProfileScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/cart/:id" element={<CartScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/checkout" element={<ShippingScreen />} />
             <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/admin/productList" element={<ProductListScreen />} />
            <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
            <Route path="/admin/orderlist" element={<OrderListScreen />} />
            <Route path="/admin/userList" element={<UserListScreen/>} />
            <Route path="/admin/user/:id/edit" element={<UserEditScreen/>} />

            <Route path="/profile" element={<ProfileScreen />} />





          </Routes>
        </Container>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
