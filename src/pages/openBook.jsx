import './openBook.css';

const sampleParagraphs = [
  "Something magical was happening in the fish bowl and he wasn't quite ready for what lay in store. Read this captivating free illustrated book for kids that encourages them to explore and be awed by the many wonders of nature.",
  "Something magical was happening in the fish bowl and he wasn't quite ready for what lay in store. Read this captivating free illustrated book for kids that encourages them to explore and be awed by the many wonders of nature. Something magical was happening in the fish bowl and he wasn't quite ready for what lay in store.",
  "Something magical was happening in the fish bowl and he wasn't quite ready for what lay in store. Read this captivating free illustrated book for kids that encourages them to explore and be awed by the many wonders of nature. Something magical was happening in the fish bowl and he wasn't quite ready for what lay in store. Read this captivating free illustrated book for kids that encourages them to explore and be awed by the many wonders of nature.",
  "Something magical was happening in the fish bowl and he wasn't quite ready for what lay in store. Read this captivating free illustrated book for kids that encourages them to explore and be awed by the many wonders of nature. Something magical was happening in the fish bowl and he wasn't quite ready for what lay in store. Read this captivating free illustrated book for kids that encourages them to explore and be awed by the many wonders of nature.",
  "Something magical was happening in the fish bowl and he wasn't quite ready for what lay in store. Read this captivating free illustrated book for kids that encourages them to explore and be awed by the many wonders of nature. Something magical was happening in the fish bowl and he wasn't quite ready for what lay in store. Read this captivating free illustrated book for kids that encourages them to explore and be awed by the many wonders of nature.",
  "Something magical was happening in the fish bowl and he wasn't quite ready for what lay in store. Read this captivating free illustrated book for kids that encourages them to explore and be awed by the many wonders of nature. Something magical was happening in the fish bowl and he wasn't quite ready for what lay in store. Read this captivating free illustrated book for kids that encourages them to explore and be awed by the many wonders of nature.",
];

export default function OpenBook() {
  return (
    <div className="ob-root">

      {/* Hero — title lives here */}
      <div className="ob-hero">
        <div className="ob-hero-inner">
          <h1 className="ob-title">Untold Story of Jushua Solayao</h1>
          <p className="ob-subtitle">A Story of Wonder &amp; Discovery</p>
        </div>
      </div>

      <main className="ob-main">
        <article className="ob-story">

          {/* First block: image floats right, text wraps left */}
          <div className="ob-block">
            <img
              src="https://placehold.co/180x200/5c3220/fff?text=Image+1"
              alt="Illustration 1"
              className="ob-inline-img ob-inline-img--right"
            />
            <p className="ob-paragraph">{sampleParagraphs[0]}</p>
            <p className="ob-paragraph">{sampleParagraphs[1]}</p>
          </div>

          {/* Full-width paragraphs */}
          <p className="ob-paragraph">{sampleParagraphs[2]}</p>
          <p className="ob-paragraph">{sampleParagraphs[3]}</p>
          <p className="ob-paragraph">{sampleParagraphs[4]}</p>

          {/* Second block: image floats left, text wraps right */}
          <div className="ob-block">
            <img
              src="https://placehold.co/180x200/3a1e0c/fff?text=Image+2"
              alt="Illustration 2"
              className="ob-inline-img ob-inline-img--left"
            />
            <p className="ob-paragraph">{sampleParagraphs[5]}</p>
            <p className="ob-paragraph">{sampleParagraphs[0]}</p>
          </div>

        </article>

        <div className="ob-end-mark" aria-hidden="true">
          <span>— Katapusan —</span>
        </div>
      </main>

    </div>
  );
}