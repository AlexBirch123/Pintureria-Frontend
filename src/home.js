import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import CategoryCard from './Components/CategoryCard';
import { getLocalStorage,setLocalStorage } from './utils/localStorage';
import './App.css';
import carru2 from "./utils/images/carru2.jpg"
import carru3 from "./utils/images/carru3.jpg"
import frente from "./utils/images/frente.jpg"
/**
 * Componente Home que obtiene y muestra categorías junto con un carrusel y una barra de navegación.
 *
 * @component
 * @example
 * return (
 *   <Home />
 * )
 * @returns {JSX.Element} El componente renderizado.
 *
 * @description
 * Este componente obtiene datos de categorías de un servidor remoto y los almacena en el almacenamiento local.
 * Muestra una barra de navegación, un carrusel con tres diapositivas y una lista de tarjetas de categoría.
 *
 * @function
 * @name Home
 */
function Home() {
  const [categorias, setcategorias]= useState([]) 

  useEffect(()=>{
    const fetchcat = async () => {
          const local = getLocalStorage("category");
          try {
            await fetch(process.env.REACT_APP_API_URL + "/category", { credentials: "include" })
              .then((res) => res.json())
              .then((data) => {
                if (!data) {if(local) return setcategorias(local.datos);}
                setcategorias(data);
                setLocalStorage(data, "category");
              });
          } catch (error) {
            console.log(error);
          }
        };
      fetchcat()
  },[])

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      textAlign: "center",
      width: "100%", 
    }}>
      <Carousel
        style={{
          maxHeight: "500px",
          marginTop: "5%",
          backgroundColor: "black",
          width: "97%", // ✅ Hace que el carrusel no sea demasiado ancho
        }}
      >
          <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={frente}
                    alt="First slide"
                    style={{ height: "500px", objectFit: "cover", background: "white" }}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={carru2}
                    alt="Second slide"
                    style={{ height: "500px", objectFit: "cover", background: "white" }}
                  />
                  <Carousel.Caption style={{top: "50%", transform: "translateY(-50%)"}}>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={carru3}
                    alt="Third slide"
                    style={{ height: "500px", objectFit: "contain", background: "white" }}
                  />
                </Carousel.Item>
              </Carousel>
    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
    {categorias.map((category) => (
      <div style={{margin:"10px" , cursor:"pointer"}}>
        <CategoryCard category={category} />
      </div>
    ))}
    </div>
    </div>
  );
}

export default Home;




