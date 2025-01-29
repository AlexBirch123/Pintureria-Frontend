import React from "react";
import { Card, Button } from "react-bootstrap";
import latex from "../utils/images/latex.jpg";

const ProductCard = ({ product }) => {
  // const history = useHistory();

  const handleCardClick = () => {
    // history.push(`/product/${product.id}`);
    console.log("click en producto")
  };

  return (
    <Card style={{ width: "18rem" ,cursor:"pointer"} } onClick={handleCardClick} >
      {/* <Card.Img variant="top" src={product.image} /> */}
      <Card.Img variant="top" src={latex} />
      <Card.Body>
        {/* <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>${product.price}</Card.Text> */}
        <Card.Title>Latex 10lt</Card.Title>
        <Card.Text>Latex 10lt</Card.Text>
        <Card.Text>$10000</Card.Text>
        {/* <Button variant="primary">Agregar al carrito</Button> */}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
