import React, { useState, useEffect, useCallback } from "react";
import { FaEye } from "react-icons/fa"; // Ícono de vista de detalles
import { NavBarUser } from "../Components/NavBarUser"; // Asumiendo que ya tienes NavBarUser
import { useDataContext } from "../Context/dataContext";
import axios from "axios";

function Movements() {
  const { infoTkn, url } = useDataContext();
  const [activeTab, setActiveTab] = useState("all"); // Estado para controlar la pestaña activa

  // Datos Usuario
  // const [user, setUser] = useState([]);
  const [userMovemments, setUserMovemments] = useState([]);

  //Alertas
  // const [showAlert, setShowAlert] = useState(false);
  // const [alertMessage, setAlertMessage] = useState("");
  // const [alertType, setAlertType] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Fetch de datos del usuario (Incluye movimientos y directorio)
  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      // setUser(response.data);

      const responseMovemments = await axios.get(
        `${url}/Movements/user/${response.data.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUserMovemments(responseMovemments.data);

      // const responseDirectory = await axios.get(
      //   `${url}/AccBsUser/${response.data.use_id}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${infoTkn}`,
      //     },
      //   }
      // );
      // setUserDirectory(responseDirectory.data);

      // setShowAlert(true);
    } catch (error) {
      console.log(error);
    }
  }, [ infoTkn, url]);

  // Filtrado según la pestaña activa
  const filteredTransactions = userMovemments.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.mov_status.toLowerCase() === activeTab;
  });

  useEffect(() => {
    fetchDataUser();
  }, [fetchDataUser]);

  return (
    <div className="movements">
      <NavBarUser />

      {/* Pestañas */}
      <div className="movements__tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          Todas
        </button>
        <button
          className={`tab ${activeTab === "V" ? "active" : ""}`}
          onClick={() => handleTabChange("V")}
        >
          Aprobada
        </button>
        <button
          className={`tab ${activeTab === "R" ? "active" : ""}`}
          onClick={() => handleTabChange("R")}
        >
          Rechazada
        </button>
        <button
          className={`tab ${activeTab === "E" ? "active" : ""}`}
          onClick={() => handleTabChange("E")}
        >
          En espera
        </button>
      </div>

      {/* Tabla de Movimientos */}
      <div className="table-responsive">
        <table className="movements__table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.mov_id}>
                <td>{transaction.mov_date}</td>
                <td>{transaction.mov_type }</td>
                <td>
                  {transaction.mov_amount }{" "}
                  <img src={transaction.mov_currency} alt={transaction.mov_type } />
                </td>
                <td className={transaction.mov_status.toLowerCase()}>
                  {transaction.mov_status  === "E"
                    ? "En espera"
                    : transaction.mov_status  === "V"
                    ? "Aprobada"
                    : "Rechazada"}
                </td>
                <td>
                  <FaEye className="view-details-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { Movements };