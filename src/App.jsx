import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navBar';
import HomePage from './pages/homePage';
import MgaKuwento from './pages/mgaKuwento';
import Footer from './components/footer';
import BookModal from './components/book-modal'; // ← add this
import './App.css';

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
        </Routes>
      </main>

      <footer>
        <Footer />
      </footer>

      {/* ← add this — renders once, shared globally */}
      <BookModal />
    </>
  );
}

export default App;