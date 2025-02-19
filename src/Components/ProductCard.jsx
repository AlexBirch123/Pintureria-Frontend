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
      style={{  cursor: "pointer", display: "flex", flexDirection: "row" }}
      onClick={handleClick}
    >
      <Card.Img 
        variant="top" 
        src={product.imgUrl || "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"} 
        style={{ width: "50%" }}
      />
      <Card.Body style={{ width: "100%" }}>
        <Card.Title>{product.title}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
