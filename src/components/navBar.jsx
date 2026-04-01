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

  return (
    <div className="nav-wrapper">

      {/* 1. Search — hidden on homepage desktop, always shown on mobile */}
      <div className={`nav-search${searchOpen ? ' expanded' : ''}${isHome ? ' desktop-hidden' : ''}`}>
        <SearchBar
          expandable={true}
          expanded={searchOpen}
          onToggle={handleSearchToggle}
        />
      </div>

      {/* 2. Nav links — center */}
      <ul className={`nav-links${isOpen ? ' open' : ''}${searchOpen ? ' hidden' : ''}`}>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/mga-kwento">Mga Kwento</NavLink></li>  {/* ← just a NavLink */}
        <li><NavLink to="/kasaysayan">Kasaysayan</NavLink></li>
        <li><NavLink to="/tungkol-sa">Tungkol Sa</NavLink></li>
      </ul>

      {/* 3. Hamburger — rightmost */}
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