import React, { useEffect, useState } from 'react';
import NavBar from './Components/NavBar';
import Carousel from 'react-bootstrap/Carousel';
// import frente from "./utils/frente.jpg"
import CategoryCard from './Components/CategoryCard';
import { getLocalStorage,setLocalStorage } from './utils/localStorage';
import { URL } from './utils/config';
import './App.css';

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
            await fetch(URL + "/category", { credentials: "include" })
              .then((res) => res.json())
              .then((data) => {
                if (!data) return setcategorias(local.datos);
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
    <div>
      <NavBar></NavBar>
      <Carousel style={{ height: '500px',marginTop: "8%" }}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            // src={frente}
            alt="First slide"
            style={{ height: '500px', objectFit: 'cover' , background:"blue"}}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            // src={frente}
            alt="Second slide"
            style={{ height: '500px', objectFit: 'cover', background:"grey" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            // src={frente}
            alt="Third slide"
            style={{ height: '500px', objectFit: 'cover' , background:"red"}}
          />
        </Carousel.Item>
      </Carousel>
    <div style={{ display: 'flex', flexWrap: 'wrap'  }}>
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




