import React, { useState } from 'react';
import { NavBarUser } from '../Components/NavBarUser';
import { FaCheckCircle } from 'react-icons/fa';
import { CSSTransition } from 'react-transition-group'; // Para las animaciones de transición

function Recharge() {
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [file, setFile] = useState(null);
  const [isAnotherRecharge, setIsAnotherRecharge] = useState(false);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleAnotherRecharge = () => {
    setIsAnotherRecharge(true);
    setStep(1);
    setSelectedCurrency('');
    setSelectedMethod('');
    setBankDetails('');
    setFile(null);
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
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-circle">{step > 1 ? '✓' : '1'}</div>
          <p>Moneda</p>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-circle">{step > 2 ? '✓' : '2'}</div>
          <p>Método</p>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-circle">{step > 3 ? '✓' : '3'}</div>
          <p>Comprobante</p>
        </div>
        <div className={`step ${step === 4 ? 'active' : ''}`}>
          <div className="step-circle">{step === 4 ? '✓' : '4'}</div>
          <p>Confirmación</p>
        </div>
      </div>

      {/* Paso 1: Selección de moneda */}
      <CSSTransition in={step === 1} timeout={300} classNames="fade" unmountOnExit>
        <div>
          <h2>¿Qué moneda quieres recargar?</h2>
          <p className="hint">Selecciona una opción para continuar</p>

          {/* Selección de moneda con estilo mejorado */}
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
            </div>
          )}

          {/* Campos para Efectivo Móvil BBVA o Santander */}
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
          <h2>¡Recarga Exitosa!</h2>
          <p>En breve se verá reflejado el estatus de tu transferencia.</p>
          <FaCheckCircle size={50} color="#28a745" />

          <div className="form-actions">
            <button className="another-recharge-button" onClick={handleAnotherRecharge}>
              Realizar otra recarga
            </button>
            {isAnotherRecharge && <p>Iniciando otra recarga...</p>}

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
