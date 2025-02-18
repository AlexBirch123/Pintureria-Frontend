import React from "react";
import { Card} from "react-bootstrap";
import latex from "../utils/images/latex.jpg";
import { useNavigate } from "react-router";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/productPage?idProd=${product.id}`);
      };

  return (
    <Card
      style={{ width: "18rem", cursor: "pointer" }}
      onClick={handleClick}
    >
      <Card.Img variant="top" src={product.imgUrl || "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"} />
      <Card.Body>
        <Card.Title>{product.title}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
