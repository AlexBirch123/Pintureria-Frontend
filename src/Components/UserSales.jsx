import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const UserSales = () => {
    const { id } = useAuth();
    const [sales, setSales] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchSales = async () => {
              try {
                const res = await fetch(process.env.REACT_APP_API_URL + `/Sales/${id}`, { credentials: "include" })
                if (!res.ok) return console.log("error al obtener las ventas")
                const data = await res.json(); 
                if(data.length > 0){
                  for (const sale of data) {
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/Rows/${sale.id}`, { credentials: "include" })
                    if (!res.ok) return console.log("error al obtener items");
                    const data = await res.json(); 
                    setItems([...items, data]);
                   }
                }
              } catch (error) {
                console.log(error);
              }
            };
        
        const fetchAllItems = async () => {
                if(id) {
                    await fetchSales();
                }     
         }

        fetchAllItems();
    }, [id]);

    const handleDate = (date) => { 
      const fecha = new Date(date);
      const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' }
      return (fecha.toLocaleString('es-ES', opciones));
    }

    return (
        <div className="container mt-5" >
      <h2 className="text-center mb-4" style={{ marginTop: "7%" }}>🛒 Tus Compras</h2>
      {items.length === 0 ? (
        <div className="alert alert-warning text-center">No hay compras disponibles</div>
      ) : (
        <div className="row justify-content-center">
          {items.map((item) => (
            <div key={item.id} className="col-md-8">
              <div className="card mb-3 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-4 d-flex align-items-center">
                    <img
                      src={item.imgUrl?
                        process.env.REACT_APP_API_URL + "/uploads/" + item.imgUrl : "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"}
                      alt={item.title}
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: "150px", objectFit: "cover", width: "100%" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">Cantidad: <strong>{item.quantity}</strong></p>
                      <p className="card-text">Precio unitario:${item.price}</p>
                      <p className="card-text">Total:${item.total}</p>
                      <p className="card-text text-muted">Fecha: {handleDate(item.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
            )}
        </div>
    );
};

export default UserSales;