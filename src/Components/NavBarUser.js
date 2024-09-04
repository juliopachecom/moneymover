import React, { useState } from 'react';
import { FaClipboardList, FaUserFriends, FaUserCircle, FaMoneyCheckAlt, FaBars } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';


function NavBarUser() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbaruser">
      <FaBars className="navbaruser__hamburger" onClick={toggleMenu} />
      <ul className={`navbaruser__list ${isMenuOpen ? 'active' : 'inactive'}`}>
        <Link to="/movimientos" className="navbaruser__item">
        <li className="navbaruser__item">
          <FaClipboardList className="navbaruser__icon" />
          <span>Movimientos</span>
        </li>
        </Link>
        <Link to="/directory" className="navbaruser__item">
        <li className="navbaruser__item">
          <FaUserFriends className="navbaruser__icon" />
          <span>Directorio</span>

        </li>
        </Link> 
        <Link to="/Profile">
        <li className="navbaruser__item">
          <FaUserCircle className="navbaruser__icon" />
          <span>Perfil</span>
        </li>
        </Link>
        <Link to="/changes">
        <li className="navbaruser__item navbaruser__item--highlighted">
          <FaMoneyCheckAlt className="navbaruser__icon" />
          <span>Enviar Remesa</span>
        </li>
        </Link>
      </ul>
    </nav>
  );
}

export { NavBarUser};
