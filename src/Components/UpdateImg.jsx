import React, { useState } from 'react';
import Modal from "react-modal"

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
        
      </Modal>
    );
};

export default UpdateProd;