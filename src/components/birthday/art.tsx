import { useId } from "react";

export function Envelope({ open = false }: { open?: boolean }) {
  return (
    <div className={`envelope-art ${open ? "is-open" : ""}`} aria-hidden="true">
      <svg className="envelope-svg" viewBox="0 0 430 310" fill="none">
        <path
          className="envelope-shadow"
          d="M66 105 Q66 97 74 97H357Q365 97 365 105V268Q365 277 356 277H75Q66 277 66 268Z"
        />
        <path
          className="envelope-back"
          d="M61 91Q61 82 70 82H355Q364 82 364 91V257Q364 266 355 266H70Q61 266 61 257Z"
        />
        <path className="letter-paper" d="M96 103H329V246H96Z" />
        <path className="letter-lines" d="M134 138H291M134 157H272M134 176H282" />
        <path
          className="envelope-front"
          d="M61 91L210 198L364 91V257Q364 266 355 266H70Q61 266 61 257Z"
        />
        <path className="envelope-fold" d="M61 261L178 175M364 261L247 175" />
        <path
          className="envelope-flap"
          d="M61 88Q61 82 70 82H355Q364 82 364 88L224 195Q214 202 203 195Z"
        />
        <g className="envelope-seal">
          <circle cx="213" cy="181" r="26" />
          <circle className="seal-rim" cx="213" cy="181" r="21" />
          <path
            className="seal-heart"
            d="M213 191s-15-9-15-17c0-8 11-10 15-2 5-8 16-6 16 2 0 8-16 17-16 17Z"
          />
        </g>
      </svg>
      <span className="envelope-spark spark-one">✦</span>
      <span className="envelope-spark spark-two">✧</span>
      <span className="envelope-spark spark-three">✧</span>
    </div>
  );
}

export function PhotoPlaceholder({ index = 0 }: { index?: number }) {
  const id = useId();
  return (
    <svg
      className={`photo-placeholder photo-tone-${index % 4}`}
      viewBox="0 0 400 430"
      role="img"
      aria-label="Replace me — your photo"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop className="photo-stop-one" />
          <stop offset="1" className="photo-stop-two" />
        </linearGradient>
      </defs>
      <rect width="400" height="430" fill={`url(#${id})`} />
      <path className="photo-mountain" d="M0 365L99 244L171 310L258 210L400 359V430H0Z" />
      <circle className="photo-sun" cx="294" cy="109" r="31" />
      <path
        className="photo-mark"
        d="M171 161h58v44h-58zM183 161l5-8h25l5 8M210 181a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
      />
      <text className="photo-label" x="200" y="238" textAnchor="middle">
        Replace me
      </text>
      <text className="photo-small" x="200" y="260" textAnchor="middle">
        a little moment, kept forever
      </text>
    </svg>
  );
}

export function Cake({ lit }: { lit: boolean }) {
  return (
    <svg
      className={`cake-art ${lit ? "cake-lit" : ""}`}
      viewBox="0 0 480 390"
      role="img"
      aria-label={lit ? "Birthday cake with glowing candles" : "Birthday cake with unlit candles"}
    >
      <ellipse className="cake-plate" cx="240" cy="332" rx="169" ry="24" />
      <path className="cake-body" d="M101 214h278v103c0 38-278 38-278 0Z" />
      <ellipse className="cake-top" cx="240" cy="214" rx="139" ry="37" />
      <path
        className="cake-icing"
        d="M101 216c15 23 24 20 26 39 3 20 22 20 25 0 2-18 14-9 21-5 11 8 7 39 22 39s13-25 21-27c15-6 28 6 33 22 7 23 23 20 25 0 3-28 12-28 25-28 13 0 13 35 30 35s13-42 25-45c13-3 19-14 25-30-77 47-210 47-278 0Z"
      />
      {[169, 240, 311].map((x) => (
        <g key={x}>
          <rect className="cake-candle" x={x - 6} y="129" width="12" height="76" rx="3" />
          <path
            className="candle-stripes"
            d={`M${x - 6} 145l12-7m-12 25l12-7m-12 25l12-7m-12 25l12-7`}
          />
          <path className="candle-wick" d={`M${x} 129v-8`} />
          <path className="candle-flame" d={`M${x} 119c-20-9-8-27 0-42 8 15 20 34 0 42Z`} />
        </g>
      ))}
      <path
        className="cake-decoration"
        d="M144 310l7-3m36 18l7-3m42 3l7-3m35 0l7-3m31-9l7-3m32-15l7-3"
      />
    </svg>
  );
}

export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}
