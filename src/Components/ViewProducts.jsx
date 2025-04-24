import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getLocalStorage,setLocalStorage } from '../utils/localStorage';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewProducts = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const title = queryParams.get('title');
  const [filteredProds,setFilteredProds]= useState([])
  const [cat, setCat] = useState(category);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchData("/category", "category", setCategories);
    setCat(category)
  }, []);

  useEffect(() => {
    handleFilteredProds();
  }, [cat,category, title]);
  

  const fetchData = async (url, localStorageKey, setState) => {
    const local = getLocalStorage(localStorageKey);
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + url, {
        credentials: "include",
      });
      if (!res.ok) return setState(local.datos);
      const data = await res.json();
      setState(data);
      setLocalStorage(data, localStorageKey);
      return data;
    } catch (error) {
      setState(local.datos);
    }
  };

  const handleFilteredProds = async() => {
    if (cat) {
      const data = await fetchData(`/products/category/${cat}`, "products", setFilteredProds);
      setMaxMin(data);
      return
    }
    if (title) {
      const data = await fetchData(`/products/title/${title}`, "products", setFilteredProds);
      setMaxMin(data);
      return
    }
    const data = await fetchData("/products", "products", setFilteredProds);
    console.log(data)
    setMaxMin(data);
    
  };

  const setMaxMin = (prods) => {
    if (!Array.isArray(prods) ||prods.length === 0) {
      setMax(0)
      setMin(0)
      return
    };
    setMax(Math.max(...prods.map(p => Number(p.price))));
    setMin(Math.min(...prods.map(p => Number(p.price))));
  };


  const [showFilters, setShowFilters] = useState(window.innerWidth > 768);


  return (
    <div className="container mt-5">
      <div className="row" style={{ marginTop: "5%" }}>
      <button
        className="btn btn-primary mt-3"
        onClick={() => setShowFilters(!showFilters)}
        style={{ display: window.innerWidth <= 768 ? 'block' : 'none'} }
      >
        {showFilters ? 'Ocultar Filtros' : 'Filtros'}
      </button>
        {showFilters && (
          <aside className="col-md-3" style={{marginBottom: "1%"}}>
            <div className="card p-3 shadow-sm">
              <h4 className="text-center">Filtrar Productos</h4>
              <div className="mb-3">
                <label className="form-label">Categoría:</label>
                <select className="form-select" onChange={(e) => setCat(e.target.value)} value={cat || ""}>
                  <option value="">Todas</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.description}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Precio</label>
                <p>Min: {min}</p>
                <input
                  type="range"
                  className="form-range"
                  min={min}
                  max={max}
                  step={0.1}
                  onChange={(e) => {
                    const maxPrice = e.target.value;
                    const products = getLocalStorage("products").datos;
                    setFilteredProds(
                      products.filter(
                        (p) => p.price <= maxPrice && (!cat || p.idCat === Number(cat))
                      )
                    );
                  }}
                />
                <p>Max: {max}</p>
              </div>
            </div>
          </aside>
        )}
        <main className={showFilters ? "col-md-9" : "col-md-12"}>
          <div className="card p-3 shadow-sm h-100">
            <h2 className="text-center">Productos</h2>
            {cat && <p className="text-muted">Mostrando productos para la categoría: {cat}</p>}
            {title && <p className="text-muted">Mostrando productos para su búsqueda: {title}</p>}
            <div className="row g-3 mt-3">
              {filteredProds.length > 0 ? (
                filteredProds.map((p) => (
                  <div key={p.id} className="col-16">
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <p className="text-center text-danger">No hay productos disponibles.</p>
              )}
            </div>
          </div>
        </main>
      </div>
      
    </div>
  );
};

export default ViewProducts;