import React, { useState } from 'react';

const UpdateProd = ({ product }) => {
    const [formData, setFormData] = useState({
        sku: product.sku || '',
        description: product.description || '',
        title: product.title || '',
        imgUrl: product.imgUrl || '',
        stock: product.stock || '',
        idProv: product.idProv || '',
        idCat: product.idCat || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
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
                <th>Titulo</th>
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
    );
};

export default UpdateProd;