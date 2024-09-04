import React, { useState } from 'react';
import profileIcon from '../Assets/Images/profileicon.png';
import euroIcon from '../Assets/Images/euro.png';
import poundIcon from '../Assets/Images/pound.png';
import dollarIcon from '../Assets/Images/dollar.png';
import spainFlag from '../Assets/Images/spain.png';
import venezuelaFlag from '../Assets/Images/venezuela.png';
import usaFlag from '../Assets/Images/usa.png';
import {  FaEye } from 'react-icons/fa'; // Importación de íconos
import {NavBarUser} from '../Components/NavBarUser';

function Changes() {
  const [activeTab, setActiveTab] = useState('recargar');
  const [isTasaOpen, setIsTasaOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleTasaOpen = () => {
    setIsTasaOpen(!isTasaOpen);
  };

  return (
    <div className="changes">
      <NavBarUser />
      <div className="changes__header">
        <h1>Bienvenido, Usuario</h1>
        <div className="changes__profile">
          <img src={profileIcon} alt="Profile" className="profile-pic" />
        </div>
      </div>

      <div className="changes__balances">
        <div className="balance-item">
          <h3>Saldo en Euros</h3>
          <p>€2,500.00</p>
        </div>
        <div className="balance-item">
          <h3>Saldo en Dólares</h3>
          <p>$3,000.00</p>
        </div>
        <div className="balance-item">
          <h3>Saldo en Libras Esterlinas</h3>
          <p>£1,800.00</p>
        </div>
      </div>

      {/* Tasa de cambio */}
      <div className="changes__tasa">
        <h2 onClick={toggleTasaOpen} className="tasa-header">Tasas de Cambio {isTasaOpen ? "▲" : "▼"}</h2>
        <div className={`tasa-content ${isTasaOpen ? 'open' : 'closed'}`}>
          <div className="tasa-item">
            <img src={euroIcon} alt="Euro icon" />
            <p>Euros a Bolívares</p>
            <span>1 EUR = X Bs</span>
          </div>
          <div className="tasa-item">
            <img src={poundIcon} alt="Pound icon" />
            <p>Libras a Bolívares</p>
            <span>1 GBP = X Bs</span>
          </div>
          <div className="tasa-item">
            <img src={dollarIcon} alt="Dollar icon" />
            <p>Dólares a Bolívares</p>
            <span>1 USD = X Bs</span>
          </div>
          <div className="tasa-item">
            <img src={poundIcon} alt="Pound icon" />
            <p>Libras a Dólares</p>
            <span>1 GBP = X USD</span>
          </div>
          <div className="tasa-item">
            <img src={euroIcon} alt="Euro icon" />
            <p>Euros a Dólares</p>
            <span>1 EUR = X USD</span>
          </div>
        </div>
      </div>

      <div className="changes__actions">
        <button onClick={() => (window.location.href = '/recharge')} className="action-button green">Recargar Saldo</button>
        <button className="action-button green" onClick={() => (window.location.href = '/sendmoney')} >Enviar Remesas</button>
      </div>

      <div className="changes__tabs">
        <button
          className={activeTab === 'recargar' ? 'tab active' : 'tab'}
          onClick={() => handleTabChange('recargar')}
        >
          Movimientos de Recarga
        </button>
        <button
          className={activeTab === 'remesas' ? 'tab active' : 'tab'}
          onClick={() => handleTabChange('remesas')}
        >
          Movimientos de Remesas
        </button>
      </div>

      <div className="changes__content">
        {activeTab === 'recargar' ? (
          <div className="tab-content">
            <h3>Historial de Recargas</h3>
            <div className="table-responsive">
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
                  <tr>
                    <td>25/08/2024</td>
                    <td>407843</td>
                    <td>20,00 EUR <img src={spainFlag} alt="EUR" /></td>
                    <td className="cancelled">Cancelado</td>
                    <td><FaEye className="view-details-icon" /></td>
                  </tr>
                  <tr>
                    <td>26/08/2024</td>
                    <td>407844</td>
                    <td>30,00 USD <img src={usaFlag} alt="USD" /></td>
                    <td className="completed">Aprobado</td>
                    <td><FaEye className="view-details-icon" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            <h3>Historial de Remesas</h3>
            <div className="table-responsive">
              <table className="movements__table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Remesa</th>
                    <th>Beneficiario</th>
                    <th>Enviado</th>
                    <th>Recibido</th>
                    <th>Estado</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>25/08/2024</td>
                    <td>407845</td>
                    <td>Maribel Esther M...</td>
                    <td>20,00 EUR <img src={spainFlag} alt="EUR" /></td>
                    <td>86,20 VEF <img src={venezuelaFlag} alt="VEF" /></td>
                    <td className="cancelled">Cancelado</td>
                    <td><FaEye className="view-details-icon" /></td>
                  </tr>
                  <tr>
                    <td>26/08/2024</td>
                    <td>407846</td>
                    <td>Carlos Pérez</td>
                    <td>50,00 USD <img src={usaFlag} alt="USD" /></td>
                    <td>150,00 VEF <img src={venezuelaFlag} alt="VEF" /></td>
                    <td className="pending">En espera</td>
                    <td><FaEye className="view-details-icon" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Changes };
