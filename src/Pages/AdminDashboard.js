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
  const { infoTkn, url } = useDataContext();
  const [activeTab, setActiveTab] = useState("recargas");
  const currentDate = format(new Date(), "dd/MM/yyyy");

  // Datos Usuario
  const [user, setUser] = useState([]);
  const [userMovemments, setUserMovemments] = useState([]);

  const [totalEur, setTotalEur] = useState([]);
  const [totalUsd, setTotalUsd] = useState([]);
  const [totalGbp, setTotalGbp] = useState([]);
  const [userCountV, setUserCountV] = useState(0); // Verificados
  const [userCountE, setUserCountE] = useState(0); // En espera
  const [userCountR, setUserCountR] = useState(0); // Rechazados

  //Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedMovement, setSelectedMovement] = useState(null);

  // Fetch de usuarios y filtrado
  const fetchDataUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/users`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });

      const allUsers = response.data;

      // Filtramos los usuarios por su estado de verificación
      const verifiedUsers = allUsers.filter((user) => user.use_verif === "V");
      const pendingUsers = allUsers.filter((user) => user.use_verif === "E");
      const rejectedUsers = allUsers.filter((user) => user.use_verif === "N");

      // Actualizamos el estado con los contadores
      setUserCountV(verifiedUsers.length);
      setUserCountE(pendingUsers.length);
      setUserCountR(rejectedUsers.length);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, url]);

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

  const openModal = (movement) => {
    setSelectedMovement(movement); // Establece el movimiento seleccionado
    setIsModalOpen(true); // Abre el modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Cierra el modal
    setShowRejectionReason(false); // Resetea el campo de rechazo
    setRejectionReason(""); // Limpiar la razón de rechazo
  };

  const handleApprove = () => {
    // Lógica para aprobar el movimiento
    console.log("Aprobado");
    closeModal();
  };

  const handleReject = () => {
    setShowRejectionReason(true); // Muestra el campo de razón de rechazo
  };

  const handleSendRejection = () => {
    console.log("Rechazado por: ", rejectionReason);
    closeModal();
  };

  const handleCancel = () => {
    setShowRejectionReason(false);  // Oculta el cuadro de texto
  };

  useEffect(() => {
    fetchDataAdm();
    fetchDataMovemments();
    fetchDataTotalEur();
    fetchDataTotalUsd();
    fetchDataTotalGbp();
    fetchDataUsers();
  }, [
    fetchDataAdm,
    fetchDataMovemments,
    fetchDataTotalEur,
    fetchDataTotalUsd,
    fetchDataTotalGbp,
    fetchDataUsers,
  ]);

  return (
    <div className="admin-dashboard">
      <NavBarAdmin />
      {/* Bienvenida Administrador */}
      <div className="welcome-admin">
        <h2>Bienvenido de nuevo, {user.adm_user}</h2>
        <div className="date">{currentDate}</div>
      </div>

      <div className="cards-section totales">
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

      <div className="cards-section usuarios">
        <div className="card">
          <h3>Usuarios Verificados</h3>
          <div className="value">{userCountV}</div>
          <a href="/usersV">Ver detalles</a>
        </div>
        <div className="card">
          <h3>Usuarios en Espera</h3>
          <div className="value">{userCountE}</div>
          <a href="/usersE">Ver detalles</a>
        </div>
        <div className="card">
          <h3>Usuarios Rechazados</h3>
          <div className="value">{userCountR}</div>
          <a href="/usersR">Ver detalles</a>
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
                  .filter(
                    (movement) =>
                      movement.mov_type === "Deposito" &&
                      movement.mov_status === "E"
                  )
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
                <th style={{ textAlign: "center" }}>Fecha</th>
                <th style={{ textAlign: "center" }}>Remesa</th>
                <th style={{ textAlign: "center" }}>Beneficiario</th>
                <th style={{ textAlign: "center" }}>Enviado</th>
                <th style={{ textAlign: "center" }}>Recibido</th>
                <th style={{ textAlign: "center" }}>Estado</th>
                <th style={{ textAlign: "center" }}>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {userMovemments.length > 0 ? (
                userMovemments
                  .filter(
                    (movement) =>
                      movement.mov_type === "Retiro" &&
                      movement.mov_status === "E"
                  )
                  .map((movement) => (
                    <tr key={movement.mov_id}>
                      <td style={{ textAlign: "center" }}>
                        {movement.mov_date}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {movement.mov_ref}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {movement.User &&
                        movement.User.AccountsBsUser &&
                        movement.User.AccountsBsUser.length > 0
                          ? movement.User.AccountsBsUser[0].accbsUser_owner
                          : "Sin información"}
                      </td>
                      <td style={{ textAlign: "center", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {movement.mov_currency === "EUR"
                          ? "€"
                          : movement.mov_currency === "USD"
                          ? "$"
                          : "£"}{" "}
                        {movement.mov_amount}{" "}
                        {movement.mov_currency === "USD" && (
                          <img style={{marginLeft: '5px'}} width={30} src={usaFlag} alt="USD" />
                        )}
                        {movement.mov_currency === "EUR" && (
                          <img style={{marginLeft: '5px'}} width={30} src={spainFlag} alt="EUR" />
                        )}
                      </td>
                      <td style={{ textAlign: "center"}}>
                        2000 BS <img width={50} src={venezuelaFlag} alt="USD" />
                      </td>
                      <td
                        style={{ textAlign: "center" }}
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
                      <td style={{ textAlign: "center" }}>
                        <FaEye
                          style={{ cursor: "pointer" }}
                          className="view-details-icon"
                          onClick={() => openModal(movement)}
                        />
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
            </tbody>
          </table>
        )}

        {/* Modales */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Detalles del Beneficiario</h3>
              {selectedMovement ? (
                <div className="modal-details">
                  <p>
                    <strong>Propietario:</strong>{" "}
                    {selectedMovement.User.AccountsBsUser[0].accbsUser_owner}
                  </p>
                  <p>
                    <strong>Banco:</strong>{" "}
                    {selectedMovement.User.AccountsBsUser[0].accbsUser_bank}
                  </p>
                  <p>
                    <strong>DNI:</strong>{" "}
                    {selectedMovement.User.AccountsBsUser[0].accbsUser_dni}
                  </p>
                  <p>
                    <strong>
                      {selectedMovement.User.AccountsBsUser[0]
                        .accbsUser_type === "Pago Movil"
                        ? "Teléfono: " +
                          selectedMovement.User.AccountsBsUser[0]
                            .accbsUser_phone
                        : "Cuenta: " +
                          selectedMovement.User.AccountsBsUser[0]
                            .accbsUser_number}
                    </strong>
                  </p>
                </div>
              ) : (
                <p>Cargando datos...</p>
              )}

              <div className="modal-actions">
                <label class="file-label" for="file-upload">
                  Subir Imagen
                </label>
                <input type="file" id="file-upload" />
              </div>

              <div className="modal-buttons">
                <button className="approve-btn" onClick={handleApprove}>
                  Aprobar
                </button>
                <button className="reject-btn" onClick={handleReject}>
                  Rechazar
                </button>
              </div>

              {showRejectionReason && (
                <div className="rejection-reason open">
                  <label htmlFor="rejection-reason">Razón del rechazo:</label>
                  <textarea
                    id="rejection-reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <button className="send-btn" onClick={handleSendRejection}>
                    Enviar
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              )}

              <button className="close-btn" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { AdminDashboard };
