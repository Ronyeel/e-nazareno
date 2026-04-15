import '../components/footer.css'
import { NavLink } from 'react-router-dom';
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-left">
          <h3 className="footer-title">E-NAZARENO</h3>
          <p className="footer-desc">
            Isang Digital na Dambana ng Pananampalataya
          </p>
        </div>

        <div className="footer-links">
          <NavLink to={'/'} href="#featured">Featured</NavLink>
          <NavLink to={'/mga-kuwento'} href="#featured">All Books</NavLink>
          <NavLink to={"/tungkol-sa"} href="#featured">About</NavLink>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} E-Nazareno. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}
export default Footer;