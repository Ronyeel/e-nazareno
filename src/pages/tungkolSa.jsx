import { useEffect, useRef } from 'react';
import './tungkolSa.css';

function TungkolSa() {
  const titleRef = useRef(null);
  const subRef   = useRef(null);
  const bodyRef  = useRef(null);
  const simbRef  = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    const targets = [
      titleRef.current,
      subRef.current,
      bodyRef.current,
      simbRef.current,
      aboutRef.current,
    ].filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
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

        <p ref={bodyRef} className="tungkolSa-intro-body">
          Ang E-Nazareno ay isang makabagong digital na espasyo na nagsisilbing dambana
          ng mga kuwento, kasaysayan, at buhay na pananampalataya ng mga deboto ng Poong
          Itim na Nazareno sa Bayan ng Labo, Camarines Norte.
        </p>

        <figure ref={simbRef} className="tungkolSa-simbahan-wrap">
          <img
            src="/simbahan_front.png"
            alt="Harapan ng Simbahan ng Bayan ng Labo"
            className="tungkolSa-simbahan-img"
          />
        </figure>

        {/* ── About — section is the position:relative anchor ── */}
        <div className="tungkolSa-about-section">

          {/* Card: overflow:hidden clips bg image and text, NOT the logo */}
          <div ref={aboutRef} className="tungkolSa-about-wrap">

            {/* Separate clip wrapper so only the bg image is clipped */}
            <div className="tungkolSa-about-bg-clip">
              <img
                src="/about_background.png"
                alt=""
                className="tungkolSa-about-bg"
              />
            </div>

            {/* Text stays inside the card */}
            <p className="tungkolSa-about-overlay-text">
              <span>
                Higit sa pagiging isang arkibo, ang platapormang ito ay isang pagsisikap na
                dalumatin ang yaman ng lokal na debosyon na madalas ay nananatiling nakatago
                sa likod ng mga tanyag na dambana sa bansa.
              </span>
            </p>

          </div>

          {/* Logo is a sibling of the wrap — escapes overflow:hidden cleanly */}
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