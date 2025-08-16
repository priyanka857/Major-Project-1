import React, {useEffect } from "react";
import { Row, Col } from "react-bootstrap";
// import axios from 'axios';
import ProductScreen from "./Screens/ProductScreen";
import { listProducts } from "../action/productAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";

function Home() {
  const dispatch = useDispatch();
  const productsList = useSelector((state) => state.productList);
  const { error, loading, products } = productsList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);
  console.log("products",products)

  return (
    <div>
      <h1 className="text-center mt-2">Latest Products</h1>
      {loading ? (
<Loader/>
) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          {products?.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              {/* <h3>{product.name}</h3> */}
              <ProductScreen product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Home;
