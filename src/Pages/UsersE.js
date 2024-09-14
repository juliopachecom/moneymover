import React, { useState } from "react";
import { FaCheck, FaTimes, FaClock } from "react-icons/fa";
import NavBarAdmin from "../Components/NavBarAdmin"; // Importando NavBarAdmin

function UsersE() {
  // Usuarios estáticos con el estado de verificación
  const initialUsers = [
    {
      id: 1,
      nombre: "Jose",
      apellido: "Portillo",
      dni: "",
      telefono: "+34 04246725408",
      email: "joseportillo2002.jdpf@gmail.com",
      use_verif: "E", // En espera
    },
    {
      id: 2,
      nombre: "Carlos",
      apellido: "Martínez",
      dni: "XK2301",
      telefono: "+34 658742910",
      email: "carlos.martinez@gmail.com",
      use_verif: "E", // En espera
    },
    {
      id: 3,
      nombre: "María",
      apellido: "García",
      dni: "XR7892",
      telefono: "+34 679432890",
      email: "maria.garcia@hotmail.com",
      use_verif: "E", // En espera
    },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Filtramos los usuarios que están en estado "En espera"
  const filteredUsers = users.filter((user) => user.use_verif === "E");

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
        userId: selectedUser.id,
        email: selectedUser.email,
        name: selectedUser.nombre,
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
        userId: selectedUser.id,
        email: selectedUser.email,
        name: selectedUser.nombre,
        message: `Su verificación ha sido rechazada por no cumplir con los requisitos.`,
      }),
    })
      .then(() => {
        console.log("Correo de rechazo enviado.");
        closeModal();
      })
      .catch((error) => console.error("Error enviando correo de rechazo", error));
  };

  // Función ficticia para enviar correo de aprobación
  const sendApprovalMail = () => {
    console.log(`Enviando correo de aprobación a ${selectedUser.email}...`);
    fetch(`/mailer/sendApproval`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUser.id,
        email: selectedUser.email,
        name: selectedUser.nombre,
        message: `Su verificación ha sido aprobada exitosamente.`,
      }),
    })
      .then(() => {
        console.log("Correo de aprobación enviado.");
        closeModal();
      })
      .catch((error) => console.error("Error enviando correo de aprobación", error));
  };

  // Función para cambiar el estado del usuario
  const handleStatusChange = (newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? { ...user, use_verif: newStatus } : user
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
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombre} {user.apellido}</td>
                  <td>{user.dni || "N/A"}</td>
                  <td>{user.telefono}</td>
                  <td>{user.email}</td>
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
              <h3>Enviar KYC a {selectedUser.nombre}</h3>
              <input
              type="text"
              name="kyc"
              value=""
              placeholder="Ingrese el link de KYC">
            
              </input>
              <p>
                ¿Seguro que deseas enviar un correo de KYC a {selectedUser.nombre} ({selectedUser.email})?
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
              <h3>Cambiar Estado de {selectedUser.nombre}</h3>
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
