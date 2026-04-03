import './tungkolSa.css';

function TungkolSa() {
  return (
    <div className="tungkolSa-page">

      <section className="tungkolSa-banner">
        <div className="tungkolSa-banner-img-wrap">
          <img src="/banner2.jpg" alt="Banner" />
          <div className="tungkolSa-banner-overlay">   {/* ✅ h1 layered over image */}
            <h1>Tungkol sa amin</h1>
          </div>
        </div>
      </section>

      <section className="tungkolSa-intro">
        <h2 className="tungkolSa-intro-title">E-NAZARENO</h2>
        <p className="tungkolSa-intro-sub">
          "Isang Digital na <mark>Dambana</mark> ng Pananampalataya"
        </p>
        <p className="tungkolSa-intro-body">
          Ang E-Nazareno ay isang makabagong digital na espasyo na nagsisilbing dambana 
          ng mga kuwento, kasaysayan, at buhay na pananampalataya ng mga deboto ng Poong 
          Itim na Nazareno sa Bayan ng Labo, Camarines Norte.
        </p>
      </section>

    </div>
  );
}

export default TungkolSa;