import React, { useState, useEffect, useCallback } from "react";
import { FaEye } from "react-icons/fa"; // Ícono de vista de detalles
import { NavBarUser } from "../Components/NavBarUser"; // Asumiendo que ya tienes NavBarUser
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import { Redirect } from "react-router-dom";

// Importar las banderas
import spainFlag from "../Assets/Images/spain.png";
import usaFlag from "../Assets/Images/usa.png";
// import germanyFlag from "../Assets/Images/germany.png";
import colombiaFlag from "../Assets/Images/colombia.png";
import argentinaFlag from "../Assets/Images/argentina.png";
import panamaFlag from "../Assets/Images/panama.png";
import venezuelaFlag from "../Assets/Images/venezuela.png";
import brasilFlag from "../Assets/Images/square.png";
import peruFlag from "../Assets/Images/peru.png";
import chileFlag from "../Assets/Images/chile.png";
import ukFlag from "../Assets/Images/uk.png";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";

// Mapa de banderas
const flagMap = {
  BS: venezuelaFlag,
  USD: usaFlag,
  COP: colombiaFlag,
  CLP: chileFlag,
  PEN: peruFlag,
  BRL: brasilFlag,
  ARS: argentinaFlag,
  "USD-PA": panamaFlag,
  EUR: spainFlag,
  GBP: ukFlag,
};

function Movements() {
  useAxiosInterceptors();
  const { logged, infoTkn, url } = useDataContext();
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

  return logged ? (
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
              <th>Referencia</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.reverse().map((transaction) => (
              <tr key={transaction.mov_id}>
                <td>{transaction.mov_date}</td>
                <td>{transaction.mov_ref}</td>
                <td>{transaction.mov_type}</td>
                <td
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "20px",
                  }}
                >
                  <span style={{ textAlign: "start" }}>
                    {transaction.mov_amount}{" "}
                    {transaction.mov_type === "Deposito"
                      ? null
                      : "(" +
                        transaction.mov_oldAmount +
                        " " +
                        transaction.mov_oldCurrency +
                        ")"}
                  </span>
                  <img
                    src={flagMap[transaction.mov_currency] || spainFlag}
                    alt={transaction.mov_currency}
                    style={{ width: "20px", height: "20px", right: "0" }} // Ajusta el tamaño de la bandera
                  />
                </td>
                <td className={transaction.mov_status.toLowerCase()}>
                  {transaction.mov_status === "E" ? (
                    <div class="tooltip">
                      En espera
                      <span class="tooltiptext">
                        Tu transferencia esta en proceso de verificación
                      </span>
                    </div>
                  ) : transaction.mov_status === "V" ? (
                    "Aprobada"
                  ) : (
                    "Rechazada"
                  )}
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
  <div className="modal-overlay fadeIn" style={{ zIndex: 2000 }}>
    <div className="modal-content fadeIn">
      <h2>Detalles del Movimiento</h2>
      <button className="modal-close" onClick={closeDetails}>
        &times;
      </button>
      <div className="modal-details">
        <p>
          <strong>Referencia:</strong> {selectedMovement.mov_ref}
        </p>
        <p>
          <strong>Fecha:</strong> {selectedMovement.mov_date}
        </p>
        <p>
          <strong>Monto:</strong> {selectedMovement.mov_amount}{" "}
          {selectedMovement.mov_currency}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          {selectedMovement.mov_status === "E"
            ? "En espera"
            : selectedMovement.mov_status === "V"
            ? "Aprobada"
            : "Rechazada"}
        </p>

        {/* Condición para mostrar detalles de la transferencia o el comentario */}
        {selectedMovement.mov_typeOutflow === "transferencia" ? (
          <div>
            <p>
              <strong>Banco:</strong> {selectedMovement.AccountsBsUser.accbsUser_bank}
            </p>
            <p>
              <strong>Propietario:</strong> {selectedMovement.AccountsBsUser.accbsUser_owner}
            </p>
            <p>
              <strong>Número de cuenta o Pago Movil:</strong>{" "}
              {selectedMovement.AccountsBsUser.accbsUser_number
                ? selectedMovement.AccountsBsUser.accbsUser_number
                : selectedMovement.AccountsBsUser.accbsUser_phone}
            </p>
            <p>
              <strong>DNI:</strong> {selectedMovement.AccountsBsUser.accbsUser_dni}
            </p>
          </div>
        ) : (
          // Mostrar el comentario si no es una transferencia
          <p
            dangerouslySetInnerHTML={{
              __html: selectedMovement.mov_comment
                ? selectedMovement.mov_comment.replace(/\n/g, "<br/>")
                : "Sin comentarios disponibles.",
            }}
          />
        )}

        {/* Mostrar imagen si está disponible */}
        {selectedMovement.mov_img &&
          !selectedMovement.mov_img.toLowerCase().includes(".pdf") && (
            <img
              className="modal-image"
              alt="ImageMovement"
              src={`${url}/Movements/image/${selectedMovement.mov_img}`}
            />
          )}
        {!selectedMovement.mov_img && <p>No hay documento adjunto.</p>}
      </div>
    </div>
  </div>
)}

    </div>
  ) : (
    <Redirect to="/Login" />
  );
}

export { Movements };
