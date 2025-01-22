import { useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import Modal  from "react-modal";
import { URL } from "../utils/config";

const BuscadorProd = () => {
  const [productos, setProductos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchProd = async () => {
      const local = getLocalStorage("products");
      try {
        const response = await fetch(URL + "/Products", { credentials: "include" });
        const data = await response.json();
        console.log("data:",data)
        if (!data) return setProductos(local?.datos || []);
          setLocalStorage( data,"products");
          setProductos(data);
          console.log("productos:",productos);
      } catch (error) {
        console.log(error);
        setProductos(local?.datos || []);
      }
    };

    fetchProd();
  }, []);


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    productos.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleProductSelect = (product) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(product)) {
        return prevSelected.filter((p) => p !== product);
      } else {
        return [...prevSelected, product];
      }
    });
  };

  // const filteredProducts = productos.filter((product) =>
  //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div>
      <button onClick={() =>{setIsOpen(true)
        console.log(productos)
      }}
       className="btn btn-primary">Agregar Producto</button>
      <Modal isOpen={isOpen} onRequestClose={()=> setIsOpen(false)}>
        <h2>Seleccionar Productos</h2>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <ul>
          {productos.map((product) => (
            <li key={product.id}>
              <label>
                <input
                  type="checkbox"
                  checked={() => selectedProducts.includes(product)}
                  unchecked={() => selectedProducts.filter((p) => p.id !== product.id)}
                  onChange={() => handleProductSelect(product)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleProductSelect(product);
                  }}
                />
              </label>
              <p>Nombre: {product.description}</p>
            </li>
          ))}
        </ul>
        <button onClick={()=> setIsOpen(false)}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default BuscadorProd;
