import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa'; // Ícono de vista de detalles
import { NavBarUser } from '../Components/NavBarUser'; // Asumiendo que ya tienes NavBarUser
import spainFlag from '../Assets/Images/spain.png';
import venezuelaFlag from '../Assets/Images/venezuela.png';
import usaFlag from '../Assets/Images/usa.png';

function Movements() {
  const [activeTab, setActiveTab] = useState('all'); // Estado para controlar la pestaña activa

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const transactions = [
    { id: 1, date: '25/08/2024', type: 'Recarga', amount: '20,00 EUR', status: 'En espera', flag: spainFlag },
    { id: 2, date: '26/08/2024', type: 'Remesa', amount: '30,00 USD', status: 'Aprobada', flag: usaFlag },
    { id: 3, date: '26/08/2024', type: 'Recarga', amount: '50,00 VEF', status: 'Rechazada', flag: venezuelaFlag },
  ];

  // Filtrado según la pestaña activa
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === 'all') return true;
    return transaction.status.toLowerCase() === activeTab;
  });

  return (
    <div className="movements">
      <NavBarUser />

      {/* Pestañas */}
      <div className="movements__tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabChange('all')}
        >
          Todas
        </button>
        <button
          className={`tab ${activeTab === 'aprobada' ? 'active' : ''}`}
          onClick={() => handleTabChange('aprobada')}
        >
          Aprobada
        </button>
        <button
          className={`tab ${activeTab === 'rechazada' ? 'active' : ''}`}
          onClick={() => handleTabChange('rechazada')}
        >
          Rechazada
        </button>
        <button
          className={`tab ${activeTab === 'en espera' ? 'active' : ''}`}
          onClick={() => handleTabChange('en espera')}
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
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.type}</td>
                <td>
                  {transaction.amount} <img src={transaction.flag} alt={transaction.type} />
                </td>
                <td className={transaction.status.toLowerCase()}>{transaction.status}</td>
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
