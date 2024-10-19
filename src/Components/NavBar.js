import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaFacebook, FaInstagram, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../Assets/Images/logo.png'; // Asegúrate de que la ruta sea correcta

function NavBar() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);
  const closeMenu = () => setShowMenu(false);

  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <img src={logo} alt="Logo" />
        </Link>
        <button className="navbar__toggle" onClick={toggleMenu}>
          {showMenu ? <FaTimes /> : <FaBars />}
        </button>
        <nav className={`navbar__menu ${showMenu ? 'show' : ''}`}>
          <ul className="navbar__list">
            <li className="navbar__item">
              <Link to="/" className="navbar__link" onClick={closeMenu}>Inicio</Link>
            </li>
            <li className="navbar__item">
              <Link to="/about" className="navbar__link" onClick={closeMenu}><strong>Envio Desde Europa</strong></Link>
            </li>
            <li className="navbar__item">
              <Link to="/skills" className="navbar__link" onClick={closeMenu}>Blog</Link>
            </li>
            <li className="navbar__item">
              <Link to="/login" className="navbar__link" onClick={closeMenu}>Log In</Link>
            </li>
            <li className="navbar__item">
              <Link to="/register" className="navbar__link navbar__link--highlight" onClick={closeMenu}>Registrate</Link>
            </li>
          </ul>
          <div className="navbar__social">
            <a href="https://wa.me/+34602679774" className="navbar__social-icon" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp />
            </a>
            <a href="https://instagram.com/moneymoveroficial" className="navbar__social-icon" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://facebook.com/moneymoveroficial" className="navbar__social-icon" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export { NavBar };
