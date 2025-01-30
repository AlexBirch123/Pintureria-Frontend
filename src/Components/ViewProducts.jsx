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
  const [cat, setCat] = useState(category);
  const [productos, setProductos] = useState([]);
  const [max, setMax] = useState([]);
  const [min, setMin] = useState([]);
  const [categorias, setcategorias] = useState([]);
  //PONER ALGO PARA FILTRAR LOS PRODUCTOS

  useEffect(() => {
    const fetchProd = async () => {
      const local = getLocalStorage("products");
      try {
        await fetch(URL + "/Products", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data || data.length === 0) {
              if (local) setProductos(local.datos);
            } else {
              setProductos(data);
              setFilteredProds(data);
              setLocalStorage(data, "products");
            }
          });
      } catch (error) {
        console.log(error);
        if (local) setProductos(local.datos);
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
    handleFilteredProds();
    // setMaxMin();
  }, [cat, productos]);

  const handleFilteredProds = () => {
    if (!cat) return setFilteredProds(productos);
    setFilteredProds(productos.filter((p) => p.idCat === category));
  };

  const setMaxMin = () => {
    let min,
      max = productos[1];
    for (let i = productos; i < productos.length; i++) {
      if (productos[i].price < min) {
        min = productos[i].price;
      }
      if (productos[i].price > max) {
        max = productos[i].price;
      }
    }
    setMax(max);
    setMin(min);
  };

  return (
    <div>
      <div
        style={{ flex: 0.3, padding: "20px", borderRight: "1px solid #ccc" }}
      >
        <h2>Filtrar Productos</h2>
        <div>
          <label>Categoría:</label>
          <select onChange={(e) => setCat(e.target.value)} value={cat || ""}>
            <option value="">Todas</option>
            {/* {categorias.map((p) => (
              <option key={p.idCat} value={p.idCat}>{p.categoryName}</option>
            ))} */}
          </select>
        </div>
        <div>
          <label>Precio</label>
          {<p>min:{min}</p>}
          <input
            type="range"
            min={min}
            max={max}
            step={0.1}
            onChange={(e) => {
              console.log(e.target.value);
              const maxPrice = e.target.value;
              // setFilteredProds(productos.filter((p) => p.price <= maxPrice && (!cat || p.idCat === cat)));
            }}
          />
          {<p>max:{max}</p>}
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "10%" }}>Productos</h1>
          {/* {cat && <p>Mostrando productos para la categoría: {cat}</p>} */}
          {filteredProds.length > 0 ? (
            filteredProds.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;