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
            <Carousel.Item>
              <img
                className="d-block w-100 rounded border"
                src={product?.image || "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"}
                alt="Producto"
                style={{ height: "500px", objectFit: "cover" }}
              />
            </Carousel.Item>
          </Carousel>
        </div>

 
        <div className="col-lg-5">
          {product ? (
            <div className="card shadow-lg p-4">
              <h1 className="display-5 fw-bold">{product.description}</h1>
              <p className="lead text-muted">{product.longDescription}</p>
              <h2 className="text-success fw-bold">$ {product.price}</h2>
              <p className="text-muted">Unidades en stock: {product.stock}</p>
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
  //   <div className="container mt-5">
  //     <div className="row"style={{marginTop: "5%"}}>
  //       <div className="col-md-7">
  //         <Carousel>
  //           <Carousel.Item>
  //             <img
  //               className="d-block w-100"
  //               src={product?.image || "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"}
  //               alt="Product"
  //               style={{ height: "500px", objectFit: "cover" }}
  //             />
  //           </Carousel.Item>
  //         </Carousel>
  //       </div>
  //       <div className="col-md-5">
  //         {product ? (
  //           <>
  //             <h1 className="display-4">{product.description}</h1>
  //             <p className="lead">{product.longDescription}</p>
  //             <h2 className="text-success">$ {product.price}</h2>
  //             <p className="text-muted">Unidades en stock: {product.stock}</p>
  //             <button className="btn btn-primary btn-lg btn-block" onClick={addToCart}>
  //               Agregar al carrito
  //             </button>
  //             {message && <div className="alert alert-info mt-3">{message}</div>}
  //           </>
  //         ) : (
  //           <p>Loading...</p>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default ProductPage;
