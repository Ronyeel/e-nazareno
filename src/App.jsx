import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navBar';
import HomePage from './pages/homePage';
import MgaKuwento from './pages/mgaKuwento';
import Footer from './components/footer';
import BookModal from './components/book-modal'; // ← add this
import './App.css';
import TungkolSa from './pages/tungkolSa';

function App() {
  return (
    <>
      <header>
        <NavBar />
      </header>

      <main>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/mga-kuwento" element={<MgaKuwento />} />
          <Route path="/tungkol-sa" element={<TungkolSa />} />
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