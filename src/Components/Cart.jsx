import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';
import { useAuth } from './AuthContext';

const Cart = ({setCartChange, cartChange}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get('payment_id');
  const navigate = useNavigate()
  const [cartProds, setCartProds] = useState([])
  const [saleCreated, setSaleCreated] = useState(false);
  const [message,setMessage] = useState("")
  const [paymentId,setPaymentId] = useState()
  const {id} = useAuth();
  const imgNotFound = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"

  useEffect(()=>{
      const local = getLocalStorage("cart")
      if (local) setCartProds( local.datos)
    },[])
  useEffect(() => {
    if (queryId ) {
      setPaymentId(queryId);
    }
  }, [queryId]);
  useEffect(() => {
    if (paymentId && !saleCreated && cartProds.length > 0) {
      console.log("paso")
      creatSale();
    }
  }, [paymentId, cartProds]);
  
  const handleQuantityChange = (id, quantity) => {
    const updateQuantity = cartProds.map((item) =>
      item.idProduct === id ? { ...item, quantity: Number(quantity) , total:item.price * quantity} : item
    );
    setCartProds(updateQuantity);
    setLocalStorage(updateQuantity, "cart");
  };

  const handleRemoveItem = (id) => {
      const newCart =cartProds.filter(item => item.idProduct !== id)
      setCartProds(newCart);
      setLocalStorage(newCart,"cart")
      setCartChange(!cartChange)
  };

  const createOrder = async()=>{
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/mp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartProds),
      });
      if (!res.ok) {
        throw new Error("Error al conectar con Mercado Pago");
      }
      const data = await res.json();
      window.location.href = data.init_point;
    } catch (error) {
      console.error("Error en createOrder:", error);
    }
  }

  const creatSale = async () => {
    let total = 0;
    cartProds.map((prod) => (total = total + prod.price * prod.quantity));
    const newSale = {
      idUser: id,
      idBranch: 1,
      idEmp: 1,
      total: total,
      saleProds: cartProds,
      paymentId:paymentId,
    };

    if (!(total > 0))return setMessage("El total de la venta debe ser mayor a 0");

    try {
      const res = await fetch(process.env.REACT_APP_API_URL + `/Sales`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSale),
      });
      if(!res.ok) return console.log("error al crear la venta",res)
      setSaleCreated(true)
      setCartChange(!cartChange)
      setLocalStorage([],"cart")
    } catch (error) {
      console.log(" error al crear la venta", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      {paymentId && saleCreated ? (
        <div
          className="card shadow-lg p-4"
          style={{ maxWidth: "600px", width: "100%" }}
        >
          <h2 style={{ marginTop: "5%" }}>Compra realizada con exito</h2>
          <h3>Detalle de tu compra</h3>
          <ul className="list-group">
            {cartProds.map((item) => (
              <li
                key={item.idProduct}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <img
                    src={ item.imgUrl?
                      process.env.REACT_APP_API_URL+ "/uploads/"+ item.imgUrl : imgNotFound
                    }
                    alt={item.title}
                    style={{
                      width: "100px",
                      height: "100px",
                      marginRight: "10px",
                    }}
                  />
                  <h5>{item.title}</h5>
                  <p>Precio: ${item.price}</p>
                  <p>Catidad: {item.quantity}</p>
                  <p>Total: ${item.price * item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/home")}
          >
            Seguir comprando
          </button>
        </div>
      ) : (
        <div
          className="card shadow-lg p-4"
          style={{ maxWidth: "600px", width: "100%" }}
        >
          <h2 className="text-center mb-4">🛒 Carrito de Compras</h2>
          {cartProds.length > 0 ? (
            <ul className="list-group">
              {
                cartProds.map((item) => (
                  <li
                    key={item.idProduct}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <img
                        src={ item.imgUrl?
                          process.env.REACT_APP_API_URL+ "/uploads/"+ item.imgUrl : imgNotFound
                        }
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "150px",
                          cursor:"pointer",
                        }}
                        onClick={()=> navigate(`/productPage?idProd=${item.idProduct}`)}
                      />
                    </div>
                    <div>
                      <h5 className="mb-1" onClick={()=> navigate(`/productPage?idProd=${item.idProduct}`)} style={{cursor:"pointer"}}>{item.title}</h5>
                      <p className="text-muted">Precio: ${item.price}</p>
                      <label>Cantidad</label>
                      <input
                        type="number"
                        className="form-control"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.idProduct,
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        style={{ maxWidth: "80px" }}
                      />
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveItem(item.idProduct)}
                    >
                      ❌
                    </button>
                  </li>
                ))}
            </ul>
            ) : (
              <p className="text-center text-muted">El carrito está vacío 🛍️</p>
            )}
          {cartProds.length > 0 ? (
            <button className="btn btn-success" onClick={createOrder}>
              💳 Pagar
            </button>
          ) : (
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/home")}
            >
              🔙 Seguir Comprando
            </button>
          )}

          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Cart;