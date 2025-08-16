import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import {
  listProductDetails,
  updateProduct,
} from "../../action/productAction";
import axios from "axios";

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );

  const { userInfo } = useSelector((state) => state.userLogin); // ✅ Fix: get userInfo from Redux

  useEffect(() => {
    if (!product || product._id !== id) {
      dispatch(listProductDetails(id));
    } else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [dispatch, id]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: id,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      })
    );
    navigate("/admin/productlist");
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("product_id", id);

    try {
      setUploading(true);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`, // ✅ include token
        },
      };

      const { data } = await axios.post(
        "http://localhost:8000/api/upload/",
        formData,
        config
      );

      setImage(data.image); // Make sure backend responds with image path
      setUploading(false);
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploading(false);
    }
  };

  return (
    <>
      <Button className="btn btn-light my-3" onClick={() => navigate("/admin/productlist")}>
        Go Back
      </Button>
      <h1>Edit Product</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
            />
          </Form.Group>

          <Form.Group controlId="price" className="my-2">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </Form.Group>

          <Form.Group controlId="image" className="my-2">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {uploading && <Loader />}
            {image && (
              <img
                src={image}
                alt="preview"
                style={{ width: "100px", marginTop: "10px" }}
              />
            )}
          </Form.Group>

          <Form.Group controlId="brand" className="my-2">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Enter brand"
            />
          </Form.Group>

          <Form.Group controlId="countInStock" className="my-2">
            <Form.Label>Stock Count</Form.Label>
            <Form.Control
              type="number"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              placeholder="Enter stock count"
            />
          </Form.Group>

          <Form.Group controlId="category" className="my-2">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
            />
          </Form.Group>

          <Form.Group controlId="description" className="my-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Update
          </Button>
        </Form>
      )}
    </>
  );
};

export default ProductEditScreen;
