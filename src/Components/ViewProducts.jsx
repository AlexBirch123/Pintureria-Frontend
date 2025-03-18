import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getLocalStorage,setLocalStorage } from '../utils/localStorage';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewProducts = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const description = queryParams.get('description');
  const [filteredProds,setFilteredProds]= useState([])
  const [cat, setCat] = useState(category);
  const [products, setProducts] = useState([]);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
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
          } catch (error) {
            setState(local.datos);
          }
        };

    fetchData("/products", "products", setProducts);
    fetchData("/category", "category", setCategories);
  }, []);

  useEffect(() => {
    setCat(category)
    handleFilteredProds();
  }, [category, products, description]);

  const handleFilteredProds = () => {
    if(!products) return setFilteredProds([])
      else{
    if (cat) {
      const prods = products.filter((p) => p.idCat === Number(cat));
      setFilteredProds(prods);
      setMaxMin(prods);
      return
    }
    if (description) {
      const prods = products.filter((p) => p.description.toLowerCase().includes(description.toLowerCase()));
      setFilteredProds(prods);
      setMaxMin(prods);
      return
    }
    setFilteredProds(products);
    setMaxMin(products);
      }
  };

  const setMaxMin = (prods) => {
    if (!Array.isArray(prods) ||prods.length === 0) {
      setMax(0)
      setMin(0)
      return
    };
    setMax(Math.max(...prods.map(p => p.price)));
    setMin(Math.min(...prods.map(p => p.price)));
  };

  // const searchCat = () => {
  //   if (!cat) return false;
  //   const categoria = categories.find((p) => p.id === cat);
  //   return categoria.description;
  // };

  const [showFilters, setShowFilters] = useState(window.innerWidth > 768);

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
            {cat && <p className="text-muted">Mostrando products para la categoría: {cat}</p>}
            {description && <p className="text-muted">Mostrando products para su búsqueda: {description}</p>}
            <div className="row g-3 mt-3">
              {filteredProds.length > 0 ? (
                filteredProds.map((p) => (
                  <div key={p.id} className="col-16">
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <p className="text-center text-danger">No hay products disponibles.</p>
              )}
            </div>
          </div>
        </main>
      </div>
      
    </div>
  );
};

export default ViewProducts;