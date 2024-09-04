import React, { useState } from 'react';
import venezuelaFlag from '../Assets/Images/venezuela.png';
import { NavBarUser } from '../Components/NavBarUser';
import { FaCheckCircle } from 'react-icons/fa'; // Icono de check para confirmación
import { StepTracker } from '../Components/StepTracker'; // Importación del componente StepTracker

function SendMoney() {
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [amountToSend, setAmountToSend] = useState('');
  const [amountToReceive, setAmountToReceive] = useState('');
  const [step, setStep] = useState(1); // Controla los pasos del formulario
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [showAlert, setShowAlert] = useState(false); // Controla la visibilidad de la alerta
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla el estado del modal
  const [selectedOption, setSelectedOption] = useState(''); // Controla la opción seleccionada (Pago Móvil o Cuenta Bancaria)
  const [newBeneficiary, setNewBeneficiary] = useState({
    nombre: '',
    cedula: '',
    banco: '',
    cuenta: '',
    tipoCuenta: '',
    telefono: '',
  });

  

  const exchangeRates = {
    EUR: 1.2,
    USD: 1.1,
    GBP: 1.5,
  };

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
    setAmountToReceive((amountToSend * exchangeRates[e.target.value]).toFixed(2));
  };

  const handleAmountToSendChange = (e) => {
    const value = e.target.value;
    setAmountToSend(value);
    const exchangeRate = exchangeRates[selectedCurrency];
    setAmountToReceive((value * exchangeRate).toFixed(2));
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Función para actualizar los campos del nuevo beneficiario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBeneficiary((prev) => ({ ...prev, [name]: value }));
  };

  const validateAmount = () => {
    const minAmount = 20;
    const maxAmount = balances[selectedCurrency];

    if (amountToSend < minAmount) {
      alert(`El monto mínimo a enviar es ${minAmount} ${selectedCurrency}`);
      return false;
    }

    if (amountToSend > maxAmount) {
      alert(`No puedes enviar más de tu saldo disponible: ${maxAmount} ${selectedCurrency}`);
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (validateAmount()) {
      setStep(step + 1); // Pasar al siguiente paso
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleBeneficiarySelect = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setStep(3); // Pasar al paso de confirmación
  };

  const handleConfirm = () => {
    // Lógica de envío de los datos
    setShowAlert(true); // Mostrar alerta de éxito
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const balances = {
    EUR: 2500,
    USD: 3000,
    GBP: 1800,
  };

  const beneficiaries = [
    {
      name: 'Maribel Esther Montes...',
      cedula: 'v10452171',
      banco: 'Banco Nacional De Credito BNC',
      cuenta: '0191003163103151',
      tipoCuenta: 'Cuenta de Ahorro',
      estado: 'Activo',
    },
    {
      name: 'Carlos Pérez',
      cedula: 'v20931293',
      banco: 'Banco Venezolano de Crédito',
      cuenta: '0191002163203171',
      tipoCuenta: 'Cuenta de Ahorro',
      estado: 'Activo',
    },
  ];

  return (
    <div className="send-money">
      <NavBarUser />

      {/* Integración del Step Tracker */}
      <StepTracker currentStep={step} /> 

      <h1>¿Cuánto quieres enviar?</h1>

      {/* Paso 1: Formulario de selección de moneda y montos */}
      {step === 1 && (
        <>
          <div className="balances-cards">
            <div className="balance-item">
              <h3>Saldo en Euros</h3>
              <p>€{balances.EUR.toFixed(2)}</p>
            </div>
            <div className="balance-item">
              <h3>Saldo en Dólares</h3>
              <p>${balances.USD.toFixed(2)}</p>
            </div>
            <div className="balance-item">
              <h3>Saldo en Libras Esterlinas</h3>
              <p>£{balances.GBP.toFixed(2)}</p>
            </div>
          </div>

          {/* Mostrar tasa de cambio */}
          <div className="exchange-rate">
            <p>Tasa de cambio: 1 {selectedCurrency} = {exchangeRates[selectedCurrency]} Bs</p>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor="currency">Moneda a enviar</label>
              <select id="currency" value={selectedCurrency} onChange={handleCurrencyChange}>
                <option value="EUR">Euros (€)</option>
                <option value="USD">Dólares ($)</option>
                <option value="GBP">Libras (£)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount-send">Monto a enviar</label>
              <input
                type="number"
                id="amount-send"
                value={amountToSend}
                onChange={handleAmountToSendChange}
                placeholder="Ingrese monto"
              />
              <small>Saldo disponible: {selectedCurrency === 'EUR' ? `€${balances.EUR}` : selectedCurrency === 'USD' ? `$${balances.USD}` : `£${balances.GBP}`}</small>
            </div>

            <div className="form-group">
              <label htmlFor="amount-receive">Monto a recibir</label>
              <input
                type="number"
                id="amount-receive"
                value={amountToReceive}
                readOnly
                placeholder="Calculando..."
              />
            </div>

            <div className="exchange-rate-box">
              <h4>Tasa de cambio</h4>
              <p>{`1 ${selectedCurrency} = ${exchangeRates[selectedCurrency]} Bs.`}</p>
            </div>

            {/* Botón de continuar */}
            <div className="form-actions">
              <button className="continue-button" onClick={handleContinue}>Continúa</button>
            </div>
          </div>
        </>
      )}

      {/* Paso 2: Selección de beneficiario */}
      {step === 2 && (
        <div className="beneficiary-step">
          <h2>Selecciona un beneficiario</h2>
          <div className="beneficiaries-list">
            {beneficiaries.map((beneficiary, index) => (
              <div className="beneficiary-card" key={index} onClick={() => handleBeneficiarySelect(beneficiary)}>
                <img src={venezuelaFlag} alt="Venezuela flag" className="flag-icon" />
                <div className="beneficiary-info">
                  <h3>{beneficiary.name}</h3>
                  <p>Cédula: {beneficiary.cedula}</p>
                  <p>Banco: {beneficiary.banco}</p>
                  <p>Cuenta: {beneficiary.cuenta}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button className="back-button" onClick={handleBack}>Volver</button>
            <button className="add-beneficiary-button" onClick={openModal}>Nuevo Beneficiario</button>
          </div>
        </div>
      )}

      {/* Paso 3: Confirmación */}
      {step === 3 && selectedBeneficiary && (
        <div className="confirmation-step">
          <h2>Confirma los detalles</h2>
          <p><strong>Moneda a enviar:</strong> {selectedCurrency}</p>
          <p><strong>Monto a enviar:</strong> {amountToSend} {selectedCurrency}</p>
          <p><strong>Monto a recibir:</strong> {amountToReceive}</p>
          <h3>Beneficiario seleccionado</h3>
          <p><strong>Nombre:</strong> {selectedBeneficiary.name}</p>
          <p><strong>Cédula:</strong> {selectedBeneficiary.cedula}</p>
          <p><strong>Banco:</strong> {selectedBeneficiary.banco}</p>
          <p><strong>Cuenta:</strong> {selectedBeneficiary.cuenta}</p>

          <div className="form-actions">
            <button className="back-button" onClick={handleBack}>Volver</button>
            <button className="confirm-button" onClick={handleConfirm}>Confirmar y Enviar</button>
          </div>
        </div>
      )}

      {/* Modal de nuevo beneficiario */}
      {isModalOpen && (
        <div className={`modal ${isModalOpen ? 'open' : 'close'}`}>
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <h2>Agregar Nuevo Beneficiario</h2>
            
            {/* Nombre y apellido */}
            <label>Nombre y Apellido</label>
            <input
              type="text"
              name="nombre"
              value={newBeneficiary.nombre}
              onChange={handleChange}
              placeholder="Ingresa el nombre y apellido"
            />

            {/* Cédula */}
            <label>Cédula</label>
            <input
              type="text"
              name="cedula"
              value={newBeneficiary.cedula}
              onChange={handleChange}
              placeholder="Ingresa la cédula"
            />

            {/* Selección de tipo de transacción */}
            <label>Seleccione el tipo de transacción</label>
            <select value={selectedOption} onChange={handleOptionChange}>
              <option value="">Seleccione...</option>
              <option value="pagoMovil">Pago Móvil</option>
              <option value="cuentaBancaria">Cuenta Bancaria</option>
            </select>

            {/* Campos dinámicos */}
            {selectedOption === 'pagoMovil' && (
              <>
                <label>Número de Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={newBeneficiary.telefono}
                  onChange={handleChange}
                  placeholder="Ingresa el número de teléfono"
                />
                <label>Banco</label>
                <select name="banco" value={newBeneficiary.banco} onChange={handleChange}>
                  <option value="">Selecciona el banco</option>
                  <option value="Banco de Venezuela">Banco de Venezuela</option>
                  <option value="Banesco">Banesco</option>
                  <option value="Mercantil">Mercantil</option>
                  {/* Otros bancos de Venezuela */}
                </select>
              </>
            )}

            {selectedOption === 'cuentaBancaria' && (
              <>
                <label>Cuenta Bancaria</label>
                <input
                  type="text"
                  name="cuenta"
                  value={newBeneficiary.cuenta}
                  onChange={handleChange}
                  placeholder="Ingresa el número de cuenta"
                />
                <label>Banco</label>
                <select name="banco" value={newBeneficiary.banco} onChange={handleChange}>
                  <option value="">Selecciona el banco</option>
                  <option value="Banco de Venezuela">Banco de Venezuela</option>
                  <option value="Banesco">Banesco</option>
                  <option value="Mercantil">Mercantil</option>
                  {/* Otros bancos de Venezuela */}
                </select>
              </>
            )}

            {/* Botón para guardar */}
            <button className="submit-button">Guardar Beneficiario</button>
          </div>
        </div>
      )}

      {/* Alerta de confirmación */}
      {showAlert && (
        <div className="alert">
          <FaCheckCircle size={50} color="#28a745" />
          <h3>¡Transacción exitosa!</h3>
          <p>¿Deseas realizar otra transacción?</p>
          <div className="alert-actions">
            <button className="alert-button" onClick={() => {
              setStep(1);  // Volver al paso inicial
              setAmountToSend('');  // Limpiar el monto a enviar
              setAmountToReceive('');  // Limpiar el monto a recibir
              setSelectedBeneficiary(null);  // Limpiar beneficiario
              setShowAlert(false);  // Cerrar la alerta
            }}>Sí</button>
            <button className="alert-button" onClick={() => (window.location.href = '/changes')}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export { SendMoney };
