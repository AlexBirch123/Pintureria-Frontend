import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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
        overflow: "hidden",
      }}
      onClick={handleClick}
    >
      <img
        src={ category.imgUrl ? process.env.REACT_APP_API_URL + "/uploads/" +  category.imgUrl : "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"}
        className="card-img-top"
        alt={category.description}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
        }}
      />
      <div className="card-body">
        <h5 className="card-title" style={{ fontSize: "calc(10px + 0.5vw)" }}>{category.description}</h5>
      </div>
    </div>
  );
};

export default CategoryCard;
