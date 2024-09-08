import React, { useState } from "react";
import spainFlag from "../Assets/Images/spain.png";
import usaFlag from "../Assets/Images/usa.png";
import venezuelaFlag from "../Assets/Images/venezuela.png";
import { format } from "date-fns";
import NavBarAdmin from "../Components/NavBarAdmin";
import { FaEye } from "react-icons/fa";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("recargas");
  const currentDate = format(new Date(), "dd/MM/yyyy");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-dashboard">
      <NavBarAdmin />
      {/* Bienvenida Administrador */}
      <div className="welcome-admin">
        <h2>Bienvenido de nuevo, Administrador</h2>
        <div className="date">{currentDate}</div>
      </div>

      {/* Cartas de totales */}
      <div className="cards-section">
        <div className="card">
          <h3>Total de Euros cambiados</h3>
          <div className="value">€35,723</div>
          <a href="/relation">Ver detalles</a>
        </div>
        <div className="card">
          <h3>Total de Libras cambiadas</h3>
          <div className="value">£22,315</div>
          <a href="/relation">Ver detalles</a>
        </div>
        <div className="card">
          <h3>Total de Dólares cambiados</h3>
          <div className="value">$50,112</div>
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
          <table>
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
              <tr>
                <td>25/08/2024</td>
                <td>407843</td>
                <td>
                  20,00 EUR <img src={spainFlag} alt="Spain" className="flag" />
                </td>
                <td className="status cancelled">Cancelado</td>
                <td>
                  <FaEye className="details-icon" />
                </td>
              </tr>
              <tr>
                <td>26/08/2024</td>
                <td>407844</td>
                <td>
                  30,00 USD <img src={usaFlag} alt="USA" className="flag" />
                </td>
                <td className="status approved">Aprobado</td>
                <td>
                <FaEye className="details-icon" />
                </td>
                </tr>
            </tbody>
          </table>
        )}

        {/* Tabla de Remesas */}
        {activeTab === "remesas" && (
          <table>
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
              <tr>
                <td>25/08/2024</td>
                <td>407845</td>
                <td>Maribel Esther M...</td>
                <td>
                  20,00 EUR <img src={spainFlag} alt="Spain" className="flag" />
                </td>
                <td>
                  86,20 VEF{" "}
                  <img
                    src={venezuelaFlag}
                    alt="Venezuela"
                    className="flag"
                  />
                </td>
                <td className="status cancelled">Cancelado</td>
                <td>
                  <i className="details-icon fas fa-eye"></i>
                </td>
              </tr>
              <tr>
                <td>26/08/2024</td>
                <td>407846</td>
                <td>Carlos Pérez</td>
                <td>
                  50,00 USD <img src={usaFlag} alt="USA" className="flag" />
                </td>
                <td>
                  150,00 VEF{" "}
                  <img
                    src={venezuelaFlag}
                    alt="Venezuela"
                    className="flag"
                  />
                </td>
                <td className="status pending">En espera</td>
                <td>
                  <i className="details-icon fas fa-eye"></i>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export { AdminDashboard };
