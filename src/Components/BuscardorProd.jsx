import { useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import { Modal } from "bootstrap";

const BuscadorProd = () => {
  //   const [formVisible, setFormVisible] = useState(false);
  //   const [tableVisible, setTableVisible] = useState(true);
  //   const [rowsSale, setRowsSale] = useState([]);
  const [productos, setProductos] = useState([]);
  // const [empleados, setEmpleados] = useState([]);
  //   const [clientes, setClientes] = useState([]);
  //   const [sucursales, setSucursales] = useState([]);
  const [isOpen, setlIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  //   const clienteRef = useRef(null);
  //   const empleadoRef = useRef(null);
  //   const sucursalRef = useRef(null);
  //   const totalRef = useRef(null);

  useEffect(() => {
    fetchProd();
  }, []);

  const fetchProd = async () => {
    const local = getLocalStorage("products");
    try {
      await fetch(URL + "/Products", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (!data) return setProductos(local.datos);
          setProductos(data);
          setLocalStorage("products", data);
        });
    } catch (error) {
      console.log(error);
    }
  };

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

  const filteredProducts = productos.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <button onClick={setlIsOpen(true)} className="btn btn-primary">Agregar Producto</button>
      <Modal isOpen={isOpen} onRequestClose={setlIsOpen(false)}>
        <h2>Seleccionar Productos</h2>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product)}
                  unchecked={selectedProducts.filter(
                    (p) => p.id !== product.id
                  )}
                  onChange={() => handleProductSelect(product)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleProductSelect(product);
                  }}
                />
                {product.name}
              </label>
            </li>
          ))}
        </ul>
        <button onClick={setlIsOpen(false)}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default BuscadorProd;
