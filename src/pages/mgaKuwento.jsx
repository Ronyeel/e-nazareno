import { useNavigate } from 'react-router-dom'; // ← add this
import { useState, useEffect, useRef, useCallback } from 'react';
import books from '../data/books.json';
import { useBookModal } from '../components/book-modal-context';
import './mgaKuwento.css';

function MgaKuwento() {
  const { openModal } = useBookModal();
  const navigate = useNavigate(); // ← add this
  const [active, setActive] = useState(0);
  const autoPlayRef = useRef(null);
  const resumeTimerRef = useRef(null);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActive(i => (i + 1) % books.length);
    }, 3000);
  }, []);

  const pauseAndResume = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(startAutoPlay, 8000);
  }, [startAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [startAutoPlay]);

  const prev = () => { pauseAndResume(); setActive(i => (i - 1 + books.length) % books.length); };
  const next = () => { pauseAndResume(); setActive(i => (i + 1) % books.length); };
  const goTo = (i) => { pauseAndResume(); setActive(i); };

  const book = books[active];

  return (
    <div className="kuwento-page">

      <section className="kuwento-hero">
        <div className="kuwento-card">

          <button className="kuwento-btn left" onClick={prev} aria-label="Previous">‹</button>
          <button className="kuwento-btn right" onClick={next} aria-label="Next">›</button>

          <div className="kuwento-card-text">
            <h1 className="kuwento-card-title">{book.title}</h1>
            <p className="kuwento-card-excerpt">
              "{book.title} — isang kwento ng pananampalataya ni {book.author}."
            </p>
            {/* ← navigates directly, skips modal */}
            <button
              className="kuwento-read-btn"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              Simulan ang pagbasa
            </button>
          </div>

          <div className="kuwento-dots">
            {books.map((_, i) => (
              <button
                key={i}
                className={`kuwento-dot ${i === active ? 'active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="kuwento-card-cover">
            {book.cover ? (
              <img src={book.cover} alt={book.title} />
            ) : (
              <div className="kuwento-cover-placeholder">
                <span>{book.title.charAt(0)}</span>
              </div>
            )}
            <div className="kuwento-card-meta">
              <p className="kuwento-meta-title">{book.title}</p>
              <p className="kuwento-meta-author">{book.author}</p>
              <p className="kuwento-meta-excerpt">
                "{book.title} — isang kwento ng pananampalataya ni {book.author}."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* grid still opens modal for preview before committing to read */}
      <section className="kuwento-grid-section">
        <div className="kuwento-grid-inner">
          <h2 className="kuwento-grid-heading">Lahat ng Kuwento</h2>
          <div className="kuwento-grid-wrapper">
            <div className="kuwento-grid">
              {books.map((b) => (
                <div
                  key={b.id}
                  className="kuwento-grid-item"
                  onClick={() => openModal(b)}
                >
                  <div className="kuwento-grid-cover">
                    {b.cover ? (
                      <img src={b.cover} alt={b.title} />
                    ) : (
                      <div className="kuwento-grid-placeholder">
                        <span>{b.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <p className="kuwento-grid-title">{b.title}</p>
                  <p className="kuwento-grid-author">{b.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default MgaKuwento;