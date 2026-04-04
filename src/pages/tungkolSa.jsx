import { useEffect, useRef } from 'react';
import './tungkolSa.css';

function TungkolSa() {
  const titleRef = useRef(null);
  const subRef   = useRef(null);
  const bodyRef  = useRef(null);
  const simbRef  = useRef(null);

  useEffect(() => {
    const targets = [
      titleRef.current,
      subRef.current,
      bodyRef.current,
      simbRef.current,
    ].filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            // Remove so animation re-plays every scroll-past
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="tungkolSa-page">

      <section className="tungkolSa-banner">
        <div className="tungkolSa-banner-img-wrap">
          <img src="/banner2.jpg" alt="Banner" />
          <div className="tungkolSa-banner-overlay">
            <h1>Tungkol sa amin</h1>
          </div>
        </div>
      </section>

      <section className="tungkolSa-intro">
        <h2 ref={titleRef} className="tungkolSa-intro-title">
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

        <div ref={simbRef} className="tungkolSa-simbahan-wrap">
          <img
            src="/simbahan_front.png"
            alt="Simbahan ng Bayan ng Labo"
            className="tungkolSa-simbahan-img"
          />
        </div>
      </section>

    </div>
  );
}

export default TungkolSa;