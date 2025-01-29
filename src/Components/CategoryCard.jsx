import React from "react";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CategoryCard = ({ category }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/products?category=${category.name}`);
  };

  return (
    <div className="card" style={{ width: "18rem" }} onClick={handleClick}>
      <img src={category.image} className="card-img-top" alt={category.name} />
      <div className="card-body">
        <h5 className="card-title">{category.name}</h5>
        <p className="card-text">{category.description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
