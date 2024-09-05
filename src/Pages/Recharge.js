import React, { useState, useEffect } from 'react';
import { NavBarUser } from '../Components/NavBarUser';
import { FaCheck,FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // FaTimesCircle para el ícono de error
import { CSSTransition } from 'react-transition-group';

function Recharge() {
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [amount, setAmount] = useState(''); // Nuevo campo para el monto
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // Para manejar el error en el paso 4
  const [transactionError, setTransactionError] = useState(false); // Controla si hubo un problema
  const [transactionDone, setTransactionDone] = useState(false); // Controla si la transacción ya fue intentada

  const totalSteps = 4;

  const balances = {
    EUR: 2500,
    USD: 3000,
    GBP: 1800,
  };

  const ibanInfo = {
    Banco1: 'IBAN: ES7600123456789012345678',
    Banco2: 'IBAN: ES7100234567890123456789',
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setStep(2); // Avanzar al siguiente paso
  };

  const handleMethodChange = (e) => {
    setSelectedMethod(e.target.value);
  };

  const handleBankChange = (e) => {
    setBankDetails(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateStep = () => {
    if (step === 2) {
      if (!selectedMethod) {
        setErrorMessage('Por favor, selecciona un método de recarga.');
        return false;
      }

      if (selectedMethod === 'transferencia' && (!bankDetails || !amount)) {
        setErrorMessage('Por favor, selecciona un banco y un monto.');
        return false;
      }

      if (
        (selectedMethod === 'efectivoBBVA' || selectedMethod === 'efectivoSantander') &&
        (!document.querySelector('input[placeholder="Nombre"]').value ||
          !document.querySelector('input[placeholder="Teléfono"]').value ||
          !document.querySelector('input[placeholder="Código"]').value)
      ) {
        setErrorMessage('Por favor, completa todos los campos de Efectivo Móvil.');
        return false;
      }
    }

    if (step === 3 && !file) {
      setErrorMessage('Por favor, selecciona un archivo de comprobante.');
      return false;
    }

    setErrorMessage(''); // Resetear el mensaje de error
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const goToStep = (targetStep) => {
    if (step < totalSteps && targetStep < step) {
      setStep(targetStep);
    }
  };

  // Simulación de transacción aleatoria
  useEffect(() => {
    if (step === 4 && !transactionDone) {
      const isSuccess = Math.random() > 0.5; // Generar aleatoriamente si la transacción es exitosa o fallida
      setTransactionError(!isSuccess); // true si falla, false si es exitosa
      setTransactionDone(true); // Marcar como que la transacción ya fue intentada
    }
  }, [step, transactionDone]);

  const resetRecharge = () => {
    setStep(1);
    setSelectedCurrency('');
    setSelectedMethod('');
    setBankDetails('');
    setAmount('');
    setFile(null);
    setTransactionError(false);
    setTransactionDone(false);
  };

  return (
    <div className="recharge">
      <NavBarUser />
      <h1>Recargar Saldo</h1>

      {/* Mostrar los saldos disponibles con menor protagonismo */}
      <div className="balances-info">
        <div>Saldo en Euros: €{balances.EUR.toFixed(2)}</div>
        <div>Saldo en Dólares: ${balances.USD.toFixed(2)}</div>
        <div>Saldo en Libras: £{balances.GBP.toFixed(2)}</div>
      </div>

      {/* Step Tracker */}
      <div className="step-tracker">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`step ${step >= stepNumber ? (step > stepNumber ? 'completed' : 'active') : ''}`}
            onClick={() => goToStep(stepNumber)}
            style={{ cursor: step < totalSteps && stepNumber < step ? 'pointer' : 'default' }}
          >
            <div className="step-circle">
              {step > stepNumber ? <FaCheck color="white" /> : stepNumber}
            </div>
            <p>{['Moneda', 'Método', 'Comprobante', 'Confirmación'][stepNumber - 1]}</p>
          </div>
        ))}
      </div>

      {/* Validación de error */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Paso 1: Selección de moneda */}
      <CSSTransition in={step === 1} timeout={300} classNames="fade" unmountOnExit>
        <div>
          <h2>¿Qué moneda quieres recargar?</h2>
          <p className="hint">Selecciona una opción para continuar</p>

          <div className="currency-selection">
            <div
              className={`currency-card ${selectedCurrency === 'EUR' ? 'active' : ''}`}
              onClick={() => handleCurrencyChange('EUR')}
            >
              <h3>Euros</h3>
              <p>€</p>
            </div>
            <div
              className={`currency-card ${selectedCurrency === 'USD' ? 'active' : ''}`}
              onClick={() => handleCurrencyChange('USD')}
            >
              <h3>Dólares</h3>
              <p>$</p>
            </div>
            <div
              className={`currency-card ${selectedCurrency === 'GBP' ? 'active' : ''}`}
              onClick={() => handleCurrencyChange('GBP')}
            >
              <h3>Libras</h3>
              <p>£</p>
            </div>
          </div>
        </div>
      </CSSTransition>

      {/* Paso 2: Selección de método */}
      <CSSTransition in={step === 2} timeout={300} classNames="fade" unmountOnExit>
        <div className="form-container-edit">
          <h2>Selecciona el método de recarga</h2>
          <select className="custom-method-select" onChange={handleMethodChange} value={selectedMethod}>
            <option value="">Selecciona el método</option>
            {selectedCurrency === 'EUR' && (
              <>
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="efectivoBBVA">Efectivo Móvil BBVA</option>
                <option value="efectivoSantander">Efectivo Por Cajero Santander</option>
                <option value="efectivoMadrid">Entrega en efectivo en Madrid</option>
              </>
            )}
            {selectedCurrency === 'USD' && (
              <option value="transferenciaUSA">Transferencia Bancaria - Bank of America</option>
            )}
            {selectedCurrency === 'GBP' && (
              <option value="transferenciaUK">Transferencia Bancaria</option>
            )}
          </select>

          {/* Campos para Transferencia Bancaria */}
          {selectedMethod === 'transferencia' && (
            <div className="bank-details">
              <label>Selecciona el banco:</label>
              <select onChange={handleBankChange} className="custom-bank-select">
                <option value="">Selecciona un banco</option>
                <option value="Banco1">Banco Nacional de Crédito</option>
                <option value="Banco2">Banco de Venezuela</option>
              </select>
              {bankDetails && <p className="iban-info">{ibanInfo[bankDetails]}</p>}

              <div className="form-group">
                <label>Monto a transferir</label>
                <input
                  type="number"
                  className="custom-form-input"
                  placeholder="Introduce el monto"
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>
          )}

          {/* Campos para Efectivo Móvil */}
          {(selectedMethod === 'efectivoBBVA' || selectedMethod === 'efectivoSantander') && (
            <div className="efectivo-movil">
              <p>Deberás realizar un efectivo móvil a tu nombre y a tu número telefónico.</p>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" className="custom-form-input" placeholder="Nombre" />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="text" className="custom-form-input" placeholder="Teléfono" />
              </div>
              <div className="form-group">
                <label>Código de la transacción</label>
                <input type="text" className="custom-form-input" placeholder="Código" />
              </div>
            </div>
          )}

          {/* Entrega en Efectivo en Madrid */}
          {selectedMethod === 'efectivoMadrid' && (
            <div className="efectivo-madrid">
              <p>
                Para entregas en efectivo, deberás contactarte por correo electrónico o WhatsApp.
              </p>
              <button
                onClick={() => window.open('mailto:info@genericemail.com')}
                className="contact-button"
              >
                Correo electrónico
              </button>
              <button
                onClick={() => window.open('https://wa.me/123456789')}
                className="contact-button"
              >
                WhatsApp
              </button>
            </div>
          )}

          {/* Archivo de comprobante */}
          {selectedMethod && (
            <>
              <div className="file-upload">
                <h4>Adjuntar comprobante de pago</h4>
                <input type="file" onChange={handleFileChange} />
              </div>

              <div className="form-actions">
                <button className="back-button" onClick={handlePreviousStep}>Volver</button>
                <button className="continue-button" onClick={handleNextStep}>Continuar</button>
              </div>
            </>
          )}
        </div>
      </CSSTransition>

      {/* Paso 3: Confirmar comprobante */}
      <CSSTransition in={step === 3} timeout={300} classNames="fade" unmountOnExit>
        <div className="form-container-edit step-3">
          <h2>Confirmar Comprobante</h2>
          {file && <p>Archivo seleccionado: {file.name}</p>}

          <div className="form-actions">
            <button className="back-button" onClick={handlePreviousStep}>Volver</button>
            <button className="continue-button" onClick={handleNextStep}>Confirmar</button>
          </div>
        </div>
      </CSSTransition>

      {/* Paso 4: Confirmación final */}
      <CSSTransition in={step === 4} timeout={300} classNames="fade" unmountOnExit>
        <div className="form-container-edit step-4">
          <h2>{transactionError ? '¡Ocurrió un problema!' : '¡Recarga Exitosa!'}</h2>
          <p>
            {transactionError
              ? 'Hubo un error en la transacción. Por favor, intenta nuevamente más tarde.'
              : 'En breve se verá reflejado el estatus de tu transferencia.'}
          </p>
          {transactionError ? (
            <FaTimesCircle size={50} color="#dc3545" />
          ) : (
            <FaCheckCircle size={50} color="#28a745" />
          )}

          <div className="form-actions">
            <button className="another-recharge-button" onClick={resetRecharge}>
              Realizar otra recarga
            </button>
            <button className="finish-button" onClick={() => (window.location.href = '/changes')}>
              Finalizar
            </button>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

export { Recharge };
