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
    document.body.style.overflow = book ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
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
            <div className="bm-meta-item">
              <span className="bm-meta-label">Pages</span>
              <span className="bm-meta-value">{book.pages ?? book.chapter ?? '—'}</span>
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