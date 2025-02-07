import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';
import { useAuth } from './AuthContext';
import { URL } from '../utils/config';

const Cart = ({setCartChange, cartChange}) => {
    const navigate = useNavigate()
    const [cartProds, setCartProds] = useState([])
    const {id} = useAuth();
    const [message,setMessage] = useState("")

    useEffect(()=>{
        const local = getLocalStorage("cart")
        if (local) setCartProds( local.datos)
      },[])

    const handleQuantityChange = (id, quantity) => {
        setCartProds(cartProds.map(item => 
            item.idProduct === id ? { ...item, quantity: quantity } : item
        ));
    };

    const handleRemoveItem = (id) => {
        const newCart =cartProds.filter(item => item.idProduct !== id)
        setCartProds( newCart);
        setLocalStorage(newCart,"cart")
        setCartChange(!cartChange)
    };

      const creatSale = async () => {
          let total = 0;
          cartProds.map((prod) => (total = total + (prod.price * prod.quantity)));
          const newSale = {
            idClient: id,
            idBranch: 1,
            idEmp: 1,
            total: total,
            saleProds: cartProds,
          };
          if (!(total > 0))
            return console.log(
              "El total de la venta debe ser mayor a 0"
            ); /*setMessage("El total de la venta debe ser mayor a 0");*/
          try {
            console.log(cartProds)
            const res = await fetch(`${URL}/mp`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(cartProds),
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            window.location.href = data.init_point;
            // await fetch(URL + `/Sales`, {
            //   method: "POST",
            //   credentials: "include",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify(newSale),
            // });
          } catch (error) {
            console.log(" error al crear la venta", error);
          }
          // setMessage("Venta Realizada con exito");
          // setTimeout(()=>{setMessage(null)
          //   navigate("/home")
          // } , 3000); 
      };

    return (
        <div className="container mt-5">
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
            <button className="btn btn-primary mt-3" onClick={creatSale}>Pagar</button>
        </div>
    );
};

export default Cart;