import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import latex from "../utils/images/latex.jpg"

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products?category=${category.id}`);
  };

  return (
    <div className="card" style={{ width: "18rem" }} onClick={handleClick}>
      <img src={latex} className="card-img-top" alt={category.description} />
      <div className="card-body">
        <h5 className="card-title">{category.description}</h5>
      </div>
    </div>
  );
};

export default CategoryCard;
