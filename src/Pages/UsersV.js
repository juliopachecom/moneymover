import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import NavBarAdmin from "../Components/NavBarAdmin";

function UsersV() {
  // Usuarios estáticos con el estado de verificación
  const initialUsers = [
    {
      id: 1,
      nombre: "Jose",
      apellido: "Portillo",
      dni: "12345678X",
      telefono: "+34 04246725408",
      email: "joseportillo2002.jdpf@gmail.com",
      use_verif: "V", // Verificado
    },
    {
      id: 2,
      nombre: "Carlos",
      apellido: "Martínez",
      dni: "XK2301",
      telefono: "+34 658742910",
      email: "carlos.martinez@gmail.com",
      use_verif: "V", // Verificado
    },
  ];

  const [users] = useState(initialUsers);

  // Filtramos los usuarios que están en estado "Verificado"
  const filteredUsers = users.filter((user) => user.use_verif === "V");

  // Icono de verificación para usuarios verificados
  const getVerificationIcon = () => <FaCheck style={{ color: "green" }} />;

  return (
    <div className="users-e-dashboard">
      <NavBarAdmin />
      <div className="dashboard-content">
        <h2 className="section-title">Usuarios Verificados</h2>

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

export { UsersV };
