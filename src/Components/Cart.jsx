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
  const [paymentId,setPaymentId] = useState("")
  const {id} = useAuth();

  useEffect(()=>{
      const local = getLocalStorage("cart")
      if (local) setCartProds( local.datos)
    },[])
  useEffect(() => {
    if (queryId) {
      setPaymentId(queryId);
    }
  }, [queryId]);
  useEffect(() => {
    if (queryId) {
      setPaymentId(queryId);
    }
  }, [queryId]);
  useEffect(() => {
    if (paymentId && !saleCreated && cartProds.length > 0) {
      creatSale();
    }
  }, [paymentId, cartProds]);
  
  const handleQuantityChange = (id, quantity) => {
    const updateQuantity = cartProds.map((item) =>
      item.idProduct === id ? { ...item, quantity: quantity , total:item.price * quantity} : item
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
      if(!res.ok) return console.log("error al crear la venta")
      setSaleCreated(true)
      setCartChange(!cartChange)
      setLocalStorage([],"cart")
    } catch (error) {
      console.log(" error al crear la venta", error);
    }
  };

  return (
      <div className="container mt-5">
        {(paymentId && saleCreated) ? ( 
          <div className="container mt-5">
          <h2 style={{marginTop:"5%"}}>Compra realizada con exito</h2>
          <h3>Detalle de tu compra</h3>
          <ul className="list-group">
                {cartProds.map(item => (
                    <li key={item.idProduct} className="list-group-item d-flex justify-content-between align-items-center">
                        <div >
                            <h5>{item.description}</h5>
                            <p>Precio: ${item.price}</p>
                            <p>Catidad: {item.quantity}</p>
                        </div>
                    </li>
                ))}
            </ul>
          <button className="btn btn-primary mt-3" onClick={()=> navigate("/home")}>Seguir comprando</button>
        </div>
        ):(
          <div>
            <h2 style={{marginTop:"5%"}}>Carrito de Compras</h2>
            <ul className="list-group">
                {cartProds.length > 0  ?(cartProds.map(item => (
                    <li key={item.idProduct} className="list-group-item d-flex justify-content-between align-items-center">
                        <div >
                            <h5>{item.description}</h5>
                            <p>Precio: ${item.price}</p>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={item.quantity} 
                                onChange={(e) => handleQuantityChange(item.idProduct, parseInt(e.target.value))}
                                min="1"
                            />
                        </div>
                        <button className="btn btn-danger" onClick={() => handleRemoveItem(item.idProduct)}>Eliminar</button>
                    </li>
                ))):
                (
                    <li className="list-group-item d-flex justify-content-center align-items-center">
                        No hay productos agregados al carrito.
                    </li>
                )}
            </ul>
            {cartProds.length > 0 ? (
              <button className="btn btn-primary mt-3" onClick={createOrder}>Pagar</button>
            ):(
              <button className="btn btn-primary mt-3" onClick={()=> navigate("/home")}>Seguir comprando</button>
            )}

            {message&& <p>{message}</p>}
          </div>
        ) }
      </div>
  );
};

export default Cart;