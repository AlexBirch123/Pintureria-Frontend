import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router';
import { getLocalStorage } from '../utils/localStorage';

const Cart = () => {
    const navigate = useNavigate()
    const [cartProds, setCartProds] = useState([])

    useEffect(()=>{
        const local = getLocalStorage("cart")
        if (local) setCartProds( local.datos)
      },[cartProds])

    const handleQuantityChange = (id, quantity) => {
        setCartProds(cartProds.map(item => 
            item.idProduct === id ? { ...item, quantity: quantity } : item
        ));
    };

    const handleRemoveItem = (id) => {
        setCartProds(cartProds.filter(item => item.idProduct !== id));
    };

    const handleCheckout = () => {
        alert('Procediendo al pago');
    };

    return (
        <div className="container mt-5">
            <h2>Carrito de Compras</h2>
            <ul className="list-group">
                {cartProds.length > 0  ?(cartProds.map(item => (
                    <li key={item.idProduct} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5>{item.name}</h5>
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
            <button className="btn btn-primary mt-3" onClick={handleCheckout}>Pagar</button>
        </div>
    );
};

export default Cart;