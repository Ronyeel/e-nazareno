import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import books from '../data/books.json';
import { useBookModal } from '../components/book-modal-context';
import './mgaKuwento.css';

function MgaKuwento() {
  const { openModal } = useBookModal();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [held, setHeld] = useState(false);
  const [swipeDx, setSwipeDx] = useState(0);       // live drag offset
  const [isSwiping, setIsSwiping] = useState(false);

  const autoPlayRef    = useRef(null);
  const resumeTimerRef = useRef(null);
  const holdTimerRef   = useRef(null);
  const swipeStartX    = useRef(null);
  const swipeStartY    = useRef(null);
  const swipeLocked    = useRef(null); // 'h' | 'v' | null

  const goTo = useCallback((nextIndex) => {
    setTransitioning(true);
    setTimeout(() => {
      setActive(nextIndex);
      setTransitioning(false);
    }, 350);
  }, []);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActive(i => {
        const next = (i + 1) % books.length;
        goTo(next);
        return i;
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
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, [startAutoPlay]);

  const prev = () => { pauseAndResume(); goTo((active - 1 + books.length) % books.length); };
  const next = () => { pauseAndResume(); goTo((active + 1) % books.length); };

  const handleDot = (i) => { pauseAndResume(); goTo(i); };

  // ── Dot hold ──
  const handleDotPointerDown = () => {
    holdTimerRef.current = setTimeout(() => {
      setHeld(true);
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    }, 180);
  };

  const handleDotPointerUp = (i) => {
    clearTimeout(holdTimerRef.current);
    if (held) {
      setHeld(false);
      resumeTimerRef.current = setTimeout(startAutoPlay, 1500);
    } else {
      handleDot(i);
    }
  };

  const handleDotPointerLeave = () => {
    clearTimeout(holdTimerRef.current);
    if (held) {
      setHeld(false);
      resumeTimerRef.current = setTimeout(startAutoPlay, 1500);
    }
  };

  // ── Card swipe ──
  const SWIPE_THRESHOLD = 50; // px to commit
  const DRAG_MAX = 80;        // max rubber-band drag px

  const onCardPointerDown = (e) => {
    swipeStartX.current = e.clientX;
    swipeStartY.current = e.clientY;
    swipeLocked.current = null;
    setIsSwiping(true);
    setSwipeDx(0);
    pauseAndResume();
  };

  const onCardPointerMove = (e) => {
    if (!isSwiping || swipeStartX.current === null) return;
    const dx = e.clientX - swipeStartX.current;
    const dy = e.clientY - swipeStartY.current;

    // lock axis on first significant movement
    if (swipeLocked.current === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      swipeLocked.current = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
    }

    if (swipeLocked.current !== 'h') return;

    e.preventDefault(); // stop scroll only when horizontal
    // rubber-band: resist past edges
    const clamped = Math.sign(dx) * Math.min(Math.abs(dx), DRAG_MAX);
    setSwipeDx(clamped);
  };

  const onCardPointerUp = (e) => {
    if (!isSwiping) return;
    setIsSwiping(false);

    if (swipeLocked.current === 'h') {
      const dx = e.clientX - swipeStartX.current;
      if (dx < -SWIPE_THRESHOLD) next();
      else if (dx > SWIPE_THRESHOLD) prev();
    }

    setSwipeDx(0);
    swipeStartX.current = null;
    swipeLocked.current = null;
  };

  const book = books[active];
  const tc   = transitioning ? 'is-transitioning' : '';

  // card translate: live drag offset, snaps back on release
  const cardStyle = {
    transform: `translateX(${swipeDx}px)`,
    transition: isSwiping && swipeLocked.current === 'h'
      ? 'none'
      : 'transform 0.35s ease',
    cursor: isSwiping && swipeLocked.current === 'h' ? 'grabbing' : 'grab',
  };

  return (
    <div className="kuwento-page">
      <section className="kuwento-hero">
        <div
          className="kuwento-card"
          style={cardStyle}
          onPointerDown={onCardPointerDown}
          onPointerMove={onCardPointerMove}
          onPointerUp={onCardPointerUp}
          onPointerLeave={onCardPointerUp}
          onPointerCancel={onCardPointerUp}
        >
          <button className="kuwento-btn left"  onClick={prev} aria-label="Previous">‹</button>
          <button className="kuwento-btn right" onClick={next} aria-label="Next">›</button>

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

          <div className={`kuwento-dots ${held ? 'is-held' : ''}`}>
            {books.map((_, i) => (
              <button
                key={i}
                className={`kuwento-dot ${i === active ? 'active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
                onPointerDown={() => handleDotPointerDown(i)}
                onPointerUp={() => handleDotPointerUp(i)}
                onPointerLeave={() => handleDotPointerLeave()}
              />
            ))}
          </div>

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