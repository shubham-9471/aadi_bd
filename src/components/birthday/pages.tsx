import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Heart,
  RotateCcw,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { chapters } from "./shell";
import { Cake, Confetti, Envelope, PhotoPlaceholder } from "./art";
import { Modal } from "./modal";

export function birthdayHead(title: string, description: string) {
  const fullTitle = `${title} · A Little Universe Made Just for You`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}

export function InvitationPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(
      () => {
        void navigate({ to: "/universe" });
      },
      reduce ? 450 : 2100,
    );
    return () => clearTimeout(timeout);
  }, [open, navigate, reduce]);
  return (
    <>
      <section className={`invitation ${open ? "invitation-open" : ""}`}>
        <div className="invitation-eyebrow">
          <span />A SMALL SECRET. A WHOLE LOT OF LOVE.
          <span />
        </div>
        <h1>
          A little universe,
          <br />
          <em>made just for you.</em>
        </h1>
        <p className="invitation-intro">Hey, you. Someone made something special for you.</p>
        <div className="envelope-scene">
          <span className="handwritten envelope-note">
            a little love,
            <br />
            sealed inside{" "}
            <svg viewBox="0 0 85 60" aria-hidden="true">
              <path d="M5 5Q6 54 70 43M59 33l15 10-15 9" />
            </svg>
          </span>
          <Envelope open={open} />
          <span className="scene-star">✧</span>
        </div>
        {open && (
          <motion.p
            className="handwritten opening-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {config.invitationMessage}
          </motion.p>
        )}
        <Button
          variant="surprise"
          className="invitation-cta"
          disabled={open}
          onClick={() => setOpen(true)}
        >
          {open ? "A little magic is on its way…" : "Open your surprise"}
          <Sparkles />
        </Button>
        <Link to="/universe" className="skip-intro">
          Skip intro <ArrowRight />
        </Link>
        <div className="invitation-bottom">
          <span className="tiny-star">✦</span>
          <span>NOT JUST A BIRTHDAY. A LITTLE CELEBRATION OF YOU.</span>
          <span className="tiny-star">✦</span>
        </div>
      </section>
      <div className="chapter-teaser">
        <span>FIVE LITTLE CHAPTERS</span>
        <span className="handwritten">One very special person.</span>
        <span>
          YOUR STORY IS ABOUT TO BEGIN <ArrowRight />
        </span>
      </div>
    </>
  );
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const target = Date.parse(config.birthdayDate);
  const valid = Number.isFinite(target);
  const remaining = now === null || !valid ? null : Math.max(0, target - now);
  if (remaining === 0)
    return (
      <div className="birthday-countdown celebration">
        <Sparkles />
        <span className="handwritten">It's your time to shine. Happy birthday!</span>
        <Sparkles />
      </div>
    );
  const values =
    remaining === null
      ? ["—", "—", "—", "—"]
      : [
          Math.floor(remaining / 86400000),
          Math.floor(remaining / 3600000) % 24,
          Math.floor(remaining / 60000) % 60,
          Math.floor(remaining / 1000) % 60,
        ].map((n) => String(n).padStart(2, "0"));
  return (
    <div className="countdown-section">
      <span className="eyebrow">
        {valid ? "COUNTING DOWN TO YOUR SPECIAL DAY" : config.birthdayDate}
      </span>
      <div className="birthday-countdown">
        {values.map((value, index) => (
          <div key={index}>
            <strong>{value}</strong>
            <span>{["days", "hours", "minutes", "seconds"][index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UniversePage() {
  const [surprise, setSurprise] = useState(false);
  const [parallax, setParallax] = useState(false);
  return (
    <div className="content-page universe-page">
      <section
        className={`universe-hero ${parallax ? "photo-dreaming" : ""}`}
        onPointerMove={(event) => {
          if (event.pointerType === "mouse") setParallax(true);
        }}
        onPointerLeave={() => setParallax(false)}
      >
        <div className="universe-hero-copy">
          <span className="eyebrow">CHAPTER 02 / YOUR UNIVERSE</span>
          <p className="handwritten personal-greeting">For the one & only,</p>
          <h1 className="name-heading">
            {config.name}
            <span>✧</span>
          </h1>
          <h2>{config.headline}</h2>
          <p className="personal-intro">{config.intro}</p>
          <Countdown />
          <Button variant="quiet" onClick={() => setSurprise(true)}>
            <Sparkles />A little surprise for you
          </Button>
        </div>
        <figure className="hero-polaroid">
          <div className="photo-tape" />
          {config.photos[0]?.src ? (
            <img src={config.photos[0].src} alt={config.photos[0].caption} />
          ) : (
            <PhotoPlaceholder />
          )}
          <figcaption className="handwritten">the main character, always ♡</figcaption>
          <span className="polaroid-star">✦</span>
        </figure>
      </section>
      <section className="chapters-section">
        <span className="eyebrow">A BIRTHDAY, IN LITTLE PIECES</span>
        <h2>
          Five little chapters.
          <br />
          <em>One very special person.</em>
        </h2>
        <div className="chapter-grid">
          {chapters.map((chapter) => (
            <Link className="chapter-card" to={chapter.path} key={chapter.path}>
              <div className="chapter-card-top">
                <span>{chapter.number}</span>
                <ArrowRight />
              </div>
              <span className="chapter-symbol">{chapter.symbol}</span>
              <h3>{chapter.label}</h3>
              <p>{chapter.text}</p>
            </Link>
          ))}
        </div>
      </section>
      {surprise && (
        <Modal title="A tiny piece of magic" onClose={() => setSurprise(false)}>
          <Confetti />
          <span className="modal-symbol">♡</span>
          <p className="handwritten secret-message">{config.specialMessages.surprise}</p>
        </Modal>
      )}
    </div>
  );
}

export function MemoriesPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const photo = selected === null ? undefined : config.photos[selected];
  return (
    <div className="content-page memories-page">
      <header className="page-title">
        <span className="eyebrow">CHAPTER 03 / GALLERY & VIBES</span>
        <span className="title-flower" aria-hidden="true">
          ❀
        </span>
        <h1>
          Abeyy aab itnii bhii
          <br />
          <em>jyada tareef nii krr skta maii teri</em>
        </h1>
        <p className="handwritten">Bas photo dekh aur khush reh ✨</p>
      </header>
      <section className="memory-gallery" aria-label="Photo memories">
        {config.photos.map((item, i) => (
          <figure className="memory-polaroid" key={i}>
            <Button
              variant="tool"
              className="photo-button"
              aria-label={`Open photo ${i + 1}: ${item.caption}`}
              onClick={() => setSelected(i)}
            >
              {item.src ? (
                <img src={item.src} alt={item.caption} />
              ) : (
                <PhotoPlaceholder index={i} />
              )}
            </Button>
            <figcaption>
              <p className="handwritten">{item.caption}</p>
              <span>{item.date}</span>
            </figcaption>
            {i % 2 === 0 && <div className="photo-tape" />}
          </figure>
        ))}
      </section>
      <section className="timeline-section">
        <div className="memory-timeline" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <h2 className="handwritten" style={{ fontSize: '1.8rem', color: '#e11d48' }}>
            "Abeyy aab itnii bhii jyada tareef nii krr skta maii teri"
          </h2>
        </div>
      </section>
      <NextChapter to="/smile" text="A few more reasons to smile" />
      {photo && (
        <Modal title="A moment worth keeping" onClose={() => setSelected(null)}>
          <figure className="lightbox-photo">
            {photo.src ? (
              <img src={photo.src} alt={photo.caption} />
            ) : (
              <PhotoPlaceholder index={selected ?? 0} />
            )}
            <figcaption className="handwritten">{photo.caption}</figcaption>
            <p>{photo.date}</p>
          </figure>
        </Modal>
      )}
    </div>
  );
}

function Quiz() {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const question = config.quiz[step];
  const done = step >= config.quiz.length;
  return (
    <section className="quiz-section">
      <span className="eyebrow">A LITTLE BIRTHDAY QUIZ</span>
      <h2>
        How well do you know
        <br />
        your own <em>birthday universe?</em>
      </h2>
      <div className="quiz-tool">
        {done ? (
          <>
            <Confetti />
            <span className="modal-symbol">✧</span>
            <h3>Your universe, unlocked.</h3>
            <p>
              {score} of {config.quiz.length} stars collected
            </p>
            <p className="handwritten">{config.specialMessages.quizReward}</p>
            <Button
              variant="quiet"
              onClick={() => {
                setStep(0);
                setAnswer(null);
                setScore(0);
              }}
            >
              <RotateCcw />
              Play again
            </Button>
          </>
        ) : question ? (
          <>
            <div className="quiz-progress">
              <span>
                QUESTION {step + 1} OF {config.quiz.length}
              </span>
              <span>
                {config.quiz.map((_, i) => (
                  <i className={i <= step ? "complete" : ""} key={i} />
                ))}
              </span>
            </div>
            <h3>{question.question}</h3>
            <div className="quiz-options">
              {question.answers.map((option, i) => (
                <Button
                  key={i}
                  variant="quiet"
                  className={answer === i ? "answer-selected" : ""}
                  disabled={answer !== null}
                  onClick={() => {
                    setAnswer(i);
                    if (i === question.correctIndex) setScore(score + 1);
                  }}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  {option}
                  {answer === i && <Check />}
                </Button>
              ))}
            </div>
            {answer !== null && (
              <div className="quiz-feedback" role="status">
                <p>
                  {answer === question.correctIndex
                    ? "A star for you! ✦"
                    : `A little discovery: ${question.answers[question.correctIndex] ?? "—"}`}
                </p>
                <Button
                  variant="surprise"
                  onClick={() => {
                    setStep(step + 1);
                    setAnswer(null);
                  }}
                >
                  {step + 1 === config.quiz.length ? "Reveal your reward" : "Next question"}
                  <ArrowRight />
                </Button>
              </div>
            )}
          </>
        ) : (
          <p>Your birthday questions are on their way.</p>
        )}
      </div>
    </section>
  );
}

export function SmilePage() {
  const [flipped, setFlipped] = useState<number[]>([]);
  const [sweet, setSweet] = useState("");
  const [note, setNote] = useState<number | null>(null);
  const [secret, setSecret] = useState(false);
  function randomSweet() {
    const options = config.specialMessages.sweet.filter((message) => message !== sweet);
    setSweet(
      options[Math.floor(Math.random() * options.length)] ?? config.specialMessages.sweet[0] ?? "",
    );
  }
  return (
    <div className="content-page smile-page">
      <header className="page-title">
        <span className="eyebrow">CHAPTER 04 / REASONS TO SMILE</span>
        <h1>
          Things that make
          <br />
          you, <em>YOU.</em>
        </h1>
        <p className="handwritten">The world is a little lovelier with you in it.</p>
        <Button
          variant="tool"
          size="icon"
          className="hidden-star"
          aria-label="A curious little star"
          title="A curious little star"
          onClick={() => setSecret(true)}
        >
          ✦
        </Button>
      </header>
      <section className="compliment-grid" aria-label="Reasons you're special">
        {config.compliments.map((compliment, i) => {
          const isFlipped = flipped.includes(i);
          return (
            <Button
              variant="tool"
              className={`compliment-card ${isFlipped ? "flipped" : ""}`}
              key={i}
              aria-pressed={isFlipped}
              aria-label={`${compliment.title}: ${isFlipped ? "close note" : "reveal note"}`}
              onClick={() =>
                setFlipped(isFlipped ? flipped.filter((n) => n !== i) : [...flipped, i])
              }
            >
              <span className="flip-inner">
                <span className="flip-front">
                  <span className="compliment-symbol">{compliment.symbol}</span>
                  <span className="compliment-title">{compliment.title}</span>
                  <span className="flip-hint">
                    a little love note <ArrowRight />
                  </span>
                </span>
                <span className="flip-back">
                  <Heart />
                  <span className="handwritten">{compliment.text}</span>
                </span>
              </span>
            </Button>
          );
        })}
      </section>
      <section className="sweet-section">
        <span className="eyebrow">IN CASE YOU NEEDED TO HEAR IT</span>
        <h2>
          A little sweetness,
          <br />
          <em>just because.</em>
        </h2>
        <Button variant="surprise" onClick={randomSweet}>
          <Sparkles />A random sweet message
        </Button>
        <div className="sweet-message" role="status">
          {sweet && (
            <motion.p
              key={sweet}
              className="handwritten"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {sweet}
            </motion.p>
          )}
        </div>
      </section>
      <section className="open-when-section">
        <h2>
          Open when you need <em>a smile.</em>
        </h2>
        <div className="notes-grid">
          {config.specialMessages.notes.map((item, i) => (
            <Button
              variant="quiet"
              key={i}
              className="open-note"
              aria-expanded={note === i}
              onClick={() => setNote(note === i ? null : i)}
            >
              <span className="note-envelope">✉</span>
              <span>
                {item.title}
                {note === i && <span className="handwritten note-text">{item.text}</span>}
              </span>
              <ChevronDown />
            </Button>
          ))}
        </div>
      </section>
      <Quiz />
      <NextChapter to="/finale" text="There's one last wish waiting for you" />
      {secret && (
        <Modal title="Even the stars have secrets" onClose={() => setSecret(false)}>
          <p className="handwritten secret-message">{config.specialMessages.hiddenStar}</p>
        </Modal>
      )}
    </div>
  );
}

export function FinalePage() {
  const [stage, setStage] = useState<"unlit" | "lit" | "wish">("unlit");
  const [letter, setLetter] = useState("");
  const reduced = useReducedMotion();
  useEffect(() => {
    if (stage !== "wish") {
      setLetter("");
      return;
    }
    if (reduced || document.documentElement.dataset["reducedMotion"] === "true") {
      setLetter(config.finalLetter);
      return;
    }
    let index = 0;
    const interval = setInterval(() => {
      index = Math.min(index + 3, config.finalLetter.length);
      setLetter(config.finalLetter.slice(0, index));
      if (index === config.finalLetter.length) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [stage, reduced]);
  return (
    <div className={`finale-page ${stage === "wish" ? "wish-made" : ""}`}>
      <section className="finale-scene">
        <span className="eyebrow">CHAPTER 05 / ONE LAST WISH</span>
        <p className="handwritten">And now, a little birthday magic…</p>
        <h1>
          {stage === "wish" ? (
            <>
              Happy Birthday,
              <br />
              <em>{config.name}</em> <span className="birthday-heart">♡</span>
            </>
          ) : (
            <>
              A cake. A wish.
              <br />
              <em>A whole lot of love.</em>
            </>
          )}
        </h1>
        <Button
          variant="tool"
          className="cake-button"
          disabled={stage !== "unlit"}
          aria-label="Light the birthday candles"
          onClick={() => setStage("lit")}
        >
          <Cake lit={stage === "lit"} />
        </Button>
        {stage === "unlit" && (
          <>
            <p className="handwritten cake-note">A little spark is all it takes.</p>
            <Button variant="surprise" onClick={() => setStage("lit")}>
              <Sparkles />
              Light the candles
            </Button>
          </>
        )}
        {stage === "lit" && (
          <>
            <p className="handwritten cake-note">Close your eyes. Keep a wish in your heart.</p>
            <Button variant="surprise" onClick={() => setStage("wish")}>
              Make a wish ✨<ArrowRight />
            </Button>
          </>
        )}
        {stage === "wish" && (
          <>
            <Confetti />
            <motion.article
              className="final-letter"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="letter-symbol">♡</span>
              <span className="eyebrow">A LETTER, FROM THE HEART</span>
              <p className="handwritten typewriter" aria-hidden="true">
                {letter}
                <span className={letter.length < config.finalLetter.length ? "type-cursor" : ""} />
              </p>
              <p className="sr-only">{config.finalLetter}</p>
            </motion.article>
            <p className="end-line">
              Some people make the world a little brighter just by being in it.
              <br />
              <em>You're one of them.</em>
            </p>
            <Button variant="quiet" onClick={() => setStage("unlit")}>
              <RotateCcw />
              Make another wish
            </Button>
            <Link className="replay-link" to="/">
              <ArrowLeft />
              Replay your little universe
            </Link>
          </>
        )}
      </section>
    </div>
  );
}

function NextChapter({ to, text }: { to: "/smile" | "/finale"; text: string }) {
  return (
    <div className="next-chapter">
      <span className="handwritten">{text}</span>
      <Button variant="quiet" asChild>
        <Link to={to}>
          Next chapter
          <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
