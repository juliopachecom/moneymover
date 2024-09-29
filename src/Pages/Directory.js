import React, { useState, useEffect, useCallback } from 'react';
import venezuelaFlag from '../Assets/Images/venezuela.png';
import { NavBarUser } from '../Components/NavBarUser';
import axios from 'axios';
import { useDataContext } from '../Context/dataContext';
import { toast } from 'react-toastify';

function Directory() {
  const { url, infoTkn } = useDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // DATOS PARA BENEFICIARIO
  const [accbsUser_bank, setAccbsUser_bank] = useState('');
  const [accbsUser_owner, setAccbsUser_owner] = useState('');
  const [accbsUser_number, setAccbsUser_number] = useState('');
  const [accbsUser_dni, setAccbsUser_dni] = useState('');
  const [accbsUser_phone, setAccbsUser_phone] = useState('');
  const [accbsUser_type, setAccbsUser_type] = useState('');

  // Estado para validaciones
  const [errors, setErrors] = useState({});

  // Estado del usuario
  const [user, setUser] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);

  // Prefijos para cédula y teléfono
  const [cedulaPrefix, setCedulaPrefix] = useState('V');
  const [telefonoPrefix, setTelefonoPrefix] = useState('0414');

  // Fetch de datos del usuario
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

  // Alternar modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};

    if (!accbsUser_owner) {
      newErrors.accbsUser_owner = 'El nombre es requerido.';
    }

    if (!accbsUser_dni) {
      newErrors.accbsUser_dni = 'La cédula es requerida.';
    }

    if (accbsUser_type === 'pagoMovil') {
      if (!accbsUser_phone) {
        newErrors.accbsUser_phone = 'El número telefónico es requerido.';
      } else if (!/^\d+$/.test(accbsUser_phone)) {
        newErrors.accbsUser_phone = 'El número telefónico solo puede contener dígitos.';
      }
      else if (accbsUser_phone.length !== 7) {
        newErrors.accbsUser_phone = 'El número telefónico debe tener 7 dígitos.';
      }

    } else if (accbsUser_type === 'cuentaBancaria') {
      if (!accbsUser_number) {
        newErrors.accbsUser_number = 'El número de cuenta es requerido.';
      } else if (!/^\d+$/.test(accbsUser_number)) {
        newErrors.accbsUser_number = 'El número de cuenta solo puede contener dígitos.';
      } else if (accbsUser_number.length !== 20) {
        newErrors.accbsUser_number = 'El número de cuenta debe tener 20 dígitos.';
      }
    }

    if (!accbsUser_bank) {
      newErrors.accbsUser_bank = 'El banco es requerido.';
    }

    if (!accbsUser_type) {
      newErrors.accbsUser_type = 'Seleccione un tipo de transacción.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAccountSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post(`${url}/AccBsUser/create`, {
        accbsUser_bank,
        accbsUser_owner,
        accbsUser_number,
        accbsUser_dni: cedulaPrefix + accbsUser_dni,
        accbsUser_phone: telefonoPrefix + accbsUser_phone,
        accbsUser_type,
        accbsUser_status: 'activo',
        accbsUser_userId: user.use_id,
      }, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });

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
          <button className="action-button" onClick={toggleModal}>Nuevo beneficiario</button>
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
            <span className="estado">Activo</span>
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
            {errors.accbsUser_owner && <span className="error">{errors.accbsUser_owner}</span>}

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
            {errors.accbsUser_dni && <span className="error">{errors.accbsUser_dni}</span>}

            {/* Selección de tipo de transacción */}
            <label>Seleccione el tipo de transacción</label>
            <select value={accbsUser_type} onChange={(e) => setAccbsUser_type(e.target.value)}>
              <option value="">Seleccione...</option>
              <option value="pagoMovil">Pago Móvil</option>
              <option value="cuentaBancaria">Cuenta Bancaria</option>
            </select>
            {errors.accbsUser_type && <span className="error">{errors.accbsUser_type}</span>}

            {/* Campos dinámicos */}
            {accbsUser_type === 'pagoMovil' && (
              <>
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
                {errors.accbsUser_phone && <span className="error">{errors.accbsUser_phone}</span>}

                <label>Banco</label>
                <select name="banco" value={accbsUser_bank} onChange={(e) => setAccbsUser_bank(e.target.value)}>
                  <option value="">Selecciona el banco</option>
                  <option value="0102 - Banco de Venezuela, S.A. Banco Universal">0102 - Banco de Venezuela, S.A. Banco Universal</option>
                  <option value="0104 - Banco Venezolano de Crédito, S.A. Banco Universal">0104 - Banco Venezolano de Crédito, S.A. Banco Universal</option>
                  <option value="0105 - Banco Mercantil C.A., Banco Universal">0105 - Banco Mercantil C.A., Banco Universal</option>
                  <option value="0108 - Banco Provincial, S.A. Banco Universal">0108 - Banco Provincial, S.A. Banco Universal</option>
                  <option value="0114 - Banco del Caribe C.A., Banco Universal">0114 - Banco del Caribe C.A., Banco Universal</option>
                  <option value="0115 - Banco Exterior C.A., Banco Universal">0115 - Banco Exterior C.A., Banco Universal</option>
                  <option value="0128 - Banco Caroní C.A., Banco Universal">0128 - Banco Caroní C.A., Banco Universal</option>
                  <option value="0134 - Banesco Banco Universal, C.A.">0134 - Banesco Banco Universal, C.A.</option>
                  <option value="0137 - Banco Sofitasa Banco Universal, C.A.">0137 - Banco Sofitasa Banco Universal, C.A.</option>
                  <option value="0138 - Banco Plaza, Banco universal">0138 - Banco Plaza, Banco universal</option>
                  <option value="0146 - Banco de la Gente Emprendedora C.A.">0146 - Banco de la Gente Emprendedora C.A.</option>
                  <option value="0151 - Banco Fondo Común, C.A Banco Universal">0151 - Banco Fondo Común, C.A Banco Universal</option>
                  <option value="0156 - 100% Banco, Banco Comercial, C.A">0156 - 100% Banco, Banco Comercial, C.A</option>
                  <option value="0157 - DelSur, Banco Universal C.A.">0157 - DelSur, Banco Universal C.A.</option>
                  <option value="0163 - Banco del Tesoro C.A., Banco Universal">0163 - Banco del Tesoro C.A., Banco Universal</option>
                  <option value="0166 - Banco Agrícola de Venezuela C.A., Banco Universal">0166 - Banco Agrícola de Venezuela C.A., Banco Universal</option>
                  <option value="0168 - Bancrecer S.A., Banco Microfinanciero">0168 - Bancrecer S.A., Banco Microfinanciero</option>
                  <option value="0169 - Mi Banco, Banco Microfinanciero, C.A.">0169 - Mi Banco, Banco Microfinanciero, C.A.</option>
                  <option value="0171 - Banco Activo C.A., Banco Universal">0171 - Banco Activo C.A., Banco Universal</option>
                  <option value="0172 - Bancamiga Banco Universal, C.A.">0172 - Bancamiga Banco Universal, C.A.</option>
                  <option value="0173 - Banco Internacional de Desarrollo C.A., Banco Universal">0173 - Banco Internacional de Desarrollo C.A., Banco Universal</option>
                  <option value="0174 - Banplus Banco Universal, C.A.">0174 - Banplus Banco Universal, C.A.</option>
                  <option value="0175 - Banco Bicentenario del Pueblo, Banco Universal C.A.">0175 - Banco Bicentenario del Pueblo, Banco Universal C.A.</option>
                  <option value="0177 - Banco de la Fuerza Armada Nacional Bolivariana, B.U.">0177 - Banco de la Fuerza Armada Nacional Bolivariana, B.U.</option>
                  <option value="0178 - Banco Digital, Banco Microfinanciero">0178 - Banco Digital, Banco Microfinanciero</option>
                  <option value="0191 - Banco Nacional de Crédito C.A., Banco Universal">0191 - Banco Nacional de Crédito C.A., Banco Universal</option>
                  <option value="0601 - Instituto Municipal de Crédito Popular">0601 - Instituto Municipal de Crédito Popular</option>
                </select>


                {errors.accbsUser_bank && <span className="error">{errors.accbsUser_bank}</span>}
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
                {errors.accbsUser_number && <span className="error">{errors.accbsUser_number}</span>}

                <label>Banco</label>
                <select name="banco" value={accbsUser_bank} onChange={(e) => setAccbsUser_bank(e.target.value)}>
                  <option value="">Selecciona el banco</option>
                  <option value="Banco de Venezuela">Banco de Venezuela</option>
                  <option value="Banesco">Banesco</option>
                  <option value="Mercantil">Mercantil</option>
                </select>
                {errors.accbsUser_bank && <span className="error">{errors.accbsUser_bank}</span>}
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
