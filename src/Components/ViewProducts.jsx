import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';

const ViewProducts = ({productos}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const [filteredProds,setFilteredProds]= useState([])
  const [cat,setCat]= useState(null)

//PONER ALGO PARA FILTRAR LOS PRODUCTOS



  useEffect(() => {
    setCat(category)
    if (!cat) return setFilteredProds(productos)
    setFilteredProds(productos.filter((p)=> p.idCat === cat))
  }, [category,cat,productos]);

  return (
    <div>
      <h1 style={{margin: "10%"}}>Productos</h1>
      {category && <p>Mostrando productos para la categoría: {category}</p>}
      {/* Aquí puedes renderizar la lista de productos */}
      {filteredProds.map((p)=>
          (<ProductCard price={p.price} description={p.description} ></ProductCard>)
      )}
    </div>
  );
};

export default ViewProducts;