import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router';

const Cart = () => {
    const navigate = useNavigate()
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Producto 1', quantity: 1, price: 100 },
        { id: 2, name: 'Producto 2', quantity: 1, price: 200 },
    ]);

    const handleQuantityChange = (id, quantity) => {
        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity: quantity } : item
        ));
    };

    const handleRemoveItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        alert('Procediendo al pago');
    };

    return (
        <div className="container mt-5">
            <h2>Carrito de Compras</h2>
            <ul className="list-group">
                {cartItems.map(item => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5>{item.name}</h5>
                            <p>Precio: ${item.price}</p>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={item.quantity} 
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                min="1"
                            />
                        </div>
                        <button className="btn btn-danger" onClick={() => handleRemoveItem(item.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <button className="btn btn-primary mt-3" onClick={handleCheckout}>Pagar</button>
        </div>
    );
};

export default Cart;