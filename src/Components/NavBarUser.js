import React, { useState } from "react";
import {
  FaClipboardList,
  FaUserFriends,
  FaUserCircle,
  FaMoneyCheckAlt,
  FaBars,
  FaSignOutAlt
} from "react-icons/fa";
import { clearLocalStorage } from "../Hooks/useLocalStorage";
import { Link } from "react-router-dom";
import logo from "../Assets/Images/logo.jpeg"; // Asegúrate de que el logo esté correctamente ubicado en la carpeta

function NavBarUser() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const clearLocal = () => {
    clearLocalStorage();
    setTimeout(() => {
      window.location.href = "/Login";
    }, 500);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbaruser">
      <div className="navbaruser__logo-container">
        <Link to="/changes">
          <img src={logo} alt="Logo" className="navbaruser__logo" />
        </Link>
      </div>
      <FaBars className="navbaruser__hamburger" onClick={toggleMenu} />
      <ul className={`navbaruser__list ${isMenuOpen ? "active" : ""}`}>
        <Link to="/movements" className="navbaruser__link">
          <li className="navbaruser__item">
            <FaClipboardList className="navbaruser__icon" />
            <span>Movimientos</span>
          </li>
        </Link>
        <Link to="/directory" className="navbaruser__link">
          <li className="navbaruser__item">
            <FaUserFriends className="navbaruser__icon" />
            <span>Directorio</span>
          </li>
        </Link>
        <Link to="/Profile" className="navbaruser__link">
          <li className="navbaruser__item">
            <FaUserCircle className="navbaruser__icon" />
            <span>Perfil</span>
          </li>
        </Link>
        <Link to="/changes" className="navbaruser__link">
          <li className="navbaruser__item navbaruser__item--highlighted">
            <FaMoneyCheckAlt className="navbaruser__icon" />
            <span>Enviar Remesa</span>
          </li>
        </Link>
        <a href="/Home" className="navbaruser__link">
          <li className="navbaruser__item">
            <FaSignOutAlt onClick={clearLocal} className="navbaruser__icon" />
            <span>Cerrar sesión</span>
          </li>
        </a>
      </ul>
    </nav>
  );
}

export { NavBarUser };
