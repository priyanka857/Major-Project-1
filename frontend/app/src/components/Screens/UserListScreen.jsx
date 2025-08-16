import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { listUsers, deleteUser } from "../../action/userAction";
import Loader from "../Loader";
import Message from "../Message";

function UserListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate("/login");
    }
  }, [dispatch, userInfo, navigate, successDelete]);

  useEffect(() => {
    if (successDelete) {
      setDeleteSuccessMsg("User deleted successfully ✅");
      setTimeout(() => {
        setDeleteSuccessMsg("");
      }, 2000);
    }
  }, [successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const editHandler = (id) => {
    navigate(`/admin/user/${id}/edit`);
  };

  return (
    <>
      <h2>Users</h2>

      {/* Show delete success or error */}
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {deleteSuccessMsg && <Message variant="success">{deleteSuccessMsg}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name} {user.last_name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <Button variant="light" className="btn-sm" onClick={() => editHandler(user.id)}>
                    <i className="fas fa-edit"></i>
                  </Button>{" "}
                  <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user.id)}>
                    <i className="fas fa-trash"></i>
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

export default UserListScreen;
