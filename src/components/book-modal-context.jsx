import { createContext, useContext, useState, useCallback } from 'react';

const BookModalContext = createContext(null);

export function BookModalProvider({ children }) {
  const [selectedBook, setSelectedBook] = useState(null);

  const openModal  = useCallback((book) => setSelectedBook(book), []);
  const closeModal = useCallback(() => setSelectedBook(null), []);

  return (
    <BookModalContext.Provider value={{ selectedBook, openModal, closeModal }}>
      {children}
    </BookModalContext.Provider>
  );
}

export function useBookModal() {
  const ctx = useContext(BookModalContext);
  if (!ctx) throw new Error('useBookModal must be used inside <BookModalProvider>');
  return ctx;
}