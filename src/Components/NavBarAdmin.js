import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaLink, FaUniversity, FaUsers, FaChartLine, FaTachometerAlt, FaBars, FaTimes } from "react-icons/fa";
import adminAvatar from "../Assets/Images/adminavatar.png"; // Avatar de administrador
import logo from "../Assets/Images/logo.jpeg"; // Logo original

function NavBarAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar-admin">
      <div className="navbar-admin-logo">
        <img src={logo} alt="Admin Logo" />
      </div>

      {/* Main Navigation */}
      <ul className={`navbar-admin-menu ${isMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/relacion">
            <FaLink className="navbar-admin-icon" />
            <span>Relación</span>
          </Link>
        </li>
        <li>
          <Link to="/bancos">
            <FaUniversity className="navbar-admin-icon" />
            <span>Bancos</span>
          </Link>
        </li>
        <li>
          <Link to="/usuarios">
            <FaUsers className="navbar-admin-icon" />
            <span>Usuarios</span>
          </Link>
        </li>
        <li>
          <Link to="/tasa">
            <FaChartLine className="navbar-admin-icon" />
            <span>Tasa</span>
          </Link>
        </li>
        <li>
          <Link to="/panel">
            <FaTachometerAlt className="navbar-admin-icon panel-highlight" />
            <span>Panel</span>
          </Link>
        </li>
      </ul>

      {/* Burger Icon */}
      <div className="navbar-admin-burger" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Admin User */}
      <div className="navbar-admin-user">
        <img src={adminAvatar} alt="Admin" className="navbar-admin-avatar" />
      </div>
    </nav>
  );
}

export default NavBarAdmin;
