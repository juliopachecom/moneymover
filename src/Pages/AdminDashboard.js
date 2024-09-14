import React, { useState, useEffect, useCallback } from "react";
import spainFlag from "../Assets/Images/spain.png";
import usaFlag from "../Assets/Images/usa.png";
import venezuelaFlag from "../Assets/Images/venezuela.png";
import { format } from "date-fns";
import NavBarAdmin from "../Components/NavBarAdmin";
import { FaEye } from "react-icons/fa";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";

function AdminDashboard() {
  const { logged, infoTkn, url } = useDataContext();
  const [activeTab, setActiveTab] = useState("recargas");
  const currentDate = format(new Date(), "dd/MM/yyyy");

  // Datos Usuario
  const [user, setUser] = useState([]);
  const [userMovemments, setUserMovemments] = useState([]);

  const [totalEur, setTotalEur] = useState([]);
  const [totalUsd, setTotalUsd] = useState([]);
  const [totalGbp, setTotalGbp] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Fetch de datos del admin
  const fetchDataAdm = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url}/Auth/findByTokenAdmin/${infoTkn}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setUser, infoTkn, url]);

  // Fetch de datos del admin
  const fetchDataMovemments = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Movements`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setUserMovemments(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setUserMovemments, infoTkn, url]);

  // Fetch de Total de Eur
  const fetchDataTotalEur = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totaleur/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setTotalEur(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setTotalEur, url]);

  // Fetch de Total de Usd
  const fetchDataTotalUsd = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totalusd/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setTotalUsd(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setTotalUsd, url]);

  // Fetch de Total de Gbp
  const fetchDataTotalGbp = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totalgbp/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setTotalGbp(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setTotalGbp, url]);

  useEffect(() => {
    fetchDataAdm();
    fetchDataMovemments();
    fetchDataTotalEur();
    fetchDataTotalUsd();
    fetchDataTotalGbp();
  }, [
    fetchDataAdm,
    fetchDataMovemments,
    fetchDataTotalEur,
    fetchDataTotalUsd,
    fetchDataTotalGbp,
  ]);

  return (
    <div className="admin-dashboard">
      <NavBarAdmin />
      {/* Bienvenida Administrador */}
      <div className="welcome-admin">
        <h2>Bienvenido de nuevo, {user.adm_user}</h2>
        <div className="date">{currentDate}</div>
      </div>

      {/* Cartas de totales */}
      <div className="cards-section">
        <div className="card">
          <h3>Total de Euros cambiados</h3>
          <div className="value">€{totalEur.totalIn}</div>
          <a href="/relation">Ver detalles</a>
        </div>
        <div className="card">
          <h3>Total de Libras cambiadas</h3>
          <div className="value">£{totalGbp.totalIn}</div>
          <a href="/relation">Ver detalles</a>
        </div>
        <div className="card">
          <h3>Total de Dólares cambiados</h3>
          <div className="value">${totalUsd.totalIn - totalUsd.totalOut}</div>
          <a href="/relation">Ver detalles</a>
        </div>
      </div>

      {/* Sección de Movimientos */}
      <div className="transactions-section">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "recargas" ? "active" : "inactive"}
            onClick={() => handleTabChange("recargas")}
          >
            Movimientos de Recarga
          </button>
          <button
            className={activeTab === "remesas" ? "active" : "inactive"}
            onClick={() => handleTabChange("remesas")}
          >
            Movimientos de Remesas
          </button>
        </div>

        {/* Tabla de Recargas */}
        {activeTab === "recargas" && (
          <table className="movements__table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Recarga</th>
                <th>Enviado</th>
                <th>Estado</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr>
              <td>25/08/2024</td>
              <td>407843</td>
              <td>
                20,00 EUR <img src={spainFlag} alt="EUR" />
              </td>
              <td className="cancelled">Cancelado</td>
              <td>
                <FaEye className="view-details-icon" />
              </td>
            </tr> */}
              {userMovemments.length > 0 ? (
                userMovemments
                  .filter((movement) => movement.mov_type === "Deposito" && movement.mov_status === 'E')
                  .map((movement) => (
                    <tr key={movement.mov_id}>
                      <td>{movement.mov_date}</td>
                      <td>0001</td>
                      <td>
                        {movement.mov_currency === "EUR"
                          ? "€"
                          : movement.mov_currency === "USD"
                          ? "$"
                          : "£"}{" "}
                        {movement.mov_amount}{" "}
                        {movement.mov_currency === "USD" && (
                          <img src={usaFlag} alt="USD" />
                        )}
                        {movement.mov_currency === "EUR" && (
                          <img src={spainFlag} alt="EUR" />
                        )}
                      </td>
                      <td
                        className={
                          movement.mov_status === "S"
                            ? "completed"
                            : movement.mov_status === "E"
                            ? "en espera"
                            : "cancelled"
                        }
                      >
                        En espera
                      </td>
                      <td>
                        <FaEye className="view-details-icon" />
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No hay movimientos para mostrar
                  </td>
                </tr>
              )}
              {/* <tr>
              <td>26/08/2024</td>
              <td>407844</td>
              <td>
                30,00 USD <img src={usaFlag} alt="USD" />
              </td>
              <td className="completed">Aprobado</td>
              <td>
                <FaEye className="view-details-icon" />
              </td>
            </tr> */}
            </tbody>
          </table>
        )}

        {/* Tabla de Remesas */}
        {activeTab === "remesas" && (
          <table className="movements__table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Remesa</th>
                <th>Beneficiario</th>
                <th>Enviado</th>
                <th>Recibido</th>
                <th>Estado</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr>
                <td>25/08/2024</td>
                <td>407845</td>
                <td>Maribel Esther M...</td>
                <td>
                  20,00 EUR <img src={spainFlag} alt="EUR" />
                </td>
                <td>
                  86,20 VEF <img src={venezuelaFlag} alt="VEF" />
                </td>
                <td className="cancelled">Cancelado</td>
                <td>
                  <FaEye
                    className="view-details-icon"
                  />
                </td>
              </tr> */}
              {userMovemments.length > 0 ? (
                userMovemments
                  .filter((movement) => movement.mov_type === "Retiro" && movement.mov_status === 'E')
                  .map((movement) => (
                    <tr key={movement.mov_id}>
                      <td>{movement.mov_date}</td>
                      <td>0001</td>
                      <td>Carlos Pérez</td>
                      <td>
                        50,00 USD <img src={usaFlag} alt="USD" />
                      </td>
                      <td>
                        {movement.mov_currency === "BS"
                          ? "Bs"
                          : movement.mov_currency === "USD"
                          ? "$"
                          : "£"}{" "}
                        {movement.mov_amount}{" "}
                        {movement.mov_currency === "USD" && (
                          <img src={usaFlag} alt="USD" />
                        )}
                        {movement.mov_currency === "BS" && (
                          <img src={venezuelaFlag} alt="BS" />
                        )}
                      </td>
                      <td
                        className={
                          movement.mov_status === "S"
                            ? "completed"
                            : movement.mov_status === "E"
                            ? "en espera"
                            : "cancelled"
                        }
                      >
                        En espera
                      </td>
                      <td>
                        <FaEye className="view-details-icon" />
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No hay movimientos para mostrar
                  </td>
                </tr>
              )}
              {/* <tr>
              <td>26/08/2024</td>
              <td>407846</td>
              <td>Carlos Pérez</td>
              <td>
                50,00 USD <img src={usaFlag} alt="USD" />
              </td>
              <td>
                150,00 VEF <img src={venezuelaFlag} alt="VEF" />
              </td>
              <td className="pending">En espera</td>
              <td>
                <FaEye className="view-details-icon" />
              </td>
            </tr> */}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export { AdminDashboard };