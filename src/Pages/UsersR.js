import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import NavBarAdmin from "../Components/NavBarAdmin";

function UsersR() {
  // Usuarios estáticos con el estado de verificación
  const initialUsers = [
    {
      id: 1,
      nombre: "Maria",
      apellido: "Garcia",
      dni: "XR7892",
      telefono: "+34 679432890",
      email: "maria.garcia@hotmail.com",
      use_verif: "R", // Rechazado
    },
    {
      id: 2,
      nombre: "Juan",
      apellido: "Pérez",
      dni: "XF12345",
      telefono: "+34 654987321",
      email: "juan.perez@gmail.com",
      use_verif: "R", // Rechazado
    },
  ];

  const [users] = useState(initialUsers);

  // Filtramos los usuarios que están en estado "Rechazado"
  const filteredUsers = users.filter((user) => user.use_verif === "R");

  // Icono de verificación para usuarios rechazados
  const getVerificationIcon = () => <FaTimes style={{ color: "red" }} />;

  return (
    <div className="users-e-dashboard">
      <NavBarAdmin />
      <div className="dashboard-content">
        <h2 className="section-title">Usuarios Rechazados</h2>

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
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombre} {user.apellido}</td>
                  <td>{user.dni}</td>
                  <td>{user.telefono}</td>
                  <td>{user.email}</td>
                  <td>{getVerificationIcon()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export { UsersR };
