import React, { useState, useEffect, useCallback } from "react";
import { FaCheck } from "react-icons/fa";
import NavBarAdmin from "../Components/NavBarAdmin";
// import { toast, ToastContainer } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";

function UsersV() {
  const { infoTkn, url } = useDataContext();

  const [users, setUsers] = useState([]);

  const filteredUsuarios = users.filter((user) => {
    const fullName =
      `${user.use_name} ${user.use_lastName} ${user.use_dni}`.toLowerCase();
    return fullName;
  });

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

  // Icono de verificación para usuarios verificados
  const getVerificationIcon = () => <FaCheck style={{ color: "green" }} />;

  useEffect(() => {
    fetchDataUsers();
  }, [
    fetchDataUsers
  ]);

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
              {filteredUsuarios.filter((user) => user.use_verif === "V").map((user, index) => (
                <tr key={user.use_id}>
                <td>{index+1}</td>
                <td>
                  {user.use_name} {user.use_lastName}
                </td>
                <td>{user.use_dni || "N/A"}</td>
                <td>{user.use_phone}</td>
                <td>{user.use_email}</td>
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