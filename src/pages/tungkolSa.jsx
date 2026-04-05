import { useEffect, useRef } from 'react';
import './tungkolSa.css';

const LAYUNIN_CARDS = [
  { src: '/layunin1.jpg', alt: 'Bawat pagluhod',     label: 'Bawat pagluhod',     hasImage: true  },
  { src: '',              alt: '',                    label: 'Bawat hiling',        hasImage: false },
  { src: '',              alt: '',                    label: 'Bawat pasasalamat',   hasImage: false },
];

// Shared observer options
const OBSERVER_OPTS = { threshold: 0.1, rootMargin: '0px 0px -20px 0px' };

export default function TungkolSa() {
  const refs = {
    title:   useRef(null),
    sub:     useRef(null),
    body:    useRef(null),
    about:   useRef(null),
    layunin: useRef(null),
  };

  useEffect(() => {
    const targets = Object.values(refs).map(r => r.current).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          observer.unobserve(e.target); // stop watching once visible
        }
      });
    }, OBSERVER_OPTS);

    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="tungkolSa-page">

      {/* ── Banner ── */}
      <section className="tungkolSa-banner" aria-label="Banner">
        <figure className="tungkolSa-banner-img-wrap">
          <img src="/banner2.jpg" alt="Banner ng E-Nazareno" />
          <figcaption className="tungkolSa-banner-overlay">
            <h1>Tungkol sa amin</h1>
          </figcaption>
        </figure>
      </section>

      {/* ── Intro ── */}
      <section className="tungkolSa-intro" aria-labelledby="intro-title">

        <h2 ref={refs.title} id="intro-title" className="tungkolSa-intro-title">
          E-NAZARENO
        </h2>

        <p ref={refs.sub} className="tungkolSa-intro-sub">
          "Isang Digital na <mark>Dambana</mark> ng Pananampalataya"
        </p>

        {/* ── Body ── */}
        <div ref={refs.body} className="tungkolSa-body-wrap">
          <p className="tungkolSa-intro-body">
            Ang E-Nazareno ay isang makabagong digital na espasyo na nagsisilbing dambana
            ng mga kuwento, kasaysayan, at buhay na pananampalataya ng mga deboto ng Poong
            Itim na Nazareno sa Bayan ng Labo, Camarines Norte.
          </p>
          <img
            src="/simbahan_front.png"
            alt="Harapan ng Simbahan ng Bayan ng Labo"
            className="tungkolSa-body-img"
            loading="lazy"
          />
          <img
            src="/cross.png"
            alt=""
            aria-hidden="true"
            className="tungkolSa-cross"
          />
        </div>

        {/* ── About ── */}
        <div className="tungkolSa-about-section">
          <div ref={refs.about} className="tungkolSa-about-wrap">
            <div className="tungkolSa-about-bg-clip">
              <img src="/about_background.png" alt="" className="tungkolSa-about-bg" loading="lazy" />
            </div>
            <p className="tungkolSa-about-overlay-text">
              <span>
                Higit sa pagiging isang arkibo, ang platapormang ito ay isang pagsisikap na
                dalumatin ang yaman ng lokal na debosyon na madalas ay nananatiling nakatago
                sa likod ng mga tanyag na dambana sa bansa.
              </span>
            </p>
          </div>
          <div className="tungkolSa-about-logo">
            <img src="/logo-final.png" alt="E-Nazareno Logo" loading="lazy" />
          </div>
        </div>

        {/* ── Layunin ── */}
        <section
          ref={refs.layunin}
          className="tungkolSa-layunin-section"
          aria-labelledby="layunin-title"
        >
          <h3 id="layunin-title" className="tungkolSa-layunin-heading">
            Layunin nitong ipakita na ang
          </h3>

          <div className="tungkolSa-layunin-grid">
            {LAYUNIN_CARDS.map(({ src, alt, label, hasImage }) => (
              <div
                key={label}
                className={`tungkolSa-layunin-card${hasImage ? ' tungkolSa-layunin-card--has-image' : ''}`}
              >
                {hasImage && (
                  <img
                    src={src}
                    alt={alt}
                    className="tungkolSa-layunin-card-img"
                    loading="lazy"
                  />
                )}
                <span className="tungkolSa-layunin-card-label">{label}</span>
              </div>
            ))}
          </div>
        </section>

      </section>
    </div>
  );
}