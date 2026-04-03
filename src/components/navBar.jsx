import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SearchBar from './searchBar';
import './navBar.css';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  const handleSearchToggle = () => {
    setSearchOpen(prev => !prev);
    if (isOpen) setIsOpen(false);
  };

  const handleNavToggle = () => {
    setIsOpen(prev => !prev);
    if (searchOpen) setSearchOpen(false);
  };

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="nav-wrapper">

      <NavLink to="/" className="nav-logo" aria-label="Home">
        <img src="/logo-final.png" alt="Logo" className="nav-logo-img" />
        <h1>E-Nazareno</h1>
      </NavLink>

      <div
        className={[
          'nav-search',
          searchOpen ? 'expanded' : '',
          isHome ? 'desktop-hidden' : '',
        ].filter(Boolean).join(' ')}
      >
        <SearchBar
          expandable={true}
          expanded={searchOpen}
          onToggle={handleSearchToggle}
        />
      </div>

      <ul className={[
        'nav-links',
        isOpen    ? 'open'   : '',
        searchOpen ? 'hidden' : '',
      ].filter(Boolean).join(' ')}>
        <li><NavLink to="/" onClick={handleNavLinkClick}>Home</NavLink></li>
        <li><NavLink to="/mga-kuwento" onClick={handleNavLinkClick}>Mga Kuwento</NavLink></li>
        <li><NavLink to="/kasaysayan" onClick={handleNavLinkClick}>Kasaysayan</NavLink></li>
        <li><NavLink to="/tungkol-sa" onClick={handleNavLinkClick}>Tungkol Sa</NavLink></li>
      </ul>

      <button
        className={`nav-toggle${isOpen ? ' open' : ''}`}
        aria-label="Toggle navigation"
        onClick={handleNavToggle}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

    </div>
  );
}

export default NavBar;