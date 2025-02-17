import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";


const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-4 mt-5"
    style={{ width: "100%", position: "absolute", // Se mantiene abajo sin tapar contenido corto
        bottom: 0, }}>
      <div className="container">
        <p className="mb-2">© 2024 Pinturería - Todos los derechos reservados</p>
        <div className="d-flex justify-content-center">
          <a href="https://facebook.com" className="text-light fs-4 mx-2" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://instagram.com" className="text-light fs-4 mx-2" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com" className="text-light fs-4 mx-2" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://whatsapp.com" className="text-light fs-4 mx-2" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

