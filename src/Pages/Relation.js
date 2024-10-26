import React, { useState, useEffect, useCallback } from "react";
import NavBarAdmin from "../Components/NavBarAdmin";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import { NotFound } from "../Components/NotFound";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";

function Relation() {
  useAxiosInterceptors();
  const { loggedAdm, infoTkn, url } = useDataContext();

  // Datos de Movimientos
  const [movements, setMovements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dailyView, setDailyView] = useState('');

  const getUserDepositRanking = () => {
    return users
      .map((user) => {
        const totalDepositsEur = movements
          .filter(
            (mov) =>
              mov.User.use_id === user.use_id &&
              mov.mov_type === "Deposito" &&
              mov.mov_status === "V" &&
              mov.mov_currency === "EUR" &&
              (!startDate || new Date(mov.mov_date) >= startDate) &&
              (!endDate || new Date(mov.mov_date) <= endDate)
          )
          .reduce((sum, mov) => sum + mov.mov_amount, 0);
  
        const totalDepositsUsd = movements
          .filter(
            (mov) =>
              mov.User.use_id === user.use_id &&
              mov.mov_type === "Deposito" &&
              mov.mov_status === "V" &&
              mov.mov_currency === "USD" &&
              (!startDate || new Date(mov.mov_date) >= startDate) &&
              (!endDate || new Date(mov.mov_date) <= endDate)
          )
          .reduce((sum, mov) => sum + mov.mov_amount, 0);
  
        const totalDepositsGbp = movements
          .filter(
            (mov) =>
              mov.User.use_id === user.use_id &&
              mov.mov_type === "Deposito" &&
              mov.mov_status === "V" &&
              mov.mov_currency === "GBP" &&
              (!startDate || new Date(mov.mov_date) >= startDate) &&
              (!endDate || new Date(mov.mov_date) <= endDate)
          )
          .reduce((sum, mov) => sum + mov.mov_amount, 0);
  
        return { 
          ...user, 
          totalDepositsEur, 
          totalDepositsUsd, 
          totalDepositsGbp 
        };
      })
      .filter((user) => user.totalDepositsEur > 0 || user.totalDepositsUsd > 0 || user.totalDepositsGbp > 0) // Solo usuarios que han hecho depósitos
      .sort((a, b) => b.totalDepositsEur - a.totalDepositsEur); // Ordenar por depósitos en EUR
  };
  
  const getUserSendRanking = () => {
    return users
      .map((user) => {
        const totalRetirosEur = movements
          .filter(
            (mov) =>
              mov.User.use_id === user.use_id &&
              mov.mov_type === "Retiro" &&
              mov.mov_status === "V" &&
              mov.mov_oldCurrency === "EUR" &&
              (!startDate || new Date(mov.mov_date) >= startDate) &&
              (!endDate || new Date(mov.mov_date) <= endDate)
          )
          .reduce((sum, mov) => sum + mov.mov_oldAmount, 0);
  
        const totalRetirosUsd = movements
          .filter(
            (mov) =>
              mov.User.use_id === user.use_id &&
              mov.mov_type === "Retiro" &&
              mov.mov_status === "V" &&
              mov.mov_oldCurrency === "USD" &&
              (!startDate || new Date(mov.mov_date) >= startDate) &&
              (!endDate || new Date(mov.mov_date) <= endDate)
          )
          .reduce((sum, mov) => sum + mov.mov_oldAmount, 0);
  
        const totalRetirosGbp = movements
          .filter(
            (mov) =>
              mov.User.use_id === user.use_id &&
              mov.mov_type === "Retiro" &&
              mov.mov_status === "V" &&
              mov.mov_oldCurrency === "GBP" &&
              (!startDate || new Date(mov.mov_date) >= startDate) &&
              (!endDate || new Date(mov.mov_date) <= endDate)
          )
          .reduce((sum, mov) => sum + mov.mov_oldAmount, 0);
  
        return { 
          ...user, 
          totalRetirosEur, 
          totalRetirosUsd, 
          totalRetirosGbp 
        };
      })
      .filter((user) => user.totalRetirosEur > 0 || user.totalRetirosUsd > 0 || user.totalRetirosGbp > 0) // Solo usuarios que han hecho retiros
      .sort((a, b) => b.totalRetirosEur - a.totalRetirosEur); // Ordenar por retiros en EUR
  };
  

  // Función para obtener el ranking de depósitos del día
  const getDailyDepositRanking = () => {
    const today = new Date().toISOString().split("T")[0];

    return users
      .map((user) => {
        const totalDeposits = movements
          .filter(
            (mov) =>
              mov.User.use_id === user.use_id &&
              mov.mov_type === "Deposito" &&
              mov.mov_status === "V" &&
              mov.mov_date.startsWith(today) // Filtrar por fecha de hoy
          )
          .reduce((sum, mov) => sum + mov.mov_amount, 0);

        return { ...user, totalDeposits };
      })
      .filter((user) => user.totalDeposits > 0) // Solo usuarios que han hecho depósitos
      .sort((a, b) => b.totalDeposits - a.totalDeposits); // Ordenar de mayor a menor
  };

  // Datos de Usuarios
  const [users, setUsers] = useState([]);
  const usersWithPositiveBalance = users.filter(
    (user) =>
      user.use_amountUsd > 0 || user.use_amountEur > 0 || user.use_amountGbp > 0
  );

  // Mapa de banderas
  const flagMap = {
    Argentina: argentinaFlag,
    Colombia: colombiaFlag,
    Panamá: panamaFlag,
    venezuela: venezuelaFlag,
    Venezuela: venezuelaFlag,

    Brasil: brasilFlag,
    Perú: peruFlag,
    Chile: chileFlag,
    Ecuador: ecuadorFlag,
    Usa: usaFlag,
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

  // Función para calcular los totales
  const calcularTotales = () => {
    let totalDepositoEur = 0;
    let totalDepositoUsd = 0;
    let totalDepositoGbp = 0;
    let totalRetiroBolivares = 0;
    let totalRetiroArs = 0;
    let totalRetiroCop = 0;
    let totalRetiroClp = 0;
    let totalRetiroPen = 0;
    let totalRetiroEcu = 0;
    let totalRetiroPan = 0;
    let totalRetiroBrl = 0;
    let totalRetiroMex = 0;
    let totalRetiroUsd = 0;
    let totalRetiroEur = 0;

    movements
      .filter(
        (mov) =>
          mov.mov_date.slice(0, 10) === fechaFiltro && mov.mov_status === "V"
      )
      .forEach((mov) => {
        if (mov.mov_type === "Deposito") {
          if (mov.mov_currency === "EUR") {
            totalDepositoEur += mov.mov_amount;
          } else if (mov.mov_currency === "USD") {
            totalDepositoUsd += mov.mov_amount;
          } else if (mov.mov_currency === "GBP") {
            totalDepositoGbp += mov.mov_amount;
          }
        } else if (mov.mov_type === "Retiro") {
          if (mov.mov_oldCurrency === "EUR") {
            totalRetiroEur += mov.mov_oldAmount;
          } else if (mov.mov_currency === "BS") {
            totalRetiroBolivares += mov.mov_amount;
          } else if (mov.mov_currency === "ARS") {
            totalRetiroArs += mov.mov_amount;
          } else if (mov.mov_currency === "COP") {
            totalRetiroCop += mov.mov_amount;
          } else if (mov.mov_currency === "CLP") {
            totalRetiroClp += mov.mov_amount;
          } else if (mov.mov_currency === "PEN") {
            totalRetiroPen += mov.mov_amount;
          } else if (mov.mov_currency === "USD-ECU") {
            totalRetiroEcu += mov.mov_amount;
          } else if (mov.mov_currency === "USD-PAN") {
            totalRetiroPan += mov.mov_amount;
          } else if (mov.mov_currency === "BRL") {
            totalRetiroBrl += mov.mov_amount;
          } else if (mov.mov_currency === "MEX") {
            totalRetiroMex += mov.mov_amount;
          } else if (mov.mov_currency === "USD") {
            totalRetiroUsd += mov.mov_amount;
          }
        }
      });

    return {
      totalDepositoEur,
      totalDepositoUsd,
      totalDepositoGbp,
      totalRetiroBolivares,
      totalRetiroArs,
      totalRetiroCop,
      totalRetiroClp,
      totalRetiroPen,
      totalRetiroEcu,
      totalRetiroPan,
      totalRetiroBrl,
      totalRetiroEur,
      totalRetiroMex,
      totalRetiroUsd,
      

    };
  };

  const {
    totalDepositoEur,
    totalDepositoUsd,
    totalDepositoGbp,
    totalRetiroBolivares,
    totalRetiroArs,
    totalRetiroCop,
    totalRetiroClp,
    totalRetiroPen,
    totalRetiroEcu,
    totalRetiroPan,
    totalRetiroBrl,
    totalRetiroMex,
    totalRetiroUsd,
    totalRetiroEur
  } = calcularTotales();

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
                {(tipoMovimiento === "Retiro" ||
                  tipoMovimiento === "TODOS") && <th>Valor de la Tasa</th>}
                {(tipoMovimiento === "Retiro" ||
                  tipoMovimiento === "TODOS") && <th>Pais</th>}
                {(tipoMovimiento === "Retiro" ||
                  tipoMovimiento === "TODOS") && <th>Moneda</th>}
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movements.length > 0 ? (
                movements
                  .filter((mov) => {
                    const isMatchingType =
                      tipoMovimiento === "TODOS" ||
                      mov.mov_type === tipoMovimiento;
                    const isMatchingCurrency =
                      filtro === "TODOS" || mov.mov_oldCurrency === filtro;
                    return (
                      isMatchingType &&
                      isMatchingCurrency &&
                      mov.mov_date.slice(0, 10) === fechaFiltro &&
                      mov.mov_status === "V"
                    );
                  })
                  .map((movement, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {movement.User.use_name} {movement.User.use_lastName}
                        </td>
                        <td
                          {...(movement.mov_type === "Deposito"
                            ? { style: { color: "green" } }
                            : null)}
                        >
                          {movement.mov_type === "Deposito"
                            ? `${movement.mov_currency === "EUR"
                              ? "€"
                              : movement.mov_currency === "USD"
                                ? "$"
                                : movement.mov_currency === "GBP"
                                  ? "£"
                                  : ""
                            } ${movement.mov_amount}`
                            : 0}
                        </td>
                        <td
                          {...(movement.mov_type === "Retiro"
                            ? { style: { color: "red" } }
                            : null)}
                        >
                          {movement.mov_type === "Retiro"
                            ? `(${movement.mov_oldCurrency} ${movement.mov_oldAmount}) ${movement.mov_currency} ${movement.mov_amount}`
                            : movement.mov_typeOutflow === "efectivo" // Aquí se añade la lógica para Efectivo
                              ? "EFECTIVO"
                              : 0}
                        </td>
                        {(tipoMovimiento === "Retiro" ||
                          tipoMovimiento === "TODOS") && (
                            <td>{movement.mov_currencyPrice}</td>
                          )}
                        {(tipoMovimiento === "Retiro" ||
                          tipoMovimiento === "TODOS") && (
                            <td>
                              {movement.AccountsBsUser ? (
                                <>
                                  {movement.AccountsBsUser.accbsUser_country}{" "}
                                  <img
                                    src={
                                      flagMap[
                                      movement.AccountsBsUser.accbsUser_country
                                      ]
                                    }
                                    alt={
                                      movement.AccountsBsUser.accbsUser_country
                                    }
                                    style={{ width: "20px" }} // Ajusta el tamaño según sea necesario
                                  />
                                </>
                              ) : (
                                <>
                                  {movement.mov_typeOutflow === "efectivo" ? (
                                    <>
                                      Efectivo{" "}
                                      <img
                                        src={venezuelaFlag}
                                        alt="Efectivo"
                                        style={{ width: "20px" }} // Ajusta el tamaño según sea necesario
                                      />
                                    </>
                                  ) : movement.mov_typeOutflow ===
                                    "sendOption" ? (
                                    <>
                                      Retiro
                                      <img
                                        src={usaFlag}
                                        alt="Retiro"
                                        style={{ width: "20px" }} // Ajusta el tamaño según sea necesario
                                      />
                                    </>
                                  ) : null}
                                </>
                              )}
                            </td>
                          )}
                        {(tipoMovimiento === "Retiro" ||
                          tipoMovimiento === "TODOS") && (
                            <td>{movement.mov_oldCurrency}</td>
                          )}
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
        <br />

        {/* Sección de Totales */}
        <h2>Depostios</h2>
        <div className="transactions-section">
          <table className="transactions-table">
            <tr>
              <th>Depósitos en Euros</th>
              <th>Depósitos en Dólares</th>
              <th>Depósitos en Libras</th>
            </tr>
            <tr>
              <td>€ {totalDepositoEur.toFixed(2)}</td>
              <td>$ {totalDepositoUsd.toFixed(2)}</td>
              <td>£ {totalDepositoGbp.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        <br />

        <h2>Retiros</h2>
        <div className="transactions-section">
          <table className="transactions-table">
           
            <tr>
              <td>Bolívares</td>
              <td>Bs {totalRetiroBolivares.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Pesos Argentinos</td>
              <td>ARS {totalRetiroArs.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Pesos Colombianos</td>
              <td>COP {totalRetiroCop.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Pesos Chilenos</td>
              <td>CLP {totalRetiroClp.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Soles Peruanos</td>
              <td>PEN {totalRetiroPen.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Dólares Ecuatorianos</td>
              <td>USD {totalRetiroEcu.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Dólares Panameños</td>
              <td>USD {totalRetiroPan.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Reales Brasileños</td>
              <td>BRL {totalRetiroBrl.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Pesos Mexicanos</td>
              <td>MEX {totalRetiroMex.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Dólares</td>
              <td>USD {totalRetiroUsd.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Retiros en Euros</td>
              <td>€ {totalRetiroEur.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        {/* Botón para abrir el modal */}
        <button onClick={() => setShowModal(true)} className="buttonmodal">
          Mostrar usuarios con saldo positivo
        </button>
        {/* Botón para abrir el modal de ranking de depósitos */}
        <button
          onClick={() => setShowDepositModal(true)}
          className="buttonmodal"
        >
          Mostrar Ranking de Depósitos
        </button>

        {showDepositModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Ranking de Depósitos</h3>
              <button
                className="close-button"
                onClick={() => setShowDepositModal(false)}
              >
                X
              </button>

              {/* Filtros de Fecha */}
              <div className="date-filter">
                <label>Desde:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
                <label>Hasta:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </div>

              <button onClick={() => setDailyView('Total')}>
                Total Depósitos
              </button>
              <button onClick={() => setDailyView('DepósitosDaily')}>
                Depósitos del Día
              </button>
              <button onClick={() => setDailyView('RetirosDaily')}>
                Retiros totales del Día
              </button>

              {/* Tabla de ranking */}
              <table className="deposit-ranking-table">
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Total Depósitos (EUR)</th>
      <th>Total Depósitos (USD)</th>
      <th>Total Depósitos (GBP)</th>
    </tr>
  </thead>
  <tbody>
    {(dailyView === "DepósitosDaily"
      ? getDailyDepositRanking()
      : dailyView === "Total" ? getUserDepositRanking()
        : getUserSendRanking()
    ).map((user, index) => (
      <tr key={index}>
        <td>{`${user.use_name} ${user.use_lastName}`}</td>
        <td>€{(user.totalDepositsEur || 0).toFixed(2)}</td>
        <td>${(user.totalDepositsUsd || 0).toFixed(2)}</td>
        <td>£{(user.totalDepositsGbp || 0).toFixed(2)}</td>
      </tr>
    ))}
  </tbody>
</table>


            </div>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Usuarios con Saldo Positivo</h3>
              {/* Botón para cerrar el modal */}
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                X
              </button>

              {/* Tabla de usuarios con saldo positivo */}
              <table className="positive-balance-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Saldo USD</th>
                    <th>Saldo EUR</th>
                    <th>Saldo GBP</th>
                  </tr>
                </thead>
                <tbody>
                  {usersWithPositiveBalance.length > 0 ? (
                    usersWithPositiveBalance.map((user) => (
                      <tr key={user.id}>
                        <td>
                          {user.use_name} {user.use_lastName}
                        </td>
                        <td>${user.use_amountUsd.toFixed(2)}</td>
                        <td>€{user.use_amountEur.toFixed(2)}</td>
                        <td>£{user.use_amountGbp.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No hay usuarios con saldo positivo</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <NotFound />
  );
}

export { Relation };
