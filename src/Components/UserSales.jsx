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
                if (!data) return setItems([]);
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
                      <p className="card-text">Precio unitario: <span className="text-success">${item.price}</span></p>
                      <p className="card-text">Total: <span className="fw-bold text-primary">${item.total}</span></p>
                      <p className="card-text text-muted">
                        Fecha: {new Date(item.createdAt).toLocaleDateString()}
                      </p>
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