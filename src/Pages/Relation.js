import React, { useState, useEffect, useCallback } from "react";
import NavBarAdmin from "../Components/NavBarAdmin";
import { FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import { NotFound } from "../Components/NotFound";

// Importar las banderas
import usaFlag from "../Assets/Images/usa.png";
import colombiaFlag from "../Assets/Images/colombia.png";
import argentinaFlag from "../Assets/Images/argentina.png";
import panamaFlag from "../Assets/Images/panama.png";
import venezuelaFlag from "../Assets/Images/venezuela.png";
import brasilFlag from "../Assets/Images/square.png";
import peruFlag from "../Assets/Images/peru.png";
import chileFlag from "../Assets/Images/chile.png";
import ecuadorFlag from "../Assets/Images/ecuador.png";

function Relation() {
  const { loggedAdm, infoTkn, url } = useDataContext();

  let totalDeposito = 0;
  let totalRetiro = 0;

  // Datos de Movimientos
  const [movements, setMovements] = useState([]);
  const [efectivoData, setEfectivoData] = useState([]);

  // Datos de Totales
  const [totalEur, setTotalEur] = useState(0);
  const [totalUsd, setTotalUsd] = useState(0);
  const [totalGbp, setTotalGbp] = useState(0);

  // Datos de Usuarios
  const [users, setUsers] = useState([]);

  // Mapa de banderas
  const flagMap = {
    "Argentina": argentinaFlag,
    "Colombia": colombiaFlag,
    "Panamá": panamaFlag,
    "Venezuela": venezuelaFlag,
    "Brasil": brasilFlag,
    "Perú": peruFlag,
    "Chile": chileFlag,
    "Ecuador": ecuadorFlag,
    "Estados Unidos": usaFlag,
  };

  // Estado de filtro
  const [filtro, setFiltro] = useState("TODOS");
  const [tipoMovimiento, setTipoMovimiento] = useState("TODOS");
  const [fechaFiltro, setFechaFiltro] = useState("");

  // Fetch de datos Movements
  const fetchDataMovemments = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Movements`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setMovements(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setMovements, infoTkn, url]);

  // Fetch de datos de Usuarios
  const fetchDataUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/users`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [infoTkn, setUsers, url]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFechaFiltro(today);

    fetchDataMovemments();
    fetchDataUsers();
  }, [fetchDataMovemments, fetchDataUsers]);

  return loggedAdm ? (
    <div className="relation-dashboard">
      <div className="dashboard-content">
        <NavBarAdmin />
        <h2 className="section-title">Relación de Recargas y Retiros</h2>

        {/* Filtro de Fecha */}
        <div className="date-filter">
          <label htmlFor="fecha">Filtrar por Fecha:</label>
          <input
            type="date"
            id="fecha"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>

        {/* Botones de Filtro */}
        <div className="filter-buttons">
          <button
            className={tipoMovimiento === "Deposito" ? "active" : ""}
            onClick={() => {
              setTipoMovimiento("Deposito");
              setFiltro("TODOS"); // Resetea el filtro de divisa
            }}
          >
            Deposito
          </button>
          <button
            className={tipoMovimiento === "Retiro" ? "active" : ""}
            onClick={() => {
              setTipoMovimiento("Retiro");
              setFiltro("TODOS"); // Resetea el filtro de divisa
            }}
          >
            Retiro
          </button>
          <button
            className={filtro === "EUR" ? "active" : ""}
            onClick={() => {
              setFiltro("EUR");
              setTipoMovimiento("Retiro"); // Asegúrate de filtrar solo retiros para EUR
            }}
          >
            Retiro de Euros
          </button>
          <button
            className={filtro === "USD" ? "active" : ""}
            onClick={() => {
              setFiltro("USD");
              setTipoMovimiento("Retiro"); // Asegúrate de filtrar solo retiros para USD
            }}
          >
            Retiro de Dólares
          </button>
          <button
            className={filtro === "GBP" ? "active" : ""}
            onClick={() => {
              setFiltro("GBP");
              setTipoMovimiento("Retiro"); // Asegúrate de filtrar solo retiros para GBP
            }}
          >
            Retiro de Libras
          </button>
          <button
            className={filtro === "TODOS" ? "active" : ""}
            onClick={() => {
              setFiltro("TODOS");
              setTipoMovimiento("TODOS"); // Muestra todo si se selecciona "TODOS"
            }}
          >
            Ver Todo
          </button>
        </div>

        {/* Tabla de Recargas y Retiros */}
        <div className="transactions-section">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Recarga del Día</th>
                <th>Retirada del Día</th>
                {tipoMovimiento === "Retiro" && <th>Valor de la Tasa</th>}
                <th>Pais</th>
                <th>Moneda</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movements.length > 0 ? (
                movements
                  .filter((mov) => {
                    const isMatchingType = tipoMovimiento === "TODOS" || mov.mov_type === tipoMovimiento;
                    const isMatchingCurrency = filtro === "TODOS" || mov.mov_oldCurrency === filtro;
                    return isMatchingType && isMatchingCurrency && mov.mov_date.slice(0, 10) === fechaFiltro && mov.mov_status === "V";
                  })
                  .map((movement, index) => {
                    let deposito = 0;
                    let retiro = 0;

                    if (movement.mov_type === "Deposito") {
                      deposito = movement.mov_amount;
                      totalDeposito += deposito;
                    } else if (movement.mov_type === "Retiro") {
                      retiro = movement.mov_amount;
                      totalRetiro += retiro;
                    }

                    return (
                      <tr key={index}>
                        <td>
                          {movement.User.use_name} {movement.User.use_lastName}
                        </td>
                        <td
                          {...(movement.mov_type === "Deposito" ? { style: { color: "green" } } : null)}
                        >
                          {movement.mov_type === "Deposito"
                            ? `${
                                movement.mov_currency === "EUR"
                                  ? "€"
                                  : movement.mov_currency === "USD"
                                  ? "$"
                                  : movement.mov_currency === "GBP"
                                  ? "£"
                                  : ""
                              } ${totalDeposito} (${deposito})`
                            : `${totalDeposito} (0)`}
                        </td>
                        <td
                          {...(movement.mov_type === "Retiro" ? { style: { color: "red" } } : null)}
                        >
                          {movement.mov_currency === "EUR"
                            ? "€"
                            : movement.mov_currency === "USD"
                            ? "$"
                            : movement.mov_currency === "GBP"
                            ? "£"
                            : ""}{" "}
                          {movement.mov_type === "Retiro"
                            ? `${totalRetiro} (${retiro})`
                            : `${totalRetiro} (0)`}
                        </td>
                        {tipoMovimiento === "Retiro" && <td>{movement.mov_currencyPrice}</td>}
                        <td>
                          {movement.AccountsBsUser ? (
                            <>
                              {movement.AccountsBsUser.accbsUser_country}{" "}
                              <img
                                src={
                                  flagMap[movement.AccountsBsUser.accbsUser_country]
                                }
                                alt={movement.AccountsBsUser.accbsUser_country}
                                style={{ width: "20px" }} // Ajusta el tamaño según sea necesario
                              />
                            </>
                          ) : movement.mov_typeOutflow === "efectivo" ? (
                            <>
                              Efectivo{" "}
                              <img
                                src={venezuelaFlag}
                                alt="Venezuela Flag"
                                style={{ width: "20px" }} // Ajusta el tamaño según sea necesario
                              />
                            </>
                          ) : null}
                        </td>
                        <td>{movement.mov_oldCurrency}</td>
                        <td>{movement.mov_date}</td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan="7">No hay movimientos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <NotFound />
  );
}

export  {Relation};
