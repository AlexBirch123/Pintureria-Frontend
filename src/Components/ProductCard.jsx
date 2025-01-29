import React from "react";
import { Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import latex from "../utils/latex.png";

const ProductCard = ({ product }) => {
  const history = useHistory();

  const handleCardClick = () => {
    history.push(`/product/${product.id}`);
  };

  return (
    <Card style={{ width: "18rem" }} onClick={handleCardClick}>
      {/* <Card.Img variant="top" src={product.image} /> */}
      <Card.Img variant="top" src={latex} />
      <Card.Body>
        {/* <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>${product.price}</Card.Text> */}
        <Card.Title>Latex 10lt</Card.Title>
        <Card.Text>Latex 10lt</Card.Text>
        <Card.Text>$10000</Card.Text>
        <Button variant="primary">Agregar al carrito</Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
