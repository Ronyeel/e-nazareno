import { useEffect, useRef, useState } from 'react';
import './kasaysayan.css';

const paragraphs = [
  {
    id: 'p1',
    align: 'left',
    text: [`Sa lahat ng dako ng Labo, ang Barangay Dalas ang naging pinakamatingkad at sentro ng debosyong ito sa Poong Nazareno. Ang kasaysayan ng pananalig sa nasabing barangay ay salamin ng pagkakaisa ng mga mamamayan, kung saan ang imahen ay itinuturing na naging bahagi na ng bawat pamilya mula pa sa kanilang mga ninuno.`,
      `Ang matibay na ugnayang ito ang nagbigay-daan upang ang debosyon ay maging isang permanenteng bahagi ng kanilang kultura at pang-araw-araw na pamumuhay.`
    ],
    img: `/pOne.jpeg`
  },
  {
    id: 'p2',
    align: 'right',
    text: [
      `Sa kasaysayan ng bayan, ang imahen ng Nazareno sa Labo ay kinikilala bilang "kapatid" ng tanyag na Nazareno ng Capalonga, isang ugnayang naging mitsa upang ang mga lokal na mananampalataya ay maghangad ng sariling sentro ng pagninilay.`,
      `Noong unang panahon, ang mga taga-Labo ay dumadayo pa sa malalayong bayan para mamanata, ngunit ang pagdating ng sariling imahen sa lokalidad ay nagbukas ng pagkakataon para sa mas madalas at malalim na pakikipag-ugnayan sa Poong Nazareno bilang katuwang sa kanilang mga pang-araw-araw na suliranin at pagsubok.`
    ],
    img: `/pTwo.jpg`
  },
  {
    id: 'p3',
    align: 'left',
    text: [
      `Ang paglaganap ng debosyong ito ay mailalarawan bilang isang kilusang nagmula sa mismong taumbayan na nagsimula sa maliliit na pangkat ng komunidad sa halip na sa isang malaki at pormal na samahan ng simbahan.`,
      `Ayon sa mga oral na kasaysayan, ang imahen ay unang ipinakilala sa pamamagitan ng pagdadala nito sa iba't ibang bahagi ng barangay upang mailapit sa mga mamamayan.`,
      `Ang mga unang mananampalatayang ito ang nagbahagi ng kanilang mga karanasan hinggil sa mga biyayang natanggap sa pamamagitan ng panalangin, na naging susi sa mabilis na paglawak ng pananalig sa loob ng pamayanan.`
    ],
    img: `/pThree.jpg`
  },
  {
    id: 'p4',
    align: 'right',
    text: [
      `Sa lahat ng dako ng Labo, ang Barangay Dalas ang naging pinakamatingkad at sentro ng debosyong ito sa Poong Nazareno.`,
      `Ang kasaysayan ng pananalig sa nasabing barangay ay salamin ng pagkakaisa ng mga mamamayan, kung saan ang imahen ay itinuturing na naging bahagi na ng bawat pamilya mula pa sa kanilang mga ninuno.`,
      `Ang matibay na ugnayang ito ang nagbigay-daan upang ang debosyon ay maging isang permanenteng bahagi ng kanilang kultura at pang-araw-araw na pamumuhay.`
    ],
    img: `/simbahan_front-animate.png`
  },
  {
    id: 'p5',
    align: 'left',
    text: [`Ang pag-unlad ng debosyon sa Dalas ay makikita rin sa pisikal na transpormasyon ng kanilang sentro ng pananampalataya.`,
      `Mula sa isang maliit at pansamantalang kapilya na ilang ulit na inilipat ng lokasyon, ang debosyon ay nagbunga ng isang permanenteng santuwaryo nang mag-alay ng lupa ang isang deboto para sa pagtatayo ng simbahan.`,
      `Ang pagkakaroon ng permanenteng tahanan para sa Poong Nazareno ay lalong nagpatatag sa pananalig ng mga tao at nagbigay ng kaayusan sa kanilang mga gawaing pang-relihiyon.`
    ],
  },
  {
    id: 'p6',
    img: "/interior1.jpg",
  },
  {
    id: 'p7',
    img: '/interior2.jpeg'
  },
  {
    id: 'p8',
    img: '/interior3.jpg'
  },
  {
    id: 'p9',
    text: [
      `Bagama't limitado ang mga nakasulat na dokumentong historikal na nagpapatunay sa eksaktong petsa ng pagdating ng imahen, ang lakas ng debosyon sa Labo ay nananatiling hindi matatawaran. Sa kasalukuyan, ang Poong Nazareno ay patuloy na kinikilala bilang sentro ng espirituwal na buhay ng pamayanan.`,
      `Mula sa iilang pamilya noong unang panahon, ang kasaysayan ng debosyon sa Labo ngayon ay isinusulat na ng libu-libong deboto, kabilang ang mga dumarayo mula sa ibang lugar, na nagpapatunay sa tagumpay ng pananampalatayang nagmula sa simpleng pagtitiwala at kolektibong pananalig.`
    ]
  }
];


const imageCache = new Map();

