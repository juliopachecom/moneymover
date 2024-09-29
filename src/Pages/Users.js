import React, { useState, useEffect, useCallback } from "react";
import {
  FaEye,
  FaUserCircle,
  FaPlus,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import spainFlag from "../Assets/Images/spain.png";
import usaFlag from "../Assets/Images/usa.png";
import NavBarAdmin from "../Components/NavBarAdmin"; // Importando NavBarAdmin
// import { toast, ToastContainer } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";

function Users() {
  const { infoTkn, url } = useDataContext();

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

  const [users, setUsers] = useState([]);
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

  // Paginación
  // const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentUsers = users
  //   .filter(
  //     (user) =>
  //       user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       user.email.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Estado para los modales
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMovementsModal, setShowMovementsModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMovementImageModal, setShowMovementImageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Funciones para abrir los modales
  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const openMovementsModal = () => {
    setShowDetailsModal(false);
    setShowMovementsModal(true);
  };

  const openImageModal = () => {
    setShowDetailsModal(false);
    setShowImageModal(true);
  };

  const openMovementImageModal = () => {
    setShowMovementsModal(false);
    setShowMovementImageModal(true);
  };

  const openEditModal = () => {
    setShowDetailsModal(false);
    setShowEditModal(true);
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

  // Función para añadir un nuevo usuario
  // const [newUser, setNewUser] = useState({
  //   nombre: "",
  //   apellido: "",
  //   dni: "",
  //   telefono: "",
  //   email: "",
  //   saldoEUR: 0,
  //   saldoUSD: 0,
  //   saldoGBP: 0,
  //   use_verif: "E", // Default estado
  // });

  // const handleNewUserChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewUser((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleAddUser = (e) => {
  //   e.preventDefault();
  //   const userId = users.length + 1;
  //   setUsers((prev) => [...prev, { id: userId, ...newUser }]);
  //   closeModal();
  // };

  // Función para manejar cambios en el estado de verificación
  const handleUserVerificationChange = (e) => {
    const { value } = e.target;
    setSelectedUser((prev) => ({ ...prev, use_verif: value }));
  };

  // Iconos de verificación
  const getVerificationIcon = (status) => {
    if (status === "S") return <FaCheck style={{ color: "green" }} />;
    if (status === "N") return <FaTimes style={{ color: "red" }} />;
    if (status === "E") return <FaClock style={{ color: "orange" }} />;
  };

  // Movimientos ficticios
  const movimientosFicticios = [
    {
      id: 1,
      fecha: "01/09/2024",
      tipo: "Recarga",
      moneda: "EUR",
      monto: 200,
      estado: "Aprobado",
    },
    {
      id: 2,
      fecha: "10/09/2024",
      tipo: "Remesa",
      moneda: "USD",
      monto: 300,
      estado: "En espera",
    },
  ];

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
  }, [fetchDataUsers]);

  return (
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

          <table className="users-table">
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
                      onClick={() => openDetailsModal(user)}
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
                Detalles de {selectedUser.nombre} {selectedUser.apellido}
              </h3>
              <p>
                <strong>Teléfono:</strong> {selectedUser.telefono}
              </p>
              <p>
                <strong>Correo:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>DNI:</strong> {selectedUser.dni || "N/A"}
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
                <button className="btn btn-secondary" onClick={openEditModal}>
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
        {showMovementsModal && selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <h3>Movimientos de {selectedUser.nombre}</h3>
              <table className="movements__table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Imagen</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientosFicticios.map((mov) => (
                    <tr key={mov.id}>
                      <td>{mov.fecha}</td>
                      <td>{mov.tipo}</td>
                      <td>
                        {mov.moneda === "EUR"
                          ? "€"
                          : mov.moneda === "USD"
                          ? "$"
                          : "£"}{" "}
                        {mov.monto}
                        {mov.moneda === "EUR" && (
                          <img src={spainFlag} alt="EUR" />
                        )}
                        {mov.moneda === "USD" && (
                          <img src={usaFlag} alt="USD" />
                        )}
                      </td>
                      <td>{mov.estado}</td>
                      <td>
                        <FaEye
                          className="view-details-icon"
                          onClick={openMovementImageModal}
                        />
                      </td>
                    </tr>
                  ))}
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
              {selectedUser.img ? (
                <img src={selectedUser.img} alt="Imagen del Usuario" />
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
                [Imagen del Movimiento]
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
              <h3>Editar {selectedUser.nombre}</h3>
              <form>
                <label>
                  Nombre:
                  <input type="text" defaultValue={selectedUser.nombre} />
                </label>
                <label>
                  Apellido:
                  <input type="text" defaultValue={selectedUser.apellido} />
                </label>
                <label>
                  DNI:
                  <input type="text" defaultValue={selectedUser.dni} />
                </label>
                <label>
                  Teléfono:
                  <input type="text" defaultValue={selectedUser.telefono} />
                </label>
                <label>
                  Correo:
                  <input type="email" defaultValue={selectedUser.email} />
                </label>
                <label>
                  Saldo EUR:
                  <input type="number" defaultValue={selectedUser.saldoEUR} />
                </label>
                <label>
                  Saldo GBP:
                  <input type="number" defaultValue={selectedUser.saldoGBP} />
                </label>
                <label>
                  Saldo USD:
                  <input type="number" defaultValue={selectedUser.saldoUSD} />
                </label>
                <label>
                  Estado de verificación:
                  <select
                    value={selectedUser.use_verif}
                    onChange={handleUserVerificationChange}
                  >
                    <option value="V">Verificado</option>
                    <option value="E">En espera</option>
                    <option value="R">Rechazado</option>
                  </select>
                </label>
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
  );
}

export { Users };
