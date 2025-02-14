import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import latex from "../utils/images/latex.jpg";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products?category=${category.id}`);
  };

  return (
    <div
      className="card"
      style={{
        width: "200px",
        margin: "10px",
        textAlign: "center",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <img
        src={category.urlImg || latex}
        className="card-img-top"
        alt={category.description}
        style={{
          width: "200px",
          height: "150px",
          objectFit: "cover",
          margin: "auto",
          display: "block",
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{category.description}</h5>
      </div>
    </div>
  );
};

export default CategoryCard;
