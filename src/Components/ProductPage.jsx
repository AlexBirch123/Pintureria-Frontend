import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

const ProductPage = ({ setCartChange, cartChange }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let idProd = queryParams.get("idProd");
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState(null);
  const imgNotFound =  "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"

  useEffect(() => {
    const fetchProd = async (url, setState) => {
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + url, {
          credentials: "include",
        });
        if (!res.ok) return 
        const data = await res.json();
        setState(data);
      } catch (error) {
        console.log(error);
      }
    };
    if(idProd){
      fetchProd(`/Products/${idProd}`,setProduct)
    }
  }, []);

  const addToCart = () => {
    if (!isAuthenticated) return navigate("/login");
    const local = getLocalStorage("cart");
    const newCartProd = {
      idProduct: Number(product.id),
      title: product.title,
      price: Number(product.price),
      quantity: 1,
      total: Number(product.price),
      imgUrl:product.imgUrl,
    };
    if (local) {
      const cartProds = local.datos;
      const alreadyAdd = cartProds.find((p) => p.idProduct === newCartProd.idProduct);
      if (alreadyAdd) {
        setMessage("Producto ya existente en el carro");
        return;
      }
      setLocalStorage([...cartProds, newCartProd], "cart");
    } else {
      setLocalStorage([newCartProd], "cart");
    }
    setMessage("Producto agregado al carrito");
    setCartChange(!cartChange);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center" style={{ marginTop: "5%" }}>

        <div className="col-lg-6">
          <Carousel className="shadow-sm rounded">
                <Carousel.Item style={{ height: "50%", objectFit: "cover", marginTop:"5%", marginBottom:"5%" }}>
              {product?(
                <img
                className="d-block w-100 rounded border"
                src={product.imgUrl? 
                  process.env.REACT_APP_API_URL+ "/uploads/"+ product.imgUrl : imgNotFound}
                alt="Producto"
                style={{ height: "500px", objectFit: "cover" }}
              />):(
                <img
                className="d-block w-100 rounded border"
                src= {imgNotFound}
                alt="Producto"
                style={{ height: "500px", objectFit: "cover" }}
              />
              )}
            </Carousel.Item>
          </Carousel>
        </div>

 
        <div className="col-lg-5" style={{marginTop:"2.5%" }}>
          {product ? (
            <div className="card shadow-lg p-4">
              <h1 className="display-5 fw-bold">{product.title}</h1>
              <h2 className="text-success fw-bold">$ {product.price}</h2>
              <p className="text-muted">Unidades en stock: {product.stock}</p>
              <p className="lead text-muted">{product.description}</p>
              <button className="btn btn-success btn-lg w-100" onClick={addToCart}>
                🛒 Agregar al carrito
              </button>
              {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted">Cargando producto...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
