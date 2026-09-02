import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProductScreen({ product }) {
  const BASE_URL =
    window.location.hostname === "localhost"
      ? (process.env.REACT_APP_LOCAL_API || "http://127.0.0.1:8000")
      : "https://major-project-1-azq9.onrender.com";

  const imageUrl = product && product.image
    ? (product.image.startsWith("/media/")
        ? `${BASE_URL}${product.image}`
        : `${BASE_URL}/media/${product.image}`)
    : "/default-image.png";

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={imageUrl} alt={product.name} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <strong>₹{product.price}</strong>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ProductScreen;