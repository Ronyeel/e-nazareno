import { useEffect, useRef, useState } from 'react';
import './kasaysayan.css';

const paragraphs = [
  {
    id: 'p1',
    align: 'left',
    text: `Ang pag-iral ng debosyon sa Poong Itim na Nazareno sa bayan ng Labo, Camarines Norte ay malalim na nakaugat sa mga salaysay na naipapasa sa pamamagitan ng tradisyong oral mula sa iba't ibang henerasyon ng mga deboto at mamamayan. Bagaman nagkakaroon ng bahagyang pagkakaiba sa mga detalye ng bawat bersyon, ang mga kuwentong ito ay nagsisilbing pundasyon ng espirituwal na identidad at kolektibong kamalayan ng komunidad. Ang debosyong ito ay hindi lamang isang hiram na tradisyon mula sa Quiapo, kundi isang pananampalatayang sumibol mula sa lokal na karanasan ng mga taga-Camarines Norte lalo't higit sa bayan ng Labo.`,
  },
  {
    id: 'p2',
    align: 'right',
    text: `Sa lahat ng dako ng Labo, ang Barangay Dalas ang naging pinakamatingkad at sentro ng debosyong ito sa Poong Nazareno. Ang kasaysayan ng pananalig sa nasabing barangay ay salamin ng pagkakaisa ng mga mamamayan, kung saan ang imahen ay itinuturing na naging bahagi na ng bawat pamilya mula pa sa kanilang mga ninuno. Ang matibay na ugnayang ito ang nagbigay-daan upang ang debosyon ay maging isang permanenteng bahagi ng kanilang kultura at pang-araw-araw na pamumuhay.`,
  },
  {
    id: 'p3',
    align: 'left',
    text: `Sa kasaysayan ng bayan, ang imahen ng Nazareno sa Labo ay kinikilala bilang "kapatid" ng tanyag na Nazareno ng Capalonga, isang ugnayang naging mitsa upang ang mga lokal na mananampalataya ay maghangad ng sariling sentro ng pagninilay. Noong unang panahon, ang mga taga-Labo ay dumadayo pa sa malalayong bayan para mamanata, ngunit ang pagdating ng sariling imahen sa lokalidad ay nagbukas ng pagkakataon para sa mas madalas at malalim na pakikipag-ugnayan sa Poong Nazareno bilang katuwang sa kanilang mga pang-araw-araw na suliranin at pagsubok.`,
  },
  {
    id: 'p4',
    align: 'right',
    text: `Ang pag-unlad ng debosyon sa Dalas ay makikita rin sa pisikal na transpormasyon ng kanilang sentro ng pananampalataya. Mula sa isang maliit at pansamantalang kapilya na ilang ulit na inilipat ng lokasyon, ang debosyon ay nagbunga ng isang permanenteng santuwaryo nang mag-alay ng lupa ang isang deboto para sa pagtatayo ng simbahan. Ang pagkakaroon ng permanenteng tahanan para sa Poong Nazareno ay lalong nagpatatag sa pananalig ng mga tao at nagbigay ng kaayusan sa kanilang mga gawaing pang-relihiyon.`,
  },
  {
    id: 'p5',
    align: 'left',
    text: `Ang paglaganap ng debosyong ito ay mailalarawan bilang isang kilusang nagmula sa mismong taumbayan na nagsimula sa maliliit na pangkat ng komunidad sa halip na sa isang malaki at pormal na samahan ng simbahan. Ayon sa mga oral na kasaysayan, ang imahen ay unang ipinakilala sa pamamagitan ng pagdadala nito sa iba't ibang bahagi ng barangay upang mailapit sa mga mamamayan. Ang mga unang mananampalatayang ito ang nagbahagi ng kanilang mga karanasan hinggil sa mga biyayang natanggap sa pamamagitan ng panalangin, na naging susi sa mabilis na paglawak ng pananalig sa loob ng pamayanan.`,
  },
  {
    id: 'p6',
    align: 'right',
    text: `Bagama't limitado ang mga nakasulat na dokumentong historikal na nagpapatunay sa eksaktong petsa ng pagdating ng imahen, ang lakas ng debosyon sa Labo ay nananatiling hindi matatawaran. Sa kasalukuyan, ang Poong Nazareno ay patuloy na kinikilala bilang sentro ng espirituwal na buhay ng pamayanan. Mula sa iilang pamilya noong unang panahon, ang kasaysayan ng debosyon sa Labo ngayon ay isinusulat na ng libu-libong deboto, kabilang ang mga dumarayo mula sa ibang lugar, na nagpapatunay sa tagumpay ng pananampalatayang nagmula sa simpleng pagtitiwala at kolektibong pananalig.`,
  },
];

function ImagePlaceholder() {
  return (
    <div className="kasaysayan-img-placeholder">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span>IMAGE</span>
    </div>
  );
}

function KasaysayanRow({ para, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const hasRevealed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already revealed — re-apply immediately without re-observing
    if (hasRevealed.current) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          hasRevealed.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isLeft = para.align === 'left';

  return (
    <div
      ref={ref}
      className={`kasaysayan-row kasaysayan-row--${para.align}${visible ? ' is-visible' : ''}`}
      style={{ '--delay': `${index * 0.08}s` }}
    >
      {isLeft ? (
        <>
          <div className="kasaysayan-text-col"><p>{para.text}</p></div>
          <div className="kasaysayan-img-col"><ImagePlaceholder /></div>
        </>
      ) : (
        <>
          <div className="kasaysayan-img-col"><ImagePlaceholder /></div>
          <div className="kasaysayan-text-col"><p>{para.text}</p></div>
        </>
      )}
    </div>
  );
}

function Kasaysayan() {
  const titleRef   = useRef(null);
  const dividerRef = useRef(null);
  const [titleVisible,   setTitleVisible]   = useState(false);
  const [dividerVisible, setDividerVisible] = useState(false);
  const titleRevealed   = useRef(false);
  const dividerRevealed = useRef(false);

  useEffect(() => {
    const entries = [
      { ref: titleRef,   set: setTitleVisible,   revealed: titleRevealed },
      { ref: dividerRef, set: setDividerVisible,  revealed: dividerRevealed },
    ];

    const observers = entries.map(({ ref, set, revealed }) => {
      const el = ref.current;
      if (!el) return null;

      if (revealed.current) {
        set(true);
        return null;
      }

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            set(true);
            revealed.current = true;
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach(obs => obs?.disconnect());
  }, []);

  return (
    <div className="kasaysayan-page">

      <section className="kasaysayan-banner" aria-label="Banner">
        <figure className="kasaysayan-banner-img-wrap">
          <img src="/nazareno_kasaysayan.png" alt="Banner ng Kasaysayan" />
          <div className="kasaysayan-banner-overlay">
            <div className="kasaysayan-banner-text">
              <h1 className="kasaysayan-banner-title">KASAYSAYAN</h1>
            </div>
          </div>
        </figure>
      </section>

      <main className="kasaysayan-content">
        <div className="kasaysayan-heading-wrap">
          <h2
            ref={titleRef}
            className={`kasaysayan-heading${titleVisible ? ' is-visible' : ''}`}
          >
            Ang Historikal na Bakas ng Poong<br />Nazareno sa Labo
          </h2>
          <div
            ref={dividerRef}
            className={`kasaysayan-divider${dividerVisible ? ' is-visible' : ''}`}
          />
        </div>

        <div className="kasaysayan-body">
          {paragraphs.map((para, i) => (
            <KasaysayanRow key={para.id} para={para} index={i} />
          ))}
        </div>
      </main>

    </div>
  );
}

export default Kasaysayan;