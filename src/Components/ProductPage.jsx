import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getLocalStorage } from "../utils/localStorage";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router";

const ProductPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let idProd = queryParams.get("idProd"); 
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    const storedProducts = getLocalStorage("products");
    const productos = storedProducts ? storedProducts.datos : [];
    setProduct(productos.find((p) => p.id === Number(idProd)));
  }, [idProd]);

  const addToCart = () => {
    const local = getLocalStorage("cart")
    const cartProds = local.datos
    if(cartProds){
      
    }
    if (cartProds)
    console.log(`agregado al carrito`);
  };

  return (
    <div className="container mt-5">
      <div className="row" style={{ marginTop: "10%" }}>
        <div className="col-md-6">
          <Carousel>
            <img
              className="d-block w-100"
              alt="first"
              style={{
                height: "600px",
                width: "600px",
                objectFit: "cover",
                background: "grey",
              }}
            />
          </Carousel>
        </div>
        <div className="col-md-6">
          {product ? (
            <>
              <h1>{product.description}</h1>
              <p>{product.description}</p>
              <h2>$ {product.price}</h2>
              <button className="btn btn-primary" onClick={() => addToCart()}>
                Agregar al carrito
              </button>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
