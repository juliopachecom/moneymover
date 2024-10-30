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
import mexico from "../Assets/Images/mexico.png";


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
  const [showModalDepositsAndWithdrawals, setShowModalDepositsAndWithdrawals] = useState(false);
const [dailyDate, setDailyDate] = useState(new Date()); // Fecha por defecto el día actual

const [dailyTotalsByUser, setDailyTotalsByUser] = useState([]);


const [dailyTotalDepositsEur, setDailyTotalDepositsEur] = useState(0);
const [dailyTotalWithdrawalsEur, setDailyTotalWithdrawalsEur] = useState(0);
const [dailyTotalDepositsUsd, setDailyTotalDepositsUsd] = useState(0);
const [dailyTotalWithdrawalsUsd, setDailyTotalWithdrawalsUsd] = useState(0);
const [dailyTotalDepositsGbp, setDailyTotalDepositsGbp] = useState(0);
const [dailyTotalWithdrawalsGbp, setDailyTotalWithdrawalsGbp] = useState(0);

const calculateDailyTotals = (date) => {
  const selectedDate = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  
  // Variables para totales por cada moneda
  let totalDepositsEur = 0;
  let totalWithdrawalsEur = 0;
  let totalDepositsUsd = 0;
  let totalWithdrawalsUsd = 0;
  let totalDepositsGbp = 0;
  let totalWithdrawalsGbp = 0;

  // Crear un mapa para almacenar los depósitos y retiros por usuario y moneda
  const userTotalsMap = new Map();

  movements
    .filter((mov) => mov.mov_status === "V" && mov.mov_date.startsWith(selectedDate))
    .forEach((mov) => {
      if (!userTotalsMap.has(mov.User.use_id)) {
        userTotalsMap.set(mov.User.use_id, {
          user: mov.User,
          depositsEur: 0,
          depositsUsd: 0,
          depositsGbp: 0,
          withdrawalsEur: 0,
          withdrawalsUsd: 0,
          withdrawalsGbp: 0,
        });
      }
      const userData = userTotalsMap.get(mov.User.use_id);

      // Calcular los depósitos por moneda
      if (mov.mov_type === "Deposito") {
        if (mov.mov_currency === "EUR") {
          totalDepositsEur += mov.mov_amount;
          userData.depositsEur += mov.mov_amount;
        } else if (mov.mov_currency === "USD") {
          totalDepositsUsd += mov.mov_amount;
          userData.depositsUsd += mov.mov_amount;
        } else if (mov.mov_currency === "GBP") {
          totalDepositsGbp += mov.mov_amount;
          userData.depositsGbp += mov.mov_amount;
        }
      }

      // Calcular los retiros por moneda
      if (mov.mov_type === "Retiro") {
        if (mov.mov_oldCurrency === "EUR") {
          totalWithdrawalsEur += mov.mov_oldAmount;
          userData.withdrawalsEur += mov.mov_oldAmount;
        } else if (mov.mov_oldCurrency === "USD") {
          totalWithdrawalsUsd += mov.mov_oldAmount;
          userData.withdrawalsUsd += mov.mov_oldAmount;
        } else if (mov.mov_oldCurrency === "GBP") {
          totalWithdrawalsGbp += mov.mov_oldAmount;
          userData.withdrawalsGbp += mov.mov_oldAmount;
        }
      }

      userTotalsMap.set(mov.User.use_id, userData);
    });

  // Actualizar el estado con los totales diarios por moneda
  setDailyTotalDepositsEur(totalDepositsEur);
  setDailyTotalWithdrawalsEur(totalWithdrawalsEur);
  setDailyTotalDepositsUsd(totalDepositsUsd);
  setDailyTotalWithdrawalsUsd(totalWithdrawalsUsd);
  setDailyTotalDepositsGbp(totalDepositsGbp);
  setDailyTotalWithdrawalsGbp(totalWithdrawalsGbp);

  // Convertir el mapa a una lista de usuarios con sus totales
  setDailyTotalsByUser(Array.from(userTotalsMap.values()));
};


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
          totalDepositsGbp,
        };
      })
      .filter(
        (user) =>
          user.totalDepositsEur > 0 ||
          user.totalDepositsUsd > 0 ||
          user.totalDepositsGbp > 0
      ) // Solo usuarios que han hecho depósitos
      .sort((a, b) => b.totalDepositsEur - a.totalDepositsEur); // Ordenar por depósitos en EUR
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
    Panama: panamaFlag,
    venezuela: venezuelaFlag,
    Venezuela: venezuelaFlag,
    

    Brasil: brasilFlag,
    Peru: peruFlag,
    Chile: chileFlag,
    Ecuador: ecuadorFlag,
    Usa: usaFlag,
    Mexico: mexico,
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

  const openDailyModal = () => {
    calculateDailyTotals(dailyDate); // Calcular los totales para la fecha predeterminada (hoy)
    setShowModalDepositsAndWithdrawals(true);
  };

  // Función para calcular los totales
  const calcularTotales = () => {
    let totalDepositoEur = 0;
    let totalDepositoUsd = 0;
    let totalDepositoGbp = 0;

    // Totales de retiros en las monedas originales (EUR, USD, GBP)
    let totalRetiroOriginalEur = 0;
    let totalRetiroOriginalUsd = 0;
    let totalRetiroOriginalGbp = 0;

    // Totales de retiros equivalentes en las monedas nuevas (ARS, COP, CLP, etc.)
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
        (mov) => mov.mov_date.slice(0, 10) === fechaFiltro && mov.mov_status === "V"
      )
      .forEach((mov) => {
        if (mov.mov_type === "Deposito") {
          // Calcular los depósitos según la moneda en el campo mov_currency
          if (mov.mov_currency === "EUR") {
            totalDepositoEur += mov.mov_amount;
          } else if (mov.mov_currency === "USD") {
            totalDepositoUsd += mov.mov_amount;
          } else if (mov.mov_currency === "GBP") {
            totalDepositoGbp += mov.mov_amount;
          }
        } else if (mov.mov_type === "Retiro") {
          // Calcular los retiros utilizando mov_oldCurrency (moneda original)
          if (mov.mov_oldCurrency === "EUR") {
            totalRetiroOriginalEur += mov.mov_oldAmount;
          } else if (mov.mov_oldCurrency === "USD") {
            totalRetiroOriginalUsd += mov.mov_oldAmount;
          } else if (mov.mov_oldCurrency === "GBP") {
            totalRetiroOriginalGbp += mov.mov_oldAmount;
          }

          // Calcular el total equivalente del retiro en la nueva moneda (mov_currency)
          if (mov.mov_currency === "" || mov.mov_currency === "Bs") {
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
          } else if (mov.mov_currency === "EUR") {
            totalRetiroEur += mov.mov_amount;
          }
        }
      });

    return {
      // Depósitos
      totalDepositoEur,
      totalDepositoUsd,
      totalDepositoGbp,

      // Retiros originales (antes de la conversión)
      totalRetiroOriginalEur,
      totalRetiroOriginalUsd,
      totalRetiroOriginalGbp,

      // Retiros equivalentes después de la conversión
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
      totalRetiroEur,
    };
};




  const {
    totalRetiroOriginalEur,
    totalRetiroOriginalUsd,
    totalRetiroOriginalGbp,
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
                            ? `${
                                movement.mov_currency === "EUR"
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
        <h2>Depositos</h2>
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
      <td>Retiros en Euros</td>
      <td>€ {totalRetiroOriginalEur.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Retiros en Dólares </td>
      <td>${totalRetiroOriginalUsd.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Retiros en Libras </td>
      <td>£ {totalRetiroOriginalGbp.toFixed(2)}</td>
    </tr>
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
        {/* Botón para abrir el modal de Depósitos y Retiros del Día */}
<button onClick={openDailyModal} className="buttonmodal">
  Mostrar Depósitos y Retiros del Día
</button>


{showDepositModal && (
  <div className="modal-overlay">
    <div className="deposits-withdrawals-modal">
    <div className="modal-content">
      <h3>Ranking de Depósitos</h3>
      <button
        className="button close-button"
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

      {/* Tabla de ranking de depósitos */}
      <table className="table deposit-ranking-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Total Depósitos (EUR)</th>
            <th>Total Depósitos (USD)</th>
            <th>Total Depósitos (GBP)</th>
          </tr>
        </thead>
        <tbody>
          {getUserDepositRanking().map((user, index) => (
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

{showModalDepositsAndWithdrawals && (
  <div className="modal-overlay">
    <div className="deposits-withdrawals-modal">
  <div className="modal-content">
    <h3>Total de Depósitos y Retiros del Día</h3>
    <button
      className="button close-button"
      onClick={() => setShowModalDepositsAndWithdrawals(false)}
    >
      X
    </button>

    {/* Calendario de filtro de día */}
    <div className="date-filter">
      <label>Seleccionar Día:</label>
      <DatePicker
        selected={dailyDate}
        onChange={(date) => {
          setDailyDate(date);
          calculateDailyTotals(date);
        }}
      />
    </div>

    {/* Mostrar los totales del día por moneda */}
    <div className="totals-section">
      <div className="total-box">
        <h5>Totales en EUR</h5>
        <div className="amount deposits">Depósitos: €{dailyTotalDepositsEur.toFixed(2)}</div>
        <div className="amount withdrawals">Retiros: €{dailyTotalWithdrawalsEur.toFixed(2)}</div>
      </div>
      <div className="total-box">
        <h5>Totales en USD</h5>
        <div className="amount deposits">Depósitos: ${dailyTotalDepositsUsd.toFixed(2)}</div>
        <div className="amount withdrawals">Retiros: ${dailyTotalWithdrawalsUsd.toFixed(2)}</div>
      </div>
      <div className="total-box">
        <h5>Totales en GBP</h5>
        <div className="amount deposits">Depósitos: £{dailyTotalDepositsGbp.toFixed(2)}</div>
        <div className="amount withdrawals">Retiros: £{dailyTotalWithdrawalsGbp.toFixed(2)}</div>
      </div>
    </div>

    {/* Desglose por usuario */}
    <h4>Depósitos y Retiros por Usuario y Moneda</h4>
    <table className="user-totals-table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Depósitos EUR</th>
          <th>Depósitos USD</th>
          <th>Depósitos GBP</th>
          <th>Retiros EUR</th>
          <th>Retiros USD</th>
          <th>Retiros GBP</th>
        </tr>
      </thead>
      <tbody>
        {dailyTotalsByUser.length > 0 ? (
          dailyTotalsByUser.map((entry, index) => (
            <tr key={index}>
              <td>{`${entry.user.use_name} ${entry.user.use_lastName}`}</td>
              <td className="deposits">€{entry.depositsEur.toFixed(2)}</td>
              <td className="deposits">${entry.depositsUsd.toFixed(2)}</td>
              <td className="deposits">£{entry.depositsGbp.toFixed(2)}</td>
              <td className="withdrawals">€{entry.withdrawalsEur.toFixed(2)}</td>
              <td className="withdrawals">${entry.withdrawalsUsd.toFixed(2)}</td>
              <td className="withdrawals">£{entry.withdrawalsGbp.toFixed(2)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7">No hay depósitos o retiros para el día seleccionado</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
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
