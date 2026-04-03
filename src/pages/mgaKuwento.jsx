import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import books from '../data/books.json';
import { useBookModal } from '../components/book-modal-context';
import './mgaKuwento.css';

function MgaKuwento() {
  const { openModal } = useBookModal();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false); // ✅ fade state
  const autoPlayRef = useRef(null);
  const resumeTimerRef = useRef(null);

  // ✅ smooth transition wrapper — fades out, swaps, fades in
  const goTo = useCallback((nextIndex) => {
    setTransitioning(true);
    setTimeout(() => {
      setActive(nextIndex);
      setTransitioning(false);
    }, 350); // matches CSS transition duration
  }, []);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActive(i => {
        const next = (i + 1) % books.length;
        goTo(next);
        return i; // actual update happens inside goTo
      });
    }, 3000);
  }, [goTo]);

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

  const prev = () => {
    pauseAndResume();
    goTo((active - 1 + books.length) % books.length);
  };

  const next = () => {
    pauseAndResume();
    goTo((active + 1) % books.length);
  };

  const handleDot = (i) => {
    pauseAndResume();
    goTo(i);
  };

  const book = books[active];
  const tc = transitioning ? 'is-transitioning' : '';

  return (
    <div className="kuwento-page">

      <section className="kuwento-hero">
        <div className="kuwento-card">

          <button className="kuwento-btn left" onClick={prev} aria-label="Previous">‹</button>
          <button className="kuwento-btn right" onClick={next} aria-label="Next">›</button>

          {/* ✅ transitioning class triggers CSS fade */}
          <div className={`kuwento-card-text ${tc}`}>
            <h1 className="kuwento-card-title">{book.title}</h1>
            <p className="kuwento-card-excerpt">
              "{book.title} — isang kwento ng pananampalataya ni {book.author}."
            </p>
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
                onClick={() => handleDot(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* ✅ cover fades too */}
          <div className={`kuwento-card-cover ${tc}`}>
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