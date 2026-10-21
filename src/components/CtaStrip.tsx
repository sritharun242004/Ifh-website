import Link from "next/link";

const SEP = <span className="mq-sep" aria-hidden="true" />;

/** One loop of the wording; the track holds it twice so the scroll never shows a gap. */
function Loop() {
  return (
    <div className="mq-group">
      {[0, 1].map((i) => (
        <span className="mq-item" key={i}>
          <span>Find your place.</span>
          <span className="hl-green">Skip the broker.</span>
          {SEP}
          <span className="mq-soft">Zero brokerage</span>
          {SEP}
          <span className="mq-soft">IFH verified</span>
          {SEP}
        </span>
      ))}
    </div>
  );
}

/**
 * A single slim call-to-action strip: the wording scrolls as a marquee inside the strip while
 * the two buttons stay fixed at the right corner. The scrolling copy is decorative, so the
 * heading is read out once.
 */
export function CtaStrip() {
  return (
    <section className="cta-mq" aria-labelledby="cta-h">
      <h2 className="sr-only" id="cta-h">
        Find your place. Skip the broker.
      </h2>
      <div className="container cta-mq-inner">
        <div className="mq" aria-hidden="true">
          <div className="mq-track">
            <Loop />
            <Loop />
          </div>
        </div>
        <div className="cta-mq-actions">
          <Link className="btn" href="/tenant#listings">
            Browse homes
          </Link>
          <Link className="btn btn-secondary" href="/property-owner">
            List your property
          </Link>
        </div>
      </div>
    </section>
  );
}
