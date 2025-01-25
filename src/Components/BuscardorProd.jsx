import { useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import Modal from "react-modal";
import { URL } from "../utils/config";

const BuscadorProd = ({ saleProds, setSaleProds ,productos, setProductos}) => {
  // const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);


  //mostrar los productos en el modal
  //al seleccionar un producto se agrega selectedProducts
  //al cerrar el modal se agrega selectedProducts a saleProds

  // useEffect(() => {
  //   const fetchProd = async () => {
  //     const local = getLocalStorage("products");
  //     try {
  //       const response = await fetch(URL + "/Products", {
  //         credentials: "include",
  //       });
  //       const data = await response.json();
  //       if (!data) return setProductos(local?.datos || []);
  //       setLocalStorage(data, "products");
  //       setProductos(data);
  //       setFilteredProductos(productos);
  //     } catch (error) {
  //       console.log(error);
  //       setProductos(local?.datos || []);
  //     }
  //   };

  //   fetchProd();
  // }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
            description: product.description,
            price: product.price,
            amount: 1,
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
          onChange={handleSearch}
        />
        {filteredProductos.map((product) => (
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
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
              </tr>
            </tbody>
          </table>
        ))}
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
