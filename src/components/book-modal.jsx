import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookModal } from './book-modal-context';
import './book-modal.css';

export default function BookModal() {
  const { selectedBook: book, closeModal } = useBookModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!book) return;
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [book, closeModal]);

  useEffect(() => {
    if (book) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--bm-scrollbar-width', `${scrollbarWidth}px`);
      document.body.classList.add('bm-open');
    } else {
      document.body.classList.remove('bm-open');
      document.documentElement.style.removeProperty('--bm-scrollbar-width');
    }
    return () => {
      document.body.classList.remove('bm-open');
      document.documentElement.style.removeProperty('--bm-scrollbar-width');
    };
  }, [book]);

  if (!book) return null;

  const handleRead = () => {
    closeModal();
    navigate(`/book/${book.id}`);
  };

  return (
    <div className="bm-overlay" onClick={closeModal}>
      <div className="bm-panel" onClick={(e) => e.stopPropagation()}>

        <button className="bm-close" onClick={closeModal} aria-label="Close">✕</button>

        <div className="bm-cover-wrap">
          {book.cover ? (
            <img src={book.cover} alt={book.title} className="bm-cover-img" />
          ) : (
            <div className="bm-cover-placeholder">
              <span>{book.title.charAt(0)}</span>
            </div>
          )}
          <div className="bm-cover-glow" />
        </div>

        <div className="bm-body">
          <h2 className="bm-title">{book.title}</h2>
          {book.description && (
            <p className="bm-description">{book.description}</p>
          )}
          <div className="bm-meta">
            <div className="bm-meta-item">
              <span className="bm-meta-label">Author</span>
              <span className="bm-meta-value">{book.author}</span>
            </div>
          </div>
        </div>

        <div className="bm-actions">
          <button className="bm-read-btn" onClick={handleRead}>
            Simulan ang Pagbabasa
          </button>
        </div>

      </div>
    </div>
  );
}