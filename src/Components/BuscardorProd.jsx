import { useState } from "react";
import Modal from "react-modal";

const BuscadorProd = ({ setSaleProds ,products }) => {
  const [filteredProducts, setFilteredProductos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProducts, setSelectedProducts] = useState([]);


  const handleSearch = (e) => {
    setFilteredProductos(
      products.filter((product) =>
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
          setFilteredProductos(products);
        }}
        className="btn btn-primary"
      >
        Agregar Producto
      </button>
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <h2>Seleccionar Productos</h2>
        <input
          type="text"
          placeholder="Buscar products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(e);
            }
          }}
        />
          <table className="table table-bordered" style={{ marginTop: "20px" }}>
            <thead className="table">
              <tr>
                <th></th>
                <th>ID</th>
                <th>Titulo</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
        {filteredProducts.map((product) => (
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
            setFilteredProductos(products);
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
