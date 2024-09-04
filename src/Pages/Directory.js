import React, { useState } from 'react';
import venezuelaFlag from '../Assets/Images/venezuela.png';
import { NavBarUser } from '../Components/NavBarUser';

function Directory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(''); // Controla la opción seleccionada (Pago Móvil o Cuenta Bancaria)
  const [newBeneficiary, setNewBeneficiary] = useState({
    nombre: '',
    cedula: '',
    banco: '',
    cuenta: '',
    tipoCuenta: '',
    telefono: '',
  });

  const [beneficiarios, setBeneficiarios] = useState([
    {
      nombre: 'Maribel Esther Montes...',
      cedula: 'v10452171',
      banco: 'Banco Nacional De Credito BNC',
      cuenta: '0191003163103151',
      tipoCuenta: 'Cuenta de Ahorro',
      estado: 'Activo',
    },
    {
      nombre: 'Carlos Pérez',
      cedula: 'v20931293',
      banco: 'Banco Venezolano de Crédito',
      cuenta: '0191002163203171',
      tipoCuenta: 'Cuenta de Ahorro',
      estado: 'Activo',
    },
    // Agrega más beneficiarios si lo necesitas
  ]);

  // Función para manejar el cambio en el formulario dinámico
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Función para actualizar los campos del nuevo beneficiario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBeneficiary((prev) => ({ ...prev, [name]: value }));
  };

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal con animación
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Función para cambiar el estado de Activo a Inactivo y viceversa
  const toggleEstado = (index) => {
    setBeneficiarios((prevBeneficiarios) => {
      const updatedBeneficiarios = [...prevBeneficiarios];
      updatedBeneficiarios[index].estado =
        updatedBeneficiarios[index].estado === 'Activo' ? 'Inactivo' : 'Activo';
      return updatedBeneficiarios;
    });
  };

  return (
    <div className="directorio">
      <NavBarUser />

      <div className="directorio__header">
        <h1>Tus Beneficiarios</h1>
        <div className="directorio__actions">
          <button className="action-button">Ver inactivos</button>
          <button className="action-button" onClick={openModal}>
            Nuevo beneficiario
          </button>
        </div>
      </div>

      <div className="directorio__list">
        {beneficiarios.map((beneficiario, index) => (
          <div className="beneficiario-card" key={index}>
            <img src={venezuelaFlag} alt="Venezuela flag" className="flag-icon" />
            <div className="beneficiario-info">
              <h3>{beneficiario.nombre}</h3>
              <p>Transferencia bancaria</p>
              <p>Cédula: {beneficiario.cedula}</p>
              <p>Banco: {beneficiario.banco}</p>
              <p>Cuenta: {beneficiario.cuenta}</p>
              <p>{beneficiario.tipoCuenta}</p>
            </div>
            <button className="remesa-button">Envía tu Remesa</button>
            <span
              className={`estado ${beneficiario.estado.toLowerCase()}`}
              onClick={() => toggleEstado(index)}
            >
              {beneficiario.estado}
            </span>
          </div>
        ))}
      </div>

      {/* Modal para agregar nuevo beneficiario */}
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
    </div>
  );
}

export { Directory };