function preloadImage(src) {
  if (!src || imageCache.has(src)) return;
  imageCache.set(src, 'loading');
  const img = new Image();
  img.onload = () => imageCache.set(src, 'loaded');
  img.onerror = () => imageCache.set(src, 'error');
  img.src = src;
}

paragraphs.forEach(p => {
  if (p.img) preloadImage(p.img);
});


function ImagePlaceholder({ src }) {
  const [status, setStatus] = useState(() => imageCache.get(src) ?? 'loading');

  useEffect(() => {
    if (status === 'loaded' || status === 'error') return;

    const cached = imageCache.get(src);
    if (cached && cached !== 'loading') {
      setStatus(cached);
      return;
    }

    const img = new Image();
    img.onload = () => { imageCache.set(src, 'loaded'); setStatus('loaded'); };
    img.onerror = () => { imageCache.set(src, 'error'); setStatus('error'); };
    img.src = src;
  }, [src, status]);

  return (
    <div className={`kasaysayan-img-placeholder${status === 'loaded' ? ' is-loaded' : ''}`}>
      <img
        src={src}
        alt="Kasaysayan"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function useReveal(threshold = 0.05) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const hasRevealed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
      { threshold, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ── Row: text + image (p1, p2, p3, p4) ── */
function KasaysayanRow({ para, index }) {
  const [ref, visible] = useReveal(0.05);
  const isLeft = para.align === 'left';

  return (
    <div
      ref={ref}
      className={`kasaysayan-row kasaysayan-row--${para.align}${visible ? ' is-visible' : ''}`}
      style={{ '--delay': `${index * 0.08}s` }}
    >
      {isLeft ? (
        <>
          <div className="kasaysayan-text-col">
            {para.text.map((t, i) => <p key={i}>{t}</p>)}
          </div>
          <div className="kasaysayan-img-col"><ImagePlaceholder src={para.img} /></div>
        </>
      ) : (
        <>
          <div className="kasaysayan-img-col"><ImagePlaceholder src={para.img} /></div>
          <div className="kasaysayan-text-col">
            {para.text.map((t, i) => <p key={i}>{t}</p>)}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Row: text only, full width (p5, p9) ── */
function KasaysayanTextOnly({ para, index }) {
  const [ref, visible] = useReveal(0.05);

  return (
    <div
      ref={ref}
      className={`kasaysayan-row kasaysayan-row--left kasaysayan-row--full${visible ? ' is-visible' : ''}`}
      style={{ '--delay': `${index * 0.08}s` }}
    >
      <div className="kasaysayan-text-col kasaysayan-text-col--full">
        {para.text.map((t, i) => <p key={i}>{t}</p>)}
      </div>
    </div>
  );
}

/* ── Row: three images side by side (p6, p7, p8) ── */
function KasaysayanTripleImages({ paras, startIndex }) {
  const [ref, visible] = useReveal(0.05);

  return (
    <div
      ref={ref}
      className={`kasaysayan-row kasaysayan-row--triple${visible ? ' is-visible' : ''}`}
      style={{ '--delay': `${startIndex * 0.08}s` }}
    >
      {paras.map((para, i) => (
        <div key={para.id} className="kasaysayan-img-col kasaysayan-img-col--third">
          <ImagePlaceholder src={para.img} />
        </div>
      ))}
    </div>
  );
}


function Kasaysayan() {
  const titleRef = useRef(null);
  const dividerRef = useRef(null);
  const [titleVisible, setTitleVisible] = useState(false);
  const [dividerVisible, setDividerVisible] = useState(false);
  const titleRevealed = useRef(false);
  const dividerRevealed = useRef(false);

  useEffect(() => {
    const entries = [
      { ref: titleRef, set: setTitleVisible, revealed: titleRevealed },
      { ref: dividerRef, set: setDividerVisible, revealed: dividerRevealed },
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

  // p6, p7, p8 grouped together
  const tripleImages = paragraphs.filter(p => ['p6', 'p7', 'p8'].includes(p.id));

  return (
    <div className="kasaysayan-page">

      <section className="kasaysayan-banner" aria-label="Banner">
        <figure className="kasaysayan-banner-img-wrap">
          <img src="/banner_tungkolsa.png" alt="Banner ng Kasaysayan" />
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
          {/* p1 — text left, image right */}
          <KasaysayanRow para={paragraphs[0]} index={0} />

          {/* p2 — image left, text right */}
          <KasaysayanRow para={paragraphs[1]} index={1} />

          {/* p3 — text left, image right */}
          <KasaysayanRow para={paragraphs[2]} index={2} />

          {/* p4 — image left, text right */}
          <KasaysayanRow para={paragraphs[3]} index={3} />

          {/* p5 — text only, full width */}
          <KasaysayanTextOnly para={paragraphs[4]} index={4} />

          {/* p6, p7, p8 — three images side by side */}
          <KasaysayanTripleImages paras={tripleImages} startIndex={5} />

          {/* p9 — text only, full width */}
          <KasaysayanTextOnly para={paragraphs[8]} index={8} />
        </div>
      </main>

    </div>
  );
}

export default Kasaysayan;