
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import CategoryCard from "./Components/CategoryCard";
import { getLocalStorage, setLocalStorage } from "./utils/localStorage";
import { useMediaQuery } from "react-responsive";
import "./App.css";
import carru2 from "./utils/images/carru2.jpg";
import carru3 from "./utils/images/carru3.jpg";
import frente from "./utils/images/frente.jpg";

function Home() {
  const [categorias, setCategorias] = useState([]);

  // Detectar si el usuario está en móvil
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const fetchCat = async () => {
      const local = getLocalStorage("category");
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + "/category", { credentials: "include" })
        const data = res.json()   
          if (data && res.ok) {
            setCategorias(data);
            setLocalStorage(data, "category");
            return;
          }
          if (local) return setCategorias(local.datos);
          
      } catch (error) {
        console.log(error);
      }
    };
    fetchCat();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: "100%",
        padding: isMobile ? "10px" : "20px",
      }}
    >
      <Carousel
        style={{
          maxHeight: isMobile ? "250px" : "500px",
          marginTop: isMobile ? "10px" : "5%",
          backgroundColor: "black",
          width: isMobile ? "100%" : "97%",
        }}
      >
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={frente}
            alt="First slide"
            style={{ height: isMobile ? "250px" : "500px", objectFit: "cover" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={carru2}
            alt="Second slide"
            style={{ height: isMobile ? "250px" : "500px", objectFit: "cover" }}
          />
          <Carousel.Caption
            style={{
              top: isMobile ? "30%" : "50%",
              transform: "translateY(-50%)",
              padding: isMobile ? "10px" : "20px",
              borderRadius: "10px",
              color: "#000",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? "1.5rem" : "2.5rem",
                fontWeight: "bold",
                textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
              }}
            >
              🎨 Es hora de pintar tu casa
            </h3>
            <p
              style={{
                fontSize: isMobile ? "1rem" : "2rem",
                textShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)",
              }}
            >
              Vení a nuestra sucursal y elegí la gama de colores que más te guste
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={carru3}
            alt="Third slide"
            style={{ height: isMobile ? "250px" : "500px", objectFit: "contain" }}
          />
        </Carousel.Item>
      </Carousel>

      {/* Contenedor de categorías con ajuste responsive */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: isMobile ? "20px" : "40px",
          gap: isMobile ? "5px" : "10px",
        }}
      >
        {categorias.length === 0 && (
          categorias.map((category, index) => (
            <div key={index} style={{ margin: isMobile ? "5px" : "10px", cursor: "pointer" }}>
              <CategoryCard category={category} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;


