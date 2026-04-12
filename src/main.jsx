import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { BookModalProvider } from './components/book-modal-context';
import App from './App';
import './index.css';


const basename = import.meta.env.DEV ? "/" : "/e-nazareno";

createRoot(document.getElementById('root')).render(


  <StrictMode>
    <BrowserRouter>
      <BookModalProvider>
        <App />
      </BookModalProvider>
    </BrowserRouter>
  </StrictMode>
);