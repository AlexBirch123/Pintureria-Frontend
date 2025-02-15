import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const UserSales = () => {
    const { id } = useAuth();
    const [sales, setSales] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchSales = async () => {
              try {
                const res = await fetch(process.env.REACT_APP_API_URL + "/Sales", { credentials: "include" })
                const data = await res.json(); 
                if (!data) return setSales([]);
                const userSales = data.filter((sale) => sale.idUser === id);
                setSales(userSales);
              } catch (error) {
                console.log(error);
              }
            };
        
        const fetchItems = async (idSale) => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/Rows/${idSale}`, { credentials: "include" })
                const data = await res.json(); 
                if (!data) return setItems([...items]);
                setItems([...items, data]);
            } catch (error) {
                console.log(error);
            }    
        }
            
        const fetchAllItems = async () => {
            try {
                if(id) {
                    await fetchSales();
                    if (sales.length > 0){
                        for (const sale of sales) {
                         await fetchItems(sale.id);
                        }
                    }
                }     
            } catch (error) {
                console.log(error);    
            }
         }

        fetchAllItems();
    }, [id]);

    return (
        <div>
            <h2>Tus compras</h2>
            {items.length === 0 ? (
                <li className="list-group-item d-flex justify-content-center align-items-center">
                    No hay compras disponibles
                </li>
            ) : (
                <ul className="list-group-item d-flex justify-content-between align-items-center">
                    {items.map((item) => (
                        <li key={item.id}>
                            <img src={item.imgUrl || "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"} alt={item.title} width="50" />
                            <div>
                                <h3>{item.title}</h3>
                                <p>Cantidad: {item.quantity}</p>
                                <p>Precio unitario: {item.price}</p>
                                <p>Total: {item.total}</p>
                                <p>Fecha: {new Date(item.createdAt).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserSales;