import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getLocalStorage,setLocalStorage } from '../utils/localStorage';
import '../utils/styles/ViewProducts.css';

const ViewProducts = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const description = queryParams.get('description');
  const [filteredProds,setFilteredProds]= useState([])
  const [cat, setCat] = useState(category);
  const [productos, setProductos] = useState([]);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [categorias, setcategorias] = useState([]);

  useEffect(() => {
    const fetchProd = async () => {
      const local = getLocalStorage("products");
      try {
        await fetch(process.env.REACT_APP_API_URL + "/Products", { credentials: "include" })
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
        await fetch(process.env.REACT_APP_API_URL + "/category", { credentials: "include" })
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
  }, [cat, productos, description]);

  const handleFilteredProds = () => {
    if (cat) {
      const prods = productos.filter((p) => p.idCat === Number(cat));
      setFilteredProds(prods);
      setMaxMin(prods);
      return
    }
    if (description) {
      const prods = productos.filter((p) => p.description.toLowerCase().includes(description.toLowerCase()));
      setFilteredProds(prods);
      setMaxMin(prods);
      return
    }
    setFilteredProds(productos);
    setMaxMin(productos);
  };

  const setMaxMin = (prods) => {
    if (prods.length === 0) {
      setMax(0)
      setMin(0)
      return
    };
    setMax(Math.max(...prods.map(p => p.price)));
    setMin(Math.min(...prods.map(p => p.price)));
  };

  const searchCat = (id) => {
    const cat = categorias.find((p) => p.id === id);
    return cat.description;
  };

  return (
    <div className="view-products-container">
      <aside className="filters">
        <h2>Filtrar Productos</h2>
        <div>
          <label>Categoría:</label>
          <select onChange={(e) => setCat(e.target.value)}
            value={cat || ""}>
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {searchCat(c.id)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Precio</label>
          {<p>Min:{min}</p>}
          <input
            type="range"
            min={min}
            max={max}
            step={0.1}
            onChange={(e) => {
              console.log(e.target.value);
              const maxPrice = e.target.value;
              setFilteredProds(
                productos.filter(
                  (p) => p.price <= maxPrice && (!cat || p.idCat === Number(cat))
                )
              );
            }}
          />
          {<p>Max:{max}</p>}
        </div>
        </aside>
      <main className="products">
        <h1>Productos</h1>
        {cat && <p>Mostrando productos para la categoría: {cat}</p>}
        {description &&<p>Mostrando productos para su busqueda: {description}</p>}
        {filteredProds.length > 0 ? (
          filteredProds.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </main>
    </div>
  );
};

export default ViewProducts;