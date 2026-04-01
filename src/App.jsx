import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navBar';
import HomePage from './pages/homePage';
import MgaKwento from './pages/mgaKwento';   // ← uncommented & renamed
import Footer from './components/footer';
import './App.css';

function App() {
  return (
    <>
      <header>
        <NavBar />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mga-kwento" element={<MgaKwento />} />  {/* ← uncommented */}
          {/* <Route path="/kasaysayan" element={<History />} /> */}
          {/* <Route path="/tungkol-sa" element={<AboutUs />} /> */}
        </Routes>
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default App;