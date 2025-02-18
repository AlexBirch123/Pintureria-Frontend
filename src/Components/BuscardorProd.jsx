import { useState } from "react";
import Modal from "react-modal";

const BuscadorProd = ({ setSaleProds ,productos, }) => {
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProducts, setSelectedProducts] = useState([]);


  const handleSearch = (e) => {
    setFilteredProductos(
      productos.filter((product) =>
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleProductSelect = (product) => {
    if (selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleAddProduct = () => {
    selectedProducts.forEach((product) => {
      setSaleProds((prevSaleProds) => {
        if (prevSaleProds.some((p) => p.idProduct === product.id)) {
          return prevSaleProds;
        }
        return [
          ...prevSaleProds,
          {
            idSale: 0,
            idProduct: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            stock: product.stock,
            total: product.price,
          },
        ];
      });
    });
  };


  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
          setFilteredProductos(productos);
        }}
        className="btn btn-primary"
      >
        Agregar Producto
      </button>
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <h2>Seleccionar Productos</h2>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log(searchTerm);
              handleSearch(e);
            }
          }}
        />
          <table className="table table-bordered" style={{ marginTop: "20px" }}>
            <thead className="table">
              <tr>
                <th></th>
                <th>ID</th>
                <th>Descripcion</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
        {filteredProductos.map((product) => (
              <tr key={product.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product)}
                    onChange={() => {
                      handleProductSelect(product);
                    }}
                  />
                </td>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
              </tr>
          ))}
            </tbody>
          </table>
        <button
          onClick={() => {
            setIsOpen(false);
            handleAddProduct();
            setSelectedProducts([]);
            setFilteredProductos(productos);
            setSearchTerm("");
          }}
        >
          Cerrar
        </button>
      </Modal>
    </div>
  );
};

export default BuscadorProd;
