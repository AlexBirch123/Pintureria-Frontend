import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

const ProductPage = () => {
  const {  isAuthenticated } = useAuth();
  const navigate = useNavigate()
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
    if(!isAuthenticated) return navigate("/login")
    const local = getLocalStorage("cart")
    const cartProds = local.datos
    const newCartProd = {
      idProduct: product.id,
      description: product.descripcion,
      price: product.price,
      quantity: 1,
      total: product.price,
    }
    if(cartProds){
      if(cartProds.include(newCartProd))return
      setLocalStorage("cart", [...cartProds, newCartProd])
    }else{ 
      setLocalStorage("cart", [newCartProd])
    }
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
