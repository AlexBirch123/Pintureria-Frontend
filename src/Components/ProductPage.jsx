import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

const ProductPage = ({setCartChange,cartChange}) => {
  const {  isAuthenticated } = useAuth();
  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let idProd = queryParams.get("idProd"); 
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    const storedProducts = getLocalStorage("products");
    const productos = storedProducts ? storedProducts.datos : [];
    setProduct(productos.find((p) => p.id === Number(idProd)));
  }, [idProd]);

  const addToCart = () => {
    if (!isAuthenticated) return navigate("/login");
    const local = getLocalStorage("cart");
    const newCartProd = {
      idProduct: product.id,
      description: product.description,
      price: product.price,
      quantity: 1,
      total: product.price,
    };
    if (local) {
      console.log(local.datos)
      const cartProds =local.datos;
      const alreadyAdd = cartProds.find(p => p.idProduct === newCartProd.idProduct);
      if (alreadyAdd) {
        setMessage("Producto ya existente en el carro");
        return;
      }
      setLocalStorage([...cartProds, newCartProd] , "cart");
    } else {
      setLocalStorage([newCartProd], "cart");
    }
    setMessage("Producto agregado al carrito");
    setCartChange(!cartChange)
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
              <p>Unidades en stock: {product.stock}</p>
              <button className="btn btn-primary" onClick={() => addToCart()}>
                Agregar al carrito
              </button>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>     
      {message && (<p>{message}</p>)}
    </div>
  );
};

export default ProductPage;
