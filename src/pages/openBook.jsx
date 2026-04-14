import './openBook.css';
import { useState, useRef, useEffect, useCallback } from 'react';

import { useParams } from 'react-router-dom';
import bookDataToRead from '../data/openBook.json';

const API_BASE = 'https://enazareno-audio.onrender.com';

// How many paragraphs fit per "page" based on viewport height
function calcParagraphsPerPage() {
  // Approximate: each paragraph ~120px tall (1rem font, 1.9 line-height, ~4 lines avg)
  // Reserve ~220px for hero + audio player
  const available = window.innerHeight - 220;
  const paraHeight = 120;
  return Math.max(1, Math.floor(available / paraHeight));
}

export default function OpenBook() {

  const { id } = useParams();
  const openBook = bookDataToRead.find(book => book.id === parseInt(id));

  const prefaceBody = openBook.preface.body;

  // this is for all stats realatead to the audio player
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioError, setAudioError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [showPreface, setShowPreface] = useState(true);

  // Preface audio player refs and state (inside modal)
  const prefaceAudioRef = useRef(null);
  const [prefaceIsPlaying, setPrefaceIsPlaying] = useState(false);
  const [prefaceDuration, setPrefaceDuration] = useState(0);
  const [prefaceCurrentTime, setPrefaceCurrentTime] = useState(0);
  const [prefaceAudioError, setPrefaceAudioError] = useState(null);

  // Story audio player refs and state (under story title)
  const storyAudioRef = useRef(null);
  const [storyIsPlaying, setStoryIsPlaying] = useState(false);
  const [storyDuration, setStoryDuration] = useState(0);
  const [storyCurrentTime, setStoryCurrentTime] = useState(0);
  const [storyAudioError, setStoryAudioError] = useState(null);

  // ── Page navigation state ────────────────────────────────
  const [currentPage, setCurrentPage] = useState(0);
  const [parasPerPage, setParasPerPage] = useState(calcParagraphsPerPage);
  const [pageFlip, setPageFlip] = useState(null); // 'left' | 'right' | null

  // Recalculate paragraphs per page on resize
  useEffect(() => {
    function onResize() {
      setParasPerPage(calcParagraphsPerPage());
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Split body into pages
  const body = openBook.body;
  const totalPages = Math.ceil(body.length / parasPerPage);
  const pageParas = body.slice(
    currentPage * parasPerPage,
    (currentPage + 1) * parasPerPage
  );

  function goNextPage() {
    if (currentPage < totalPages - 1) {
      setPageFlip('right');
      setTimeout(() => {
        setCurrentPage(p => p + 1);
        setPageFlip(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  }

  function goPrevPage() {
    if (currentPage > 0) {
      setPageFlip('left');
      setTimeout(() => {
        setCurrentPage(p => p - 1);
        setPageFlip(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  }

  // Click zone handler: left 30% = prev, right 30% = next
  function handlePageClick(e) {
    // Ignore clicks on interactive elements
    const tag = e.target.tagName.toLowerCase();
    if (['button', 'input', 'a', 'mark'].includes(tag)) return;
    const x = e.clientX;
    const w = window.innerWidth;
    if (x < w * 0.30) {
      goPrevPage();
    } else if (x > w * 0.70) {
      goNextPage();
    }
  }

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNextPage();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrevPage();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentPage, totalPages]);

  // Build the stream URLs from the current book id
  const audioSrc = `${API_BASE}/api/audio/${id}`;
  const prefaceAudioSrc = `${API_BASE}/api/audio/${id}`;
  const storyAudioSrc = `${API_BASE}/api/audio/${id}/story`;

  // Reset player whenever the book id changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(null);
    setShowPreface(true);
    setCurrentPage(0);
    setPageFlip(null);

    // Reset preface player
    setPrefaceIsPlaying(false);
    setPrefaceCurrentTime(0);
    setPrefaceDuration(0);
    setPrefaceAudioError(null);

    // Reset story player
    setStoryIsPlaying(false);
    setStoryCurrentTime(0);
    setStoryDuration(0);
    setStoryAudioError(null);

    if (audioRef.current) {
      audioRef.current.load(); // forces the browser to re-fetch for the new id
    }
    if (prefaceAudioRef.current) {
      prefaceAudioRef.current.load();
    }
    if (storyAudioRef.current) {
      storyAudioRef.current.load();
    }
  }, [id]);

  function handlePlayPause() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // .play() returns a Promise — catch errors so the UI doesn't break
      audioRef.current.play().catch(err => {
        console.error('Play failed:', err);
        setAudioError('Could not play audio. Is the backend running?');
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }



  function highlightText(text, query) {
    if (!query.trim()) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} className="ob-highlight">{part}</mark>
        : part
    );
  }



  function formatTime(secs) {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Preface audio handlers ───────────────────────────────
  function handlePrefacePlayPause() {
    if (!prefaceAudioRef.current) return;
    if (prefaceIsPlaying) {
      prefaceAudioRef.current.pause();
      setPrefaceIsPlaying(false);
    } else {
      prefaceAudioRef.current.play().catch(err => {
        console.error('Preface play failed:', err);
        setPrefaceAudioError('Could not play preface audio. Is the backend running?');
        setPrefaceIsPlaying(false);
      });
      setPrefaceIsPlaying(true);
    }
  }

  function handlePrefaceTimeUpdate() {
    if (prefaceAudioRef.current) setPrefaceCurrentTime(prefaceAudioRef.current.currentTime);
  }

  function handlePrefaceLoadedMetadata() {
    if (prefaceAudioRef.current) setPrefaceDuration(prefaceAudioRef.current.duration);
  }

  function handlePrefaceSeek(e) {
    const newTime = parseFloat(e.target.value);
    if (prefaceAudioRef.current) prefaceAudioRef.current.currentTime = newTime;
    setPrefaceCurrentTime(newTime);
  }

  function handlePrefaceAudioError() {
    const err = prefaceAudioRef.current?.error;
    const msg = err ? `Audio error (code ${err.code}): ${err.message}` : 'Unknown audio error';
    console.error(msg, '\nSrc:', prefaceAudioSrc);
    setPrefaceAudioError(`Cannot load preface audio. Check that the backend is running at ${API_BASE}`);
    setPrefaceIsPlaying(false);
  }

  // ── Story audio handlers ─────────────────────────────────
  function handleStoryPlayPause() {
    if (!storyAudioRef.current) return;
    if (storyIsPlaying) {
      storyAudioRef.current.pause();
      setStoryIsPlaying(false);
    } else {
      storyAudioRef.current.play().catch(err => {
        console.error('Story play failed:', err);
        setStoryAudioError('Could not play story audio. Is the backend running?');
        setStoryIsPlaying(false);
      });
      setStoryIsPlaying(true);
    }
  }

  function handleStoryTimeUpdate() {
    if (storyAudioRef.current) setStoryCurrentTime(storyAudioRef.current.currentTime);
  }

  function handleStoryLoadedMetadata() {
    if (storyAudioRef.current) setStoryDuration(storyAudioRef.current.duration);
  }

  function handleStorySeek(e) {
    const newTime = parseFloat(e.target.value);
    if (storyAudioRef.current) storyAudioRef.current.currentTime = newTime;
    setStoryCurrentTime(newTime);
  }

  function handleStoryAudioError() {
    const err = storyAudioRef.current?.error;
    const msg = err ? `Audio error (code ${err.code}): ${err.message}` : 'Unknown audio error';
    console.error(msg, '\nSrc:', storyAudioSrc);
    setStoryAudioError(`Cannot load story audio. Check that the backend is running at ${API_BASE}`);
    setStoryIsPlaying(false);
  }

  // Determine which images fall on the current page
  const img1Para = openBook.image1Para ?? 0;
  const img2Para = openBook.image2Para ?? Math.floor(openBook.body.length / 2);
  const img3Para = openBook.image3Para ?? openBook.body.length - 2;

  const pageStart = currentPage * parasPerPage;
  const pageEnd = pageStart + parasPerPage - 1;

  const showImg1 = img1Para >= pageStart && img1Para <= pageEnd;
  const showImg2 = img2Para >= pageStart && img2Para <= pageEnd;
  const showImg3 = img3Para >= pageStart && img3Para <= pageEnd;

  // Relative index within the page where each image should appear
  const img1Rel = img1Para - pageStart;
  const img2Rel = img2Para - pageStart;
  const img3Rel = img3Para - pageStart;

  return (
    <div className="ob-root" onClick={handlePageClick}>

      {/* Preface Modal */}
      {showPreface && (
        <div className="ob-modal-overlay">
          <div className="ob-modal">
            <div className="ob-modal-hero">
              <h1 className="ob-title">{openBook.preface.title}</h1>
              <p className="ob-subtitle">Paunang Sulat</p>

              {/* Preface audio player inside modal */}
              <div className="ob-audio-player ob-modal-audio" aria-label="Preface audio player">
                <audio
                  ref={prefaceAudioRef}
                  onTimeUpdate={handlePrefaceTimeUpdate}
                  onLoadedMetadata={handlePrefaceLoadedMetadata}
                  onEnded={() => setPrefaceIsPlaying(false)}
                  onError={handlePrefaceAudioError}
                  preload="metadata"
                >
                  <source key={`preface-${id}`} src={prefaceAudioSrc} type="audio/wav" />
                </audio>

                <button onClick={handlePrefacePlayPause}>
                  {prefaceIsPlaying ? 'pause' : 'play'}
                </button>

                <input
                  className="ob-seek-bar"
                  type="range"
                  min={0}
                  max={prefaceDuration || 0}
                  step={0.1}
                  value={prefaceCurrentTime}
                  onChange={handlePrefaceSeek}
                  style={{ flex: 1 }}
                />

                <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  {formatTime(prefaceCurrentTime)} / {formatTime(prefaceDuration)}
                </span>
              </div>

              {prefaceAudioError && (
                <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
                  ⚠️ {prefaceAudioError}
                </p>
              )}
            </div>

            <div className="ob-modal-body">
              {Array.isArray(prefaceBody)
                ? prefaceBody.map((para, i) => (
                  <p key={i} className="ob-paragraph">{para}</p>
                ))
                : <p className="ob-paragraph">{prefaceBody}</p>
              }
            </div>
            <div className="ob-modal-footer">
              <button className="ob-proceed-btn" onClick={() => setShowPreface(false)}>
                Magpatuloy
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Main content — story lives here */}
      <div className="ob-hero">
        <div className="ob-hero-inner">
          <div className="ob-search-container">
            <input
              className='ob-search-input'
              placeholder='Search...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <h1 className="ob-title">{openBook.title}</h1>

          {/* Story audio player under story title */}
          <div className="ob-audio-player" aria-label="Story audio player">
            <audio
              ref={storyAudioRef}
              onTimeUpdate={handleStoryTimeUpdate}
              onLoadedMetadata={handleStoryLoadedMetadata}
              onEnded={() => setStoryIsPlaying(false)}
              onError={handleStoryAudioError}
              preload="metadata"
            >
              <source key={`story-${id}`} src={storyAudioSrc} type="audio/wav" />
            </audio>

            <button onClick={handleStoryPlayPause}>
              {storyIsPlaying ? 'pause' : 'play'}
            </button>
            <div className='ob-seek-container'>
              <input
                className="ob-seek-bar"
                type="range"
                min={0}
                max={storyDuration || 0}
                step={0.1}
                value={storyCurrentTime}
                onChange={handleStorySeek}
              />
            </div>
            <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              {formatTime(storyCurrentTime)} / {formatTime(storyDuration)}
            </span>
          </div>

          {storyAudioError && (
            <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
              ⚠️ {storyAudioError}
            </p>
          )}
        </div>
      </div>

      {/* ── Page navigation click zones ── */}
      {!showPreface && (
        <>
          {/* Left zone — previous page */}
          <div
            className={`ob-page-zone ob-page-zone--left${currentPage === 0 ? ' ob-page-zone--disabled' : ''}`}
            aria-label="Previous page"
          >
            {currentPage > 0 && (
              <div className="ob-page-arrow ob-page-arrow--left">&#8249;</div>
            )}
          </div>

          {/* Right zone — next page */}
          <div
            className={`ob-page-zone ob-page-zone--right${currentPage === totalPages - 1 ? ' ob-page-zone--disabled' : ''}`}
            aria-label="Next page"
          >
            {currentPage < totalPages - 1 && (
              <div className="ob-page-arrow ob-page-arrow--right">&#8250;</div>
            )}
          </div>
        </>
      )}

      <main className="ob-main">
        {/* Page indicator */}
        {!showPreface && (
          <div className="ob-page-indicator">
            {Array.from({ length: totalPages }).map((_, i) => (
              <span
                key={i}
                className={`ob-page-dot${i === currentPage ? ' ob-page-dot--active' : ''}`}
                onClick={e => { e.stopPropagation(); setCurrentPage(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}

        <article
          className={`ob-story ob-story--page${pageFlip ? ` ob-story--flip-${pageFlip}` : ''}`}
        >
          {/* Render current page paragraphs, inserting images at their relative positions */}
          <div className="ob-block">
            {showImg1 && openBook.image1 && img1Rel === 0 && (
              <img
                src={openBook.image1}
                alt="Illustration 1"
                className="ob-inline-img ob-inline-img--right"
              />
            )}
            {showImg2 && openBook.image2 && img2Rel === 0 && (
              <img
                src={openBook.image2}
                alt="Illustration 2"
                className="ob-inline-img ob-inline-img--left"
              />
            )}
            {showImg3 && openBook.image3 && img3Rel === 0 && (
              <img
                src={openBook.image3}
                alt="Illustration 3"
                className="ob-inline-img ob-inline-img--right"
              />
            )}

            {pageParas.map((paragraph, index) => (
              <div key={pageStart + index}>
                {/* Insert images after the paragraph at their relative index */}
                {showImg1 && openBook.image1 && img1Rel === index + 1 && (
                  <img
                    src={openBook.image1}
                    alt="Illustration 1"
                    className="ob-inline-img ob-inline-img--right"
                  />
                )}
                {showImg2 && openBook.image2 && img2Rel === index + 1 && (
                  <img
                    src={openBook.image2}
                    alt="Illustration 2"
                    className="ob-inline-img ob-inline-img--left"
                  />
                )}
                {showImg3 && openBook.image3 && img3Rel === index + 1 && (
                  <img
                    src={openBook.image3}
                    alt="Illustration 3"
                    className="ob-inline-img ob-inline-img--right"
                  />
                )}
                <p className="ob-paragraph">{highlightText(paragraph, searchQuery)}</p>
              </div>
            ))}
          </div>

          {/* End mark only on last page */}
          {currentPage === totalPages - 1 && (
            <div className="ob-end-mark" aria-hidden="true">
              <span>— Katapusan —</span>
            </div>
          )}
        </article>

        {/* Bottom page navigation buttons */}
        {!showPreface && (
          <div className="ob-page-nav">
            <button
              className="ob-page-btn"
              onClick={e => { e.stopPropagation(); goPrevPage(); }}
              disabled={currentPage === 0}
              aria-label="Previous page"
            >
              &#8249; Nakaraang Pahina
            </button>
            <span className="ob-page-count">{currentPage + 1} / {totalPages}</span>
            <button
              className="ob-page-btn"
              onClick={e => { e.stopPropagation(); goNextPage(); }}
              disabled={currentPage === totalPages - 1}
              aria-label="Next page"
            >
              Susunod na Pahina &#8250;
            </button>
          </div>
        )}
      </main>

    </div>
  );
}