import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navBar';
import HomePage from './pages/homePage';
import MgaKuwento from './pages/mgaKuwento';
import Footer from './components/footer';
import BookModal from './components/book-modal';
import './App.css';
import TungkolSa from './pages/tungkolSa';

function App() {
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;

    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        header.offsetHeight + 'px'
      );
    };

    updateHeaderHeight(); // run on mount

    // re-run if window resizes (header height can change on mobile)
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <>
      <header>
        <NavBar />
      </header>

      <main>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/mga-kuwento" element={<MgaKuwento />} />
          <Route path="/tungkol-sa"  element={<TungkolSa />} />
        </Routes>
      </main>

      <footer>
        <Footer />
      </footer>

      <BookModal />
    </>
  );
}

export default App;