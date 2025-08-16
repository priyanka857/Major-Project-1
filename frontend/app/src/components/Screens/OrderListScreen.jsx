import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { listOrders } from "../../action/orderAction";
import Loader from "../Loader";
import Message from "../Message";

function OrderListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, userInfo, navigate]);

  return (
    <>
      <h2>Orders</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  ₹
                  {order.totalPrice
                    ? Number(order.totalPrice).toFixed(2)
                    : "0.00"}
                </td>
                <td>
                  {order.isPaid ? (
                    new Date(order.paidAt).toLocaleDateString()
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered &&
                  order.deliveredAt &&
                  !isNaN(new Date(order.deliveredAt)) ? (
                    new Date(order.deliveredAt).toLocaleDateString()
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>

                <td>
                  <Button
                    variant="light"
                    className="btn-sm"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default OrderListScreen;
