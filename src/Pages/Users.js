import React, { useState, useEffect, useCallback } from "react";
import {
  FaEye,
  FaUserCircle,
  FaPlus,
  FaCheck,
  FaTimes,
  FaClock,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";
import NavBarAdmin from "../Components/NavBarAdmin"; // Importando NavBarAdmin
// import { toast, ToastContainer } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import { NotFound } from "../Components/NotFound";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";

function Users() {
  const { loggedAdm, infoTkn, url } = useDataContext();

  //Buscador
  const [searchQuery, setSearchQuery] = useState("");

  //Datos para usuarios
  const [use_name, setNombre] = useState("");
  const [use_lastName, setLastName] = useState("");
  const [use_email, setEmail] = useState("");
  const [use_password, setPassword] = useState("");
  const [use_dni, setDNI] = useState("");
  const [use_phone, setPhone] = useState("");
  const [use_verif, setVerif] = useState("");
  const use_img = "";
  const [use_amountEur, setAmountEur] = useState(Number);
  const [use_amountUsd, setAmountUsd] = useState(Number);
  const [use_amountGbp, setAmountGbp] = useState(Number);

  //Datos User
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  //Datos Movemments
  const [movements, setMovements] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState(null);

  // const [searchTerm, setSearchTerm] = useState("");
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);

  const filteredUsuarios = users.filter((user) => {
    const fullName =
      `${user.use_name} ${user.use_lastName} ${user.use_dni}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  //Fetch de Usuarios
  const fetchDataUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/users`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, setUsers, url]);

  //Fetch de Movimientos
  const fetchDataMovements = useCallback(async () => {
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
  }, [infoTkn, setMovements, url]);

  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Estado para los modales
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMovementsModal, setShowMovementsModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMovementImageModal, setShowMovementImageModal] = useState(false);

  const openMovementsModal = () => {
    setShowDetailsModal(false);
    setShowMovementsModal(true);
  };

  const openImageModal = () => {
    setShowDetailsModal(false);
    setShowImageModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(false);
    setShowEditModal(true);

    setNombre(user.use_name);
    setLastName(user.use_lastName);
    setEmail(user.use_email);
    setPassword(user.use_password);
    setDNI(user.use_dni);
    setPhone(user.use_phone);
    setVerif(user.use_verif);
    setAmountEur(user.use_amountEur);
    setAmountUsd(user.use_amountUsd);
    setAmountGbp(user.use_amountGbp);
  };

  // Función para cerrar todos los modales
  const closeModal = () => {
    setShowDetailsModal(false);
    setShowMovementsModal(false);
    setShowImageModal(false);
    setShowEditModal(false);
    setShowMovementImageModal(false);
    setNewUserModalOpen(false);
    setSelectedUser(null);
    setNombre("");
    setLastName("");
    setEmail("");
    setPassword("");
    setDNI("");
    setPhone("");
    setVerif("");
  };

  // Iconos de verificación
  const getVerificationIcon = (status) => {
    if (status === "S") return <FaCheck style={{ color: "green" }} />;
    if (status === "N") return <FaTimes style={{ color: "red" }} />;
    if (status === "E") return <FaClock style={{ color: "orange" }} />;
  };

  // Función para enviar los datos del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (selectedUser) {
        await axios.put(
          `${url}/Users/${selectedUser.use_id}`,
          {
            use_name,
            use_lastName,
            use_dni,
            use_phone,
            use_email,
            use_verif,
            use_amountUsd,
            use_amountEur,
            use_amountGbp,
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
        setSelectedUser(null);

        fetchDataUsers();
        setSelectedUser(null);
        closeModal();
      } else {
        await axios.post(
          `${url}/Auth/register`,
          {
            use_name,
            use_lastName,
            use_dni,
            use_phone,
            use_email,
            use_password,
            use_img,
            use_verif,
            use_amountUsd,
            use_amountEur,
            use_amountGbp,
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }
      fetchDataUsers();
      setSelectedUser(null);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataUsers();
    fetchDataMovements();
  }, [fetchDataUsers, fetchDataMovements]);

  return loggedAdm ? (
    <div className="admin-dashboard">
      <NavBarAdmin />
      <div className="dashboard-content">
        <h2 className="section-title">Gestión de Usuarios</h2>

        <div className="users-section">
          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o correo"
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />

          {/* Botón para añadir usuarios */}
          <button
            className="btn btn-add-user"
            onClick={() => setNewUserModalOpen(true)}
          >
            <FaPlus /> Añadir Usuario
          </button>

          <table className="table-responsive">
            <thead>
              <tr>
                <th>ID</th>
                <th>Perfil</th>
                <th>Nombre y Apellido</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Saldo EUR</th>
                <th>Saldo GBP</th>
                <th>Saldo USD</th>
                <th>Verificación</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((user, index) => (
                <tr key={user.use_id}>
                  <td>{index + 1}</td>
                  <td>
                    <FaUserCircle className="profile-icon" />
                  </td>
                  <td>
                    {user.use_name} {user.use_lastName}
                  </td>
                  <td>{user.use_dni || "N/A"}</td>
                  <td>{user.use_phone}</td>
                  <td>{user.use_email}</td>
                  <td>€{user.use_amountEur}</td>
                  <td>£{user.use_amountGbp}</td>
                  <td>${user.use_amountUsd}</td>
                  <td>{getVerificationIcon(user.use_verif)}</td>
                  <td>
                    <FaEye
                      className="view-details-icon"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDetailsModal(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="pagination">
            {Array.from({
              length: Math.ceil(users.length),
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Modal para añadir nuevo usuario */}
        {newUserModalOpen && (
          <div className="modal show">
            <div className="modal-content">
              <h3>Añadir Usuario</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    name="nombre"
                    value={use_name}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Apellido:
                  <input
                    type="text"
                    name="apellido"
                    value={use_lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  DNI:
                  <input
                    type="text"
                    name="dni"
                    value={use_dni}
                    onChange={(e) => setDNI(e.target.value)}
                  />
                </label>
                <label>
                  Contraseña:
                  <input
                    type="password"
                    name="password"
                    value={use_password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <label>
                  Teléfono:
                  <input
                    type="text"
                    name="telefono"
                    value={use_phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <label>
                  Correo:
                  <input
                    type="email"
                    name="email"
                    value={use_email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Saldo EUR:
                  <input
                    type="number"
                    name="saldoEUR"
                    value={use_amountEur}
                    onChange={(e) => setAmountEur(e.target.value)}
                  />
                </label>
                <label>
                  Saldo GBP:
                  <input
                    type="number"
                    name="saldoGBP"
                    value={use_amountGbp}
                    onChange={(e) => setAmountGbp(e.target.value)}
                  />
                </label>
                <label>
                  Saldo USD:
                  <input
                    type="number"
                    name="saldoUSD"
                    value={use_amountUsd}
                    onChange={(e) => setAmountUsd(e.target.value)}
                  />
                </label>
                <label>
                  Estado de verificación:
                  <select
                    name="use_verif"
                    value={use_verif}
                    onChange={(e) => setVerif(e.target.value)}
                  >
                    <option>Selecciobe una opción</option>
                    <option value="S">Verificado</option>
                    <option value="E">En espera</option>
                    <option value="N">Rechazado</option>
                  </select>
                </label>
                <button type="submit" className="btn btn-success">
                  Guardar Usuario
                </button>
              </form>
              <button
                onClick={() => {
                  closeModal();
                  setSelectedUser(null);
                }}
                className="close-button"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Detalles */}
        {showDetailsModal && selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <h3>
                Detalles de {selectedUser.use_name} {selectedUser.use_lastName}
              </h3>
              <p>
                <strong>Teléfono:</strong> {selectedUser.use_phone}
              </p>
              <p>
                <strong>Correo:</strong> {selectedUser.use_email}
              </p>
              <p>
                <strong>DNI:</strong> {selectedUser.use_dni || "N/A"}
              </p>
              <div className="modal-buttons">
                <button
                  className="btn btn-primary"
                  onClick={openMovementsModal}
                >
                  Movimientos
                </button>
                <button className="btn btn-primary" onClick={openImageModal}>
                  Ver Imagen
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => openEditModal(selectedUser)}
                >
                  Editar
                </button>
              </div>
              <button onClick={closeModal} className="close-button">
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Movimientos */}
        {/* Modal de Movimientos */}
        {showMovementsModal && selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <h3>
                Movimientos de {selectedUser.use_name}{" "}
                {selectedUser.use_lastName}
              </h3>
              <table className="movements__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Moneda</th>
                    <th>Monto</th>
                    <th>Tipo</th>
                    <th>Referencia</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Comentario</th>
                    <th>Imagen</th>

                  </tr>
                </thead>
                <tbody>
                  {movements.reverse().map((move) =>
                    move.User.use_id === selectedUser.use_id ? (
                      <tr key={move.mov_id}>
                        <td>{move.mov_id}</td>
                        <td>{move.mov_currency}</td>
                        <td>
                          {move.mov_type === "Retiro"
                            ? `(${move.mov_oldAmount} ${move.mov_oldCurrency}) ${move.mov_amount}`
                            : move.mov_amount}
                        </td>
                        <td>
                          {move.mov_type === "Deposito" ? (
                            <FaArrowDown color="green" />
                          ) : move.mov_type === "Retiro" ? (
                            <FaArrowUp color="red" />
                          ) : null}
                        </td>
                        <td>{move.mov_ref}</td>
                        <td>
                          {move.mov_status === "R" ? (
                            <AiOutlineCloseCircle style={{ color: "red", fontSize: "2em" }} />
                          ) : move.mov_status === "V" ? (
                            <AiOutlineCheckCircle
                              style={{ color: "green", fontSize: "2em" }}
                            />
                          ) : (
                            <AiOutlineClockCircle style={{ color: "blue", fontSize: "2em" }} />
                          )}
                        </td>
                        <td>{move.mov_date}</td>

                        {/* Mostrar la información basada en el tipo de movimiento */}
                        <td>
  {move.mov_type === "transferencia" ? (
    <div>
      <strong>Banco:</strong> {move.AccountsBsUser.accbsUser_bank}
      <br />
      <strong>Propietario:</strong> {move.AccountsBsUser.accbsUser_owner}
      <br />
      <strong>Número de cuenta:</strong>{" "}
      {move.AccountsBsUser.accbsUser_number
        ? move.AccountsBsUser.accbsUser_number
        : move.AccountsBsUser.accbsUser_phone}
      <br />
      <strong>DNI:</strong> {move.AccountsBsUser.accbsUser_dni}
    </div>
  ) : move.mov_type === "Deposito" ? (
    <div>
      <strong>Código:</strong> {move.mov_code}
      <br />
      {move.mov_phone && (
        <>
          <strong>Teléfono:</strong> {move.mov_phone}
          <br />
        </>
      )}
    </div>
  ) : (
    // Si no es transferencia ni ingreso, mostrar el comentario
    <div
      dangerouslySetInnerHTML={{
        __html: move.mov_comment.replace(/\n/g, "<br/>"),
      }}
    />
  )}
</td>

                        <td>
                          {move.mov_img ? (
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setSelectedMovement(move);
                                setShowMovementsModal(false);
                                setShowMovementImageModal(true);
                              }}
                            >
                              Ver Imagen
                            </button>
                          ) : (
                            <p>No se encontraron resultados</p>
                          )}
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>

              </table>
              <button onClick={closeModal} className="close-button">
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Imagen */}
        {showImageModal && selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <h3>Imagen de {selectedUser.nombre}</h3>
              {selectedUser.use_img ? (
                <img
                  src={`https://apimoneymover-production.up.railway.app/Users/image/${selectedUser.use_img}`}
                  alt="Imagen del Usuario"
                />
              ) : (
                <div className="user-image-placeholder">[Sin Imagen]</div>
              )}
              <button onClick={closeModal} className="close-button">
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal de la Imagen de Movimiento */}
        {showMovementImageModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Imagen del Movimiento</h3>
              <div className="user-image-placeholder">
               {/* Muestra una imagen o un enlace de descarga si es PDF */}
               {selectedMovement.mov_img ? (
                  selectedMovement.mov_img.endsWith(".pdf") ? (
                    <a
                      href={`${url}/Movements/image/${selectedMovement.mov_img}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Descargar PDF
                    </a>
                  ) : (
                    <img
                      src={`${url}/Movements/image/${selectedMovement.mov_img}`}
                      alt="Documento"
                      style={{ width: "200px" }}
                    />
                  )
                ) : (
                  <p>No hay documento adjunto.</p>
                )}
              </div>
              <button onClick={closeModal} className="close-button">
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Editar */}
        {showEditModal && selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <h3>Editar {selectedUser.use_name}</h3>
              <form onSubmit={handleSubmit}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label>Nombre:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={use_name}
                          onChange={(e) => setNombre(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Apellido:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={use_lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>DNI:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={use_dni}
                          onChange={(e) => setDNI(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Contraseña:</label>
                      </td>
                      <td>
                        <input
                          type="password"
                          defaultValue={use_password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Teléfono:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={use_phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Correo:</label>
                      </td>
                      <td>
                        <input
                          type="email"
                          defaultValue={use_email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Saldo EUR:</label>
                      </td>
                      <td>
                        <input
                          type="number"
                          defaultValue={use_amountEur}
                          onChange={(e) => setAmountEur(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Saldo GBP:</label>
                      </td>
                      <td>
                        <input
                          type="number"
                          defaultValue={use_amountGbp}
                          onChange={(e) => setAmountGbp(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Saldo USD:</label>
                      </td>
                      <td>
                        <input
                          type="number"
                          defaultValue={use_amountUsd}
                          onChange={(e) => setAmountUsd(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Estado de verificación:</label>
                      </td>
                      <td>
                        <select
                          defaultValue={selectedUser.use_verif}
                          onChange={(e) => setVerif(e.target.value)}
                        >
                          {" "}
                          <option value="S">Verificado</option>
                          <option value="E">En espera</option>
                          <option value="N">Rechazado</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button type="submit" className="btn btn-success">
                  Guardar Cambios
                </button>
              </form>
              <button onClick={closeModal} className="close-button">
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <NotFound />
  );
}

export { Users };
