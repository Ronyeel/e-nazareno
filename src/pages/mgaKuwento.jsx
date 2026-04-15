import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import books from '../data/books.json';
import { useBookModal } from '../components/book-modal-context';
import './mgaKuwento.css';

const AUTOPLAY_INTERVAL = 3000;
const RESUME_DELAY = 8000;
const HOLD_THRESHOLD = 180;
const SCRUB_RESUME_DELAY = 1500;
const SWIPE_MIN_DELTA = 40;

function MgaKuwento() {
  const { openModal } = useBookModal();
  const navigate = useNavigate();

  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [held, setHeld] = useState(false);


  const activeRef = useRef(0);
  const fadingRef = useRef(false);
  const heldRef = useRef(false);
  const autoPlayRef = useRef(null);
  const resumeRef = useRef(null);
  const holdRef = useRef(null);
  const swipeX = useRef(null);
  const dotsRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { fadingRef.current = fading; }, [fading]);
  useEffect(() => { heldRef.current = held; }, [held]);


  const goTo = useCallback((next) => {
    if (fadingRef.current) return;

    fadingRef.current = true;
    setFading(true);

    setTimeout(() => {
      activeRef.current = next;
      setActive(next);


      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          fadingRef.current = false;
          setFading(false);
        })
      );
    }, 300);
  }, []);


  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };
  const stopResume = () => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
  };

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      goTo((activeRef.current + 1) % books.length);
    }, AUTOPLAY_INTERVAL);
  }, [goTo]);

  const pauseAndResume = useCallback(() => {
    stopAutoPlay();
    stopResume();
    resumeRef.current = setTimeout(startAutoPlay, RESUME_DELAY);
  }, [startAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      stopAutoPlay();
      stopResume();
      if (holdRef.current) clearTimeout(holdRef.current);
    };
  }, [startAutoPlay]);


  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const block = (e) => e.preventDefault();
    hero.addEventListener('touchmove', block, { passive: false });
    hero.addEventListener('touchstart', block, { passive: false });
    return () => {
      hero.removeEventListener('touchmove', block);
      hero.removeEventListener('touchstart', block);
    };
  }, []);


  const prev = useCallback(() => {
    pauseAndResume();
    goTo((activeRef.current - 1 + books.length) % books.length);
  }, [pauseAndResume, goTo]);

  const next = useCallback(() => {
    pauseAndResume();
    goTo((activeRef.current + 1) % books.length);
  }, [pauseAndResume, goTo]);


  const onCardDown = (e) => {
    if (e.target.closest('button, .kuwento-dots')) return;
    swipeX.current = e.clientX;
  };
  const onCardUp = (e) => {
    if (swipeX.current === null) return;
    const delta = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(delta) < SWIPE_MIN_DELTA) return;
    delta < 0 ? next() : prev();
  };


  const getDotAt = (clientX) => {
    if (!dotsRef.current) return null;
    const els = [...dotsRef.current.querySelectorAll('.kuwento-dot')];
    for (let i = 0; i < els.length; i++) {
      const { left, right } = els[i].getBoundingClientRect();
      if (clientX >= left && clientX <= right) return i;
    }
    return null;
  };

  const onDotDown = (e, i) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    holdRef.current = setTimeout(() => {
      heldRef.current = true;
      setHeld(true);
      stopAutoPlay();
      stopResume();
    }, HOLD_THRESHOLD);
  };

  const onDotMove = (e) => {
    e.preventDefault();
    if (!heldRef.current) return;
    const idx = getDotAt(e.clientX);
    if (idx !== null && idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  };

  const endScrub = () => {
    clearTimeout(holdRef.current);
    if (!heldRef.current) return;
    heldRef.current = false;
    setHeld(false);
    resumeRef.current = setTimeout(startAutoPlay, SCRUB_RESUME_DELAY);
  };

  const onDotUp = (e, i) => {
    e.preventDefault();
    clearTimeout(holdRef.current);
    if (heldRef.current) {
      endScrub();
    } else {
      pauseAndResume();
      goTo(i);
    }
  };

  const onDotsLeave = (e) => {
    e.preventDefault();
    endScrub();
  };


  const book = books[active];
  const fade = fading ? ' is-fading' : '';

  return (
    <div className="kuwento-page">

      <section className="kuwento-hero" ref={heroRef}>
        <div
          className="kuwento-card"
          onPointerDown={onCardDown}
          onPointerUp={onCardUp}
        >
          <button className="kuwento-btn left" onClick={prev} aria-label="Previous">‹</button>
          <button className="kuwento-btn right" onClick={next} aria-label="Next">›</button>

          <div className="kuwento-card-text">
            <h1 className="kuwento-card-title">Mga Kuwento</h1>
            <p className={`kuwento-card-excerpt${fade}`}>
              "{book.title} — isang kwento ng pananampalataya ni {book.author}."
            </p>
            <p className='kuwento-card-preface'>{book.preface}</p>
          </div>


          <div
            className={`kuwento-dots${held ? ' is-held' : ''}`}
            ref={dotsRef}
            onPointerMove={onDotMove}
            onPointerLeave={onDotsLeave}
          >
            {books.map((_, i) => (
              <button
                key={i}
                className={`kuwento-dot${i === active ? ' active' : ''}`}
                aria-label={`Slide ${i + 1}`}
                onPointerDown={(e) => onDotDown(e, i)}
                onPointerUp={(e) => onDotUp(e, i)}
              />
            ))}
          </div>

          <div className={`kuwento-card-cover${fade}`}>
            {book.cover
              ? <img src={book.cover} alt={book.title} />
              : <div className="kuwento-cover-placeholder">{book.title.charAt(0)}</div>
            }
            <div className="kuwento-card-meta">
              <p className="kuwento-meta-title">{book.title}</p>
              <p className="kuwento-meta-author">{book.author}</p>
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
                    {b.cover
                      ? <img src={b.cover} alt={b.title} />
                      : <div className="kuwento-grid-placeholder">{b.title.charAt(0)}</div>
                    }
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