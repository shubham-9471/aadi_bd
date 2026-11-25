import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowUpRight, Menu, X, Sparkles, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MusicPlayer } from "./music-player";
import { Modal } from "./modal";
import { config } from "@/config";

export const chapters = [
  {
    path: "/",
    label: "The invitation",
    short: "Invitation",
    number: "01",
    symbol: "✉",
    text: "A little secret, just for you.",
  },
  {
    path: "/universe",
    label: "Your universe",
    short: "Universe",
    number: "02",
    symbol: "✧",
    text: "Today, all the stars are yours.",
  },
  {
    path: "/memories",
    label: "Gallery & Vibes",
    short: "Memories",
    number: "03",
    symbol: "❀",
    text: "Abeyy aab itnii bhii jyada tareef nii krr skta maii teri",
  },
  {
    path: "/smile",
    label: "Reasons to smile",
    short: "Smile",
    number: "04",
    symbol: "♡",
    text: "A few things that make you, you.",
  },
  {
    path: "/finale",
    label: "One last wish",
    short: "Finale",
    number: "05",
    symbol: "☆",
    text: "Save a little magic for the end.",
  },
] as const;

export function BirthdayShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [secret, setSecret] = useState("");
  const [clicks, setClicks] = useState(0);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset["reducedMotion"] = String(reduced);
  }, [reduced]);
  useEffect(() => {
    setMenu(false);
  }, [pathname]);
  useEffect(() => {
    let typed = "";
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") setMenu(false);
      if (
        event.target instanceof HTMLElement &&
        (event.target.matches("input, textarea, select") || event.target.isContentEditable)
      )
        return;
      if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
      typed = (typed + event.key.toLowerCase()).slice(-4);
      if (typed === "wish") {
        setSecret(config.specialMessages.wish);
        typed = "";
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <div className={`birthday-shell ${pathname === "/" ? "invitation-shell" : ""}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="starfield" aria-hidden="true">
          {Array.from({ length: 38 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <header className="site-header">
          <Link
            className="universe-logo"
            to="/"
            aria-label="A Little Universe — invitation"
            onClick={() => {
              const next = clicks + 1;
              setClicks(next % 5);
              if (next === 5) setSecret(config.specialMessages.logo);
            }}
          >
            <span className="logo-star">✦</span>
            <span>
              a little
              <br />
              <strong>universe</strong>
            </span>
          </Link>
          <div className="header-right">
            <span className="header-dedication">a birthday story, just for you</span>
            <Button
              variant="tool"
              size="icon"
              aria-label="Reduced motion"
              title="Reduced motion"
              aria-pressed={reduced}
              onClick={() => setReduced(!reduced)}
            >
              <Accessibility />
            </Button>
            <Button
              variant="tool"
              className="menu-toggle"
              aria-label={menu ? "Close chapters menu" : "Open chapters menu"}
              aria-expanded={menu}
              aria-controls="chapter-menu"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
              <span>Chapters</span>
            </Button>
          </div>
        </header>
        <AnimatePresence>
          {menu && (
            <motion.nav
              id="chapter-menu"
              className="chapter-menu"
              aria-label="Birthday chapters"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <span className="eyebrow">YOUR LITTLE UNIVERSE</span>
              {chapters.map((chapter) => (
                <Link
                  key={chapter.path}
                  to={chapter.path}
                  className={pathname === chapter.path ? "active" : ""}
                >
                  <span>{chapter.number}</span>
                  {chapter.label}
                  <ArrowUpRight />
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            id="main-content"
            key={pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0 : 0.35 }}
            tabIndex={-1}
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <footer className="site-footer">
          <span>
            MADE WITH A LITTLE LOVE <span className="footer-heart">♡</span>
          </span>
          <span>one person. a whole universe.</span>
          <Sparkles aria-hidden="true" />
        </footer>
        <MusicPlayer />
        {secret && (
          <Modal title="You found a little secret ✧" onClose={() => setSecret("")}>
            <p className="handwritten secret-message">{secret}</p>
          </Modal>
        )}
      </div>
    </MotionConfig>
  );
}
