import React, { useState, useEffect, useCallback } from "react";
import { FaEye } from "react-icons/fa"; // Ícono de vista de detalles
import { NavBarUser } from "../Components/NavBarUser"; // Asumiendo que ya tienes NavBarUser
import { useDataContext } from "../Context/dataContext";
import axios from "axios";

// Importar las banderas
import spainFlag from "../Assets/Images/spain.png";
import usaFlag from "../Assets/Images/usa.png";
import germanyFlag from "../Assets/Images/germany.png";
import colombiaFlag from "../Assets/Images/colombia.png";
import argentinaFlag from "../Assets/Images/argentina.png";
import panamaFlag from "../Assets/Images/panama.png";
import venezuelaFlag from "../Assets/Images/venezuela.png";
import brasilFlag from "../Assets/Images/square.png";
import peruFlag from "../Assets/Images/peru.png";
import chileFlag from "../Assets/Images/chile.png";

// Mapa de banderas
const flagMap = {
  VES: venezuelaFlag,
  USD: usaFlag,
  COP: colombiaFlag,
  CLP: chileFlag,
  PEN: peruFlag,
  BRL: brasilFlag,
};

function Movements() {
  const { infoTkn, url } = useDataContext();
  const [activeTab, setActiveTab] = useState("all");
  const [userMovemments, setUserMovemments] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState(null); // Estado para el movimiento seleccionado

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Fetch de datos del usuario
  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });

      const responseMovemments = await axios.get(
        `${url}/Movements/user/${response.data.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUserMovemments(responseMovemments.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, url]);

  // Filtrado según la pestaña activa
  const filteredTransactions = userMovemments.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.mov_status === activeTab;
  });

  useEffect(() => {
    fetchDataUser();
  }, [fetchDataUser]);

  // Función para manejar el detalle del movimiento seleccionado
  const showDetails = (transaction) => {
    setSelectedMovement(transaction);
  };

  // Función para cerrar el modal
  const closeDetails = () => {
    setSelectedMovement(null);
  };

  return (
    <div className="movements">
      <NavBarUser />

      {/* Pestañas */}
      <div className="movements__tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          Todas
        </button>
        <button
          className={`tab ${activeTab === "V" ? "active" : ""}`}
          onClick={() => handleTabChange("V")}
        >
          Aprobada
        </button>
        <button
          className={`tab ${activeTab === "R" ? "active" : ""}`}
          onClick={() => handleTabChange("R")}
        >
          Rechazada
        </button>
        <button
          className={`tab ${activeTab === "E" ? "active" : ""}`}
          onClick={() => handleTabChange("E")}
        >
          En espera
        </button>
      </div>

      {/* Tabla de Movimientos */}
      <div className="table-responsive">
        <table className="movements__table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.mov_id}>
                <td>{transaction.mov_date}</td>
                <td>{transaction.mov_type}</td>
                <td>
                  {transaction.mov_amount}{" "}
                  <img
                    src={flagMap[transaction.mov_currency] || spainFlag}
                    alt={transaction.mov_currency}
                    style={{ width: "20px", height: "20px" }} // Ajusta el tamaño de la bandera
                  />
                </td>
                <td className={transaction.mov_status.toLowerCase()}>
                  {transaction.mov_status === "E"
                    ? "En espera"
                    : transaction.mov_status === "V"
                    ? "Aprobada"
                    : "Rechazada"}
                </td>
                <td>
                  <FaEye
                    className="view-details-icon"
                    onClick={() => showDetails(transaction)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para detalles del movimiento */}
      {selectedMovement && (
        <div className="modal-overlay fadeIn" style={{justifyContent: 'center'}}>
          <div className="modal-content fadeIn">
            <button className="modal-close" onClick={closeDetails}>
              &times;
            </button>
            <h2>Detalles del Movimiento</h2>
            <div className="modal-details">
              <p>
                <strong>ID:</strong> {selectedMovement.mov_id}
              </p>
              <p>
                <strong>Tipo:</strong> {selectedMovement.mov_type}
              </p>
              <p>
                <strong>Monto:</strong> {selectedMovement.mov_amount}{" "}
                {selectedMovement.mov_currency}
              </p>
              <p>
                <strong>Estado:</strong> {selectedMovement.mov_status}
              </p>
              <p>
                <strong>Fecha:</strong> {selectedMovement.mov_date}
              </p>
              <p>
                <strong>Comentario:</strong> {selectedMovement.mov_comment}
              </p>
              <p>
                <strong>Referencia:</strong> {selectedMovement.mov_ref}
              </p>
              {selectedMovement.mov_img && selectedMovement.mov_img.toLowerCase().includes('.pdf') && (
                    <a
                        href={`${url}/Movements/image/${selectedMovement.mov_img}`}
                        target="_blank"
                        rel="noreferrer"
                        download
                        style={{ color: "blue", textDecoration: "underline" }}
                    >
                        Descargar PDF
                    </a>
                )}
                {selectedMovement.mov_img && !selectedMovement.mov_img.toLowerCase().includes('.pdf') && (
                    <img
                        style={{ width: '50%'}} // Asegura que la imagen no se salga del modal
                        alt="ImageMovement"
                        src={`${url}/Movements/image/${selectedMovement.mov_img}`}
                    />
                )}
                {!selectedMovement.mov_img && (
                    <p>No hay documento adjunto.</p>
                )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Movements };
