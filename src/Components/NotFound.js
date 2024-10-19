import React from "react";
import { Link } from "react-router-dom";
import { FaRoad } from "react-icons/fa"; // Icono de react-icons

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <FaRoad className="road-icon" />
        <h1>404</h1>
        <h2>Oops, parece que te has perdido</h2>
        <p>Lo sentimos, no podemos encontrar la página que buscas.</p>
        <Link to="/" className="back-home-btn">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export  {NotFound};
