import React, { useState, useEffect, useCallback } from 'react';
import venezuelaFlag from '../Assets/Images/venezuela.png';
import { NavBarUser } from '../Components/NavBarUser';
import axios from 'axios';
import { useDataContext } from '../Context/dataContext';
import { ToastContainer, toast } from 'react-toastify';

function Directory() {
  const { logged, accessToken, url, infoTkn } = useDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(''); // Controla la opción seleccionada (Pago Móvil o Cuenta Bancaria)

  //DATOS PARA BENEFICIARIO
  const [accbsUser_bank, setAccbsUser_bank] = useState('');
  const [accbsUser_owner, setAccbsUser_owner] = useState('');
  const [accbsUser_number, setAccbsUser_number] = useState('');
  const [accbsUser_dni, setAccbsUser_dni] = useState('');
  const [accbsUser_phone, setAccbsUser_phone] = useState('');
  const [accbsUser_type, setAccbsUser_type] = useState('');

  //DATOS DE USUARIO
  const [user, setUser] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);

   // Prefijos para cédula y teléfono
   const [cedulaPrefix, setCedulaPrefix] = useState('V'); // Valor por defecto "V"
   const [telefonoPrefix, setTelefonoPrefix] = useState('0414'); // Valor por defecto "0414"

  // Fetch de datos del usuario (Incluye directorio)
  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setUser(response.data);

      const responseDirectory = await axios.get(
        `${url}/AccBsUser/user/${response.data.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUserDirectory(responseDirectory.data);

    } catch (error) {
      console.log(error);
    }
  }, [setUser, infoTkn, url]);

  // const fetchDataAccUser = useCallback(async () => {
  //   try {
  //     const response = await axios.get(
  //       `${url}/AccBsUser/user/${user.use_id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${infoTkn}`,
  //         },
  //       }
  //     );
  //     setUserDirectory(response.data);

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [setUserDirectory, infoTkn, url, user]);

  // Función para alternar abrir y cerrar el modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  // Función para cambiar el estado de Activo a Inactivo y viceversa
  // const toggleEstado = (index) => {
  //   setBeneficiarios((prevBeneficiarios) => {
  //     const updatedBeneficiarios = [...prevBeneficiarios];
  //     updatedBeneficiarios[index].estado =
  //       updatedBeneficiarios[index].estado === 'Activo' ? 'Inactivo' : 'Activo';
  //     return updatedBeneficiarios;
  //   });
  // };

  const handleAddAccountSubmit = async event => {
    event.preventDefault();
    try {
      await axios.post(`${url}/AccBsUser/create`,
        {
          accbsUser_bank,
          accbsUser_owner,
          accbsUser_number,
          accbsUser_dni: cedulaPrefix + accbsUser_dni,
          accbsUser_phone: telefonoPrefix + accbsUser_phone, 
          accbsUser_type,
          accbsUser_status : 'activo',
          accbsUser_userId: user.use_id,
        },
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        },
      );

      // Refresh the page after adding account
      // fetchDataAccUser();
      window.location.reload();

      toast.success('Cuenta agregada con éxito!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
      toast.error('Error al agregar la cuenta', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, [fetchDataUser]);

  return (
    <div className="directorio">
      <NavBarUser />

      <div className="directorio__header">
        <h1>Tus Beneficiarios</h1>
        <div className="directorio__actions">
          <button className="action-button">Ver inactivos</button>
          <button className="action-button" onClick={toggleModal}>
            Nuevo beneficiario
          </button>
        </div>
      </div>

      <div className="directorio__list">
        {userDirectory.map((beneficiario) => (
          <div className="beneficiario-card" key={beneficiario.accbsUser_id}>
            <img src={venezuelaFlag} alt="Venezuela flag" className="flag-icon" />
            <div className="beneficiario-info">
              <h3>{beneficiario.accbsUser_owner}</h3>
              <p>Transferencia bancaria</p>
              <p>Cédula: {beneficiario.accbsUser_dni}</p>
              <p>Banco: {beneficiario.accbsUser_bank}</p>
              <p>Cuenta: {beneficiario.accbsUser_number}</p>
              <p>Número teléfonico: {beneficiario.accbsUser_phone}</p>
              <p>{beneficiario.accbsUser_type}</p>
            </div>
            <button className="remesa-button">Envía tu Remesa</button>
            <span className={`estado `}>
              Activo
            </span>
          </div>
        ))}
      </div>

      {/* Modal para agregar nuevo beneficiario */}
      {isModalOpen && (
        <div className={`modal ${isModalOpen ? 'open' : 'close'}`}>
          <div className="modal-content">
            <button className="close-button" onClick={toggleModal}>
              &times;
            </button>
            <h2>Agregar Nuevo Beneficiario</h2>

            {/* Nombre y apellido */}
            <label>Nombre y Apellido</label>
            <input
              type="text"
              name="nombre"
              value={accbsUser_owner}
              onChange={(e) => setAccbsUser_owner(e.target.value)}
              placeholder="Ingresa el nombre y apellido"
            />

            {/* Cédula */}
            <label>Cédula</label>
            <div className="cedula-input">
              <select
                name="prefijoCedula"
                className="cedula-prefix"
                value={cedulaPrefix}
                onChange={(e) => setCedulaPrefix(e.target.value)}
              >
                <option value="V">V</option>
                <option value="E">E</option>
                <option value="J">J</option>
                <option value="P">P</option>
              </select>
              <input
                type="text"
                name="cedula"
                value={accbsUser_dni}
                onChange={(e) => setAccbsUser_dni(e.target.value)}
                placeholder="Ingresa la cédula"
              />
            </div>

            {/* Selección de tipo de transacción */}
            <label>Seleccione el tipo de transacción</label>
            <select value={accbsUser_type} onChange={(e) => setAccbsUser_type(e.target.value)}>
              <option value="">Seleccione...</option>
              <option value="pagoMovil">Pago Móvil</option>
              <option value="cuentaBancaria">Cuenta Bancaria</option>
            </select>

            {/* Campos dinámicos */}
            {accbsUser_type === 'pagoMovil' && (
              <>
                {/* Número de Teléfono */}
                 {/* Número de Teléfono */}
                 <label>Número de Teléfono</label>
                <div className="telefono-input">
                  <select
                    name="prefijoTelefono"
                    className="telefono-prefix"
                    value={telefonoPrefix}
                    onChange={(e) => setTelefonoPrefix(e.target.value)}
                  >
                    <option value="0414">0414</option>
                    <option value="0424">0424</option>
                    <option value="0412">0412</option>
                    <option value="0416">0416</option>
                    <option value="0426">0426</option>
                  </select>
                  <input
                    type="text"
                    name="telefono"
                    value={accbsUser_phone}
                    onChange={(e) => setAccbsUser_phone(e.target.value)}
                    placeholder="Ingresa el número telefónico"
                  />
                </div>

                <label>Banco</label>
                <select name="banco" value={accbsUser_bank} onChange={(e) => setAccbsUser_bank(e.target.value)}>
                  <option value="">Selecciona el banco</option>
                  <option value="Banco de Venezuela">Banco de Venezuela</option>
                  <option value="Banesco">Banesco</option>
                  <option value="Mercantil">Mercantil</option>
                  {/* Otros bancos de Venezuela */}
                </select>
              </>
            )}

            {accbsUser_type === 'cuentaBancaria' && (
              <>
                <label>Cuenta Bancaria</label>
                <input
                  type="text"
                  name="cuenta"
                  value={accbsUser_number}
                  onChange={(e) => setAccbsUser_number(e.target.value)}
                  placeholder="Ingresa el número de cuenta"
                />
                <label>Banco</label>
                <select name="banco" value={accbsUser_bank} onChange={(e) => setAccbsUser_bank(e.target.value)}>
                  <option value="">Selecciona el banco</option>
                  <option value="Banco de Venezuela">Banco de Venezuela</option>
                  <option value="Banesco">Banesco</option>
                  <option value="Mercantil">Mercantil</option>
                  {/* Otros bancos de Venezuela */}
                </select>
              </>
            )}

            {/* Botón para guardar */}
            <button onClick={handleAddAccountSubmit} className="submit-button">Guardar Beneficiario</button>
          </div>
        </div>
      )}
    </div>
  );
}

export { Directory };