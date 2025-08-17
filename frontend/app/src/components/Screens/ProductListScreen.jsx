import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { PRODUCT_CREATE_RESET } from "../../constants/productConstants";
import Loader from "../Loader";
import Message from "../Message";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../../action/productAction";

function ProductListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);

  const productsList = useSelector((state) => state.productList);
  const { loading, error, products } = productsList || {};

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Close handlers for messages
  const closeDeleteHandler = () => setShowDeleteSuccess(false);
  const closeCreateHandler = () => setShowCreateSuccess(false);

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      setShowCreateSuccess(true);
      const timer = setTimeout(() => {
        setShowCreateSuccess(false);
        navigate(`/admin/product/${createdProduct._id}/edit`);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      dispatch(listProducts());
    }
  }, [dispatch, userInfo, navigate, successDelete, successCreate, createdProduct]);

  useEffect(() => {
    if (successDelete) {
      setShowDeleteSuccess(true);
      const timer = setTimeout(() => {
        setShowDeleteSuccess(false);
        dispatch(listProducts());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successDelete, dispatch]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  const BASE_URL = process.env.REACT_APP_API_URL;

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}

      {showDeleteSuccess && (
        <Message variant="danger" dismissible onClose={closeDeleteHandler}>
          Product deleted successfully
        </Message>
      )}

      {showCreateSuccess && (
        <Message variant="success" dismissible onClose={closeCreateHandler}>
          Product created successfully.
        </Message>
      )}

      {!loading && products && (
        <Table striped bordered hover responsive className="table-sm mt-3">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              let imageUrl = "/default-image.png";
              if (product.image) {
                imageUrl = product.image.startsWith("/media/products/")
                  ? `${BASE_URL}${product.image}`
                  : `${BASE_URL}/media/products/${product.image}`;
              }

              return (
                <tr key={product._id}>
                  <td>
                    <img
                      src={imageUrl}
                      alt={product.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Link to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </Link>

                    <Button
                      variant="danger"
                      className="btn-sm ms-2"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default ProductListScreen;
