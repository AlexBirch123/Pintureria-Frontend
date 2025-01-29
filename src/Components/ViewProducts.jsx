import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getLocalStorage,setLocalStorage } from '../utils/localStorage';
import { URL } from '../utils/config';

const ViewProducts = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const [filteredProds,setFilteredProds]= useState([])
  const [cat,setCat]= useState(null)
  const [productos, setProductos]  = useState();
  const [categorias, setcategorias]  = useState();
  //PONER ALGO PARA FILTRAR LOS PRODUCTOS

  useEffect(() => {
    const fetchProd = async () => {
      const local = getLocalStorage("products");
      try {
        await fetch(URL + "/Products", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setProductos(local.datos);
            setProductos(data);
            setLocalStorage(data, "products");
          });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchcat = async () => {
      const local = getLocalStorage("category");
      try {
        await fetch(URL + "/category", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setcategorias(local.datos);
            setcategorias(data);
            setLocalStorage(data, "category");
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchProd();
    fetchcat();
  }, []);

  useEffect(() => {
    console.log(category)
    setCat(category)
    if (!cat) return setFilteredProds(productos)
    // setFilteredProds(productos.filter((p)=> p.idCat === cat))
  }, [category,cat]);

  return (
  <div>
    <div style={{ flex: 0.3, padding: '20px', borderRight: '1px solid #ccc' }}>
        <h2>Filtrar Productos</h2>
        <div>
          <label>Categoría:</label>
          <select onChange={(e) => setCat(e.target.value)} value={cat || ''}>
            <option value=''>Todas</option>
            {/* Assuming you have a list of categories */}
            {/* {categorias.map((p) => (
              <option key={p.idCat} value={p.idCat}>{p.categoryName}</option>
            ))} */}
          </select>
        </div>
        <div>
          <label>Precio Máximo:</label>
          <input
            type="number"
            onChange={(e) => {
              const maxPrice = e.target.value;
              // setFilteredProds(productos.filter((p) => p.price <= maxPrice && (!cat || p.idCat === cat)));
            }}
          />
        </div>
      </div>
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ margin: "10%" }}>Productos</h1>
        {/* {cat && <p>Mostrando productos para la categoría: {cat}</p>} */}
        {/* {filteredProds.map((p) => (
          <ProductCard key={p.id} price={p.price} description={p.description} />
        ))} */}
      </div>
      
    </div>
  </div>
  );
};

export default ViewProducts;