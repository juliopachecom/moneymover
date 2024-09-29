import React, { useState, useEffect, useCallback } from "react";
import { FaCheck, FaTimes, FaClock } from "react-icons/fa";
import NavBarAdmin from "../Components/NavBarAdmin"; // Importando NavBarAdmin
// import { toast, ToastContainer } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";

function UsersE() {
  const { infoTkn, url } = useDataContext();

  //Listado
  const [users, setUsers] = useState([]);

  const filteredUsuarios = users.filter((user) => {
    const fullName =
      `${user.use_name} ${user.use_lastName} ${user.use_dni}`.toLowerCase();
    return fullName
  });

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

  const [selectedUser, setSelectedUser] = useState(null);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Funciones para abrir los modales
  const openKYCModal = (user) => {
    setSelectedUser(user);
    setShowKYCModal(true);
  };

  const openStatusModal = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  // Función para cerrar los modales
  const closeModal = () => {
    setShowKYCModal(false);
    setShowStatusModal(false);
  };

  // Función ficticia para enviar correo KYC
  const sendKYCMail = () => {
    console.log(`Enviando correo KYC a ${selectedUser.email}...`);
    fetch(`/mailer/sendKYC`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUser.use_id,
        email: selectedUser.use_email,
        name: selectedUser.use_name,
        link: `https://example.com/kyc/${selectedUser.id}`,
      }),
    })
      .then(() => {
        console.log("Correo de KYC enviado.");
        closeModal();
      })
      .catch((error) => console.error("Error enviando correo de KYC", error));
  };

  // Función ficticia para enviar correo de rechazo
  const sendRejectionMail = () => {
    console.log(`Enviando correo de rechazo a ${selectedUser.email}...`);
    fetch(`/mailer/sendRejection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUser.use_id,
        email: selectedUser.use_email,
        name: selectedUser.use_name,
        message: `Su verificación ha sido rechazada por no cumplir con los requisitos.`,
      }),
    })
      .then(() => {
        console.log("Correo de rechazo enviado.");
        closeModal();
      })
      .catch((error) =>
        console.error("Error enviando correo de rechazo", error)
      );
  };

  // Función ficticia para enviar correo de aprobación
  const sendApprovalMail = () => {
    console.log(`Enviando correo de aprobación a ${selectedUser.use_email}...`);
    fetch(`/mailer/sendApproval`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUser.use_id,
        email: selectedUser.use_email,
        name: selectedUser.use_name,
        message: `Su verificación ha sido aprobada exitosamente.`,
      }),
    })
      .then(() => {
        console.log("Correo de aprobación enviado.");
        closeModal();
      })
      .catch((error) =>
        console.error("Error enviando correo de aprobación", error)
      );
  };

  // Función para cambiar el estado del usuario
  const handleStatusChange = (newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.use_id ? { ...user, use_verif: newStatus } : user
      )
    );
    closeModal();
  };

  // Iconos de verificación
  const getVerificationIcon = (status) => {
    if (status === "V") return <FaCheck style={{ color: "green" }} />;
    if (status === "R") return <FaTimes style={{ color: "red" }} />;
    if (status === "E") return <FaClock style={{ color: "orange" }} />;
  };

  useEffect(() => {
    fetchDataUsers();
  }, [fetchDataUsers]);

  return (
    <div className="users-e-dashboard">
      <NavBarAdmin />
      <div className="dashboard-content">
        <h2 className="section-title">Usuarios en Espera</h2>

        <div className="users-e-section">
          <table className="users-e-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre y Apellido</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios
                .filter((user) => user.use_verif === "E")
                .map((user, index) => (
                  <tr key={user.use_id}>
                    <td>{index+1}</td>
                    <td>
                      {user.use_name} {user.use_lastName}
                    </td>
                    <td>{user.use_dni || "N/A"}</td>
                    <td>{user.use_phone}</td>
                    <td>{user.use_email}</td>
                    <td>{getVerificationIcon(user.use_verif)}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => openKYCModal(user)}
                      >
                        Enviar KYC
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => openStatusModal(user)}
                      >
                        Cambiar Estado
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Modal para enviar KYC */}
        {showKYCModal && selectedUser && (
          <div className="modal show">
            <div className="modal-content">
              <h3>Enviar KYC a {selectedUser.use_name}</h3>
              <input
                type="text"
                name="kyc"
                value=""
                placeholder="Ingrese el link de KYC"
              ></input>
              <p>
                ¿Seguro que deseas enviar un correo de KYC a{" "}
                {selectedUser.use_name} ({selectedUser.use_email})?
              </p>
              <button className="btn btn-primary" onClick={sendKYCMail}>
                Enviar
              </button>
              <button className="close-button" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal para cambiar estado */}
        {showStatusModal && selectedUser && (
          <div className="modal show">
            <div className="modal-content">
              <h3>Cambiar Estado de {selectedUser.use_name}</h3>
              <p>Selecciona el estado de verificación:</p>
              <div className="modal-buttons">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    handleStatusChange("V");
                    sendApprovalMail();
                  }}
                >
                  Aprobar <FaCheck />
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handleStatusChange("R");
                    sendRejectionMail();
                  }}
                >
                  Rechazar <FaTimes />
                </button>
              </div>
              <button className="close-button" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { UsersE };