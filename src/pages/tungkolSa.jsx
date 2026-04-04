import { useEffect, useRef } from 'react';
import './tungkolSa.css';

function TungkolSa() {
  const titleRef = useRef(null);
  const subRef   = useRef(null);
  const bodyRef  = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    const targets = [
      titleRef.current,
      subRef.current,
      bodyRef.current,
      aboutRef.current,
    ].filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
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

        <h2 ref={titleRef} id="intro-title" className="tungkolSa-intro-title">
          E-NAZARENO
        </h2>

        <p ref={subRef} className="tungkolSa-intro-sub">
          "Isang Digital na <mark>Dambana</mark> ng Pananampalataya"
        </p>

        {/* ── Body — img gives height, text floats on top ── */}
        <div ref={bodyRef} className="tungkolSa-body-wrap">
          <p className="tungkolSa-intro-body">
            Ang E-Nazareno ay isang makabagong digital na espasyo na nagsisilbing dambana
            ng mga kuwento, kasaysayan, at buhay na pananampalataya ng mga deboto ng Poong
            Itim na Nazareno sa Bayan ng Labo, Camarines Norte.
          </p>
          <img
            src="/simbahan_front.png"
            alt="Harapan ng Simbahan ng Bayan ng Labo"
            className="tungkolSa-body-img"
          />

          <img
            src="/cross.png"
            className="tungkolSa-cross"
          />
        </div>

        {/* ── About ── */}
        <div className="tungkolSa-about-section">

          <div ref={aboutRef} className="tungkolSa-about-wrap">

            <div className="tungkolSa-about-bg-clip">
              <img
                src="/about_background.png"
                alt=""
                className="tungkolSa-about-bg"
              />
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
            <img
              src="/logo-final.png"
              alt="E-Nazareno Logo"
            />
          </div>

        </div>

      </section>

    </div>
  );
}

export default TungkolSa;