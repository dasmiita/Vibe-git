import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const TYPING_WORDS = [
  "Ship your code.",
  "Share your vibe.",
  "Build in public.",
  "Code with soul.",
  "Make it yours."
];

const FLOATING_SYMBOLS = [
  { text: "{}",   x: "8%",  y: "15%", delay: "0s",   dur: "6s",  size: "1.4rem", opacity: 0.18 },
  { text: "</>",  x: "88%", y: "10%", delay: "1s",   dur: "8s",  size: "1.1rem", opacity: 0.14 },
  { text: "//",   x: "5%",  y: "70%", delay: "2s",   dur: "7s",  size: "1.2rem", opacity: 0.16 },
  { text: "=>",   x: "92%", y: "65%", delay: "0.5s", dur: "9s",  size: "1rem",   opacity: 0.13 },
  { text: "[ ]",  x: "15%", y: "85%", delay: "3s",   dur: "6s",  size: "1.1rem", opacity: 0.15 },
  { text: "&&",   x: "80%", y: "80%", delay: "1.5s", dur: "7s",  size: "1rem",   opacity: 0.12 },
  { text: "fn()", x: "75%", y: "30%", delay: "2.5s", dur: "8s",  size: "0.95rem",opacity: 0.14 },
  { text: "git",  x: "20%", y: "40%", delay: "4s",   dur: "10s", size: "0.9rem", opacity: 0.11 },
  { text: "npm",  x: "60%", y: "88%", delay: "1s",   dur: "7s",  size: "0.9rem", opacity: 0.12 },
  { text: "★",    x: "45%", y: "12%", delay: "3.5s", dur: "9s",  size: "1rem",   opacity: 0.1  },
];

const TERMINAL_LINES = [
  { text: "$ git init vibegit",        delay: 0 },
  { text: "Initialized empty repo ✓",  delay: 0.6 },
  { text: "$ npm run vibe",            delay: 1.2 },
  { text: "Building your vibe... 🔥",  delay: 1.8 },
  { text: "✓ Deployed to vibegit.dev", delay: 2.4 },
];

// ── Typing animation ───────────────────────────────────────
function TypingText() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPING_WORDS[wordIdx];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % TYPING_WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx]);

  return (
    <span className="typing-text">
      {displayed}<span className="cursor">|</span>
    </span>
  );
}

// ── Terminal card ──────────────────────────────────────────
function Terminal() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [deployed, setDeployed] = useState(false);

  const run = () => {
    setDeployed(false);
    setVisibleLines([]);
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line.text]);
        if (i === TERMINAL_LINES.length - 1) setDeployed(true);
      }, line.delay * 1000 + 400);
    });
  };

  useEffect(() => { run(); }, []);

  return (
    <motion.div
      className="terminal-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 90 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="terminal-bar">
        <span className="t-dot t-red" />
        <span className="t-dot t-yellow" />
        <span className="t-dot t-green" />
        <span className="terminal-title">vibegit — bash</span>
      </div>
      <div className="terminal-body">
        {visibleLines.map((line, i) => (
          <motion.div
            key={i}
            className={`terminal-line ${line.startsWith("✓") ? "terminal-success" : line.startsWith("$") ? "terminal-cmd" : "terminal-out"}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            {line}
          </motion.div>
        ))}
        <motion.span
          className="terminal-cursor"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        >█</motion.span>
      </div>
      <motion.button
        className={`deploy-btn ${deployed ? "deploy-ready" : ""}`}
        onClick={run}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {deployed ? "⚡ Re-Deploy" : "⏳ Deploying..."}
      </motion.button>
    </motion.div>
  );
}

// ── Hero title with per-letter hover ──────────────────────
function HeroTitle() {
  const vibe = "Vibe".split("");
  const git  = "Git".split("");

  return (
    <h1 className="hero-title">
      <span className="hero-title-vibe" style={{ display: "block" }}>
        {vibe.map((l, i) => (
          <motion.span
            key={i}
            className="hero-letter-vibe"
            whileHover={{ scale: 1.18, y: -6, transition: { duration: 0.15 } }}
            style={{ display: "inline-block" }}
          >{l}</motion.span>
        ))}
      </span>
      <span className="hero-title-git" style={{ display: "block" }}>
        {git.map((l, i) => (
          <motion.span
            key={i}
            className="hero-letter-git"
            whileHover={{ scale: 1.18, y: -6, transition: { duration: 0.15 } }}
            style={{ display: "inline-block" }}
          >{l}</motion.span>
        ))}
      </span>
    </h1>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup ? form : { email: form.email, password: form.password };
      const res = await api.post(endpoint, payload);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="login-page">

      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />
      <div className="noise-overlay" />

      {FLOATING_SYMBOLS.map((s, i) => (
        <span
          key={i}
          className="float-symbol"
          style={{ left: s.x, top: s.y, animationDelay: s.delay, animationDuration: s.dur, fontSize: s.size, opacity: s.opacity }}
        >
          {s.text}
        </span>
      ))}

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-content">

          <div className="hero-badge">for vibe coders</div>

          <HeroTitle />

          <p className="hero-tagline"><TypingText /></p>

          <p className="hero-desc">
            A social platform where developers share projects,<br />
            remix ideas, and build in public — with style.
          </p>

          <div className="hero-actions">
            <button className="hero-cta" onClick={scrollToForm}>
              Get Started
              <span className="hero-cta-arrow">→</span>
            </button>
            <div className="hero-stats">
              <span>Projects</span>
              <span>Remixes</span>
              <span>Vibes</span>
            </div>
          </div>

          <Terminal />
        </div>

        <div className="hero-scroll-hint" onClick={scrollToForm}>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── Auth ── */}
      <section className="auth-section" ref={formRef}>
        <div className="auth-card">

          <div className="auth-card-glow" />

          <div className="auth-header">
            <h2 className="auth-logo">⚡ VibeGit</h2>
            <p className="auth-sub">
              {isSignup ? "// join the vibe." : "// welcome back."}
            </p>
          </div>

          <div className="auth-tabs">
            <button className={`auth-tab ${!isSignup ? "active" : ""}`} onClick={() => { setIsSignup(false); setError(""); }}>Login</button>
            <button className={`auth-tab ${isSignup ? "active" : ""}`}  onClick={() => { setIsSignup(true);  setError(""); }}>Sign Up</button>
            <div className={`auth-tab-indicator ${isSignup ? "right" : "left"}`} />
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <AnimatePresence>
              {isSignup && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="input-group">
                    <span className="input-icon">@</span>
                    <input
                      placeholder="username"
                      value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })}
                      required
                      autoComplete="off"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="input-group">
              <input
                type="email"
                placeholder="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="input-eye"
                onClick={() => setShowPassword(s => !s)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p className="auth-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-loading"><span /><span /><span /></span>
              ) : (
                isSignup ? "create account →" : "sign in →"
              )}
            </button>
          </form>

          <p className="auth-toggle">
            {isSignup ? "already have an account?" : "new to vibegit?"}{" "}
            <span onClick={() => { setIsSignup(s => !s); setError(""); }}>
              {isSignup ? "sign in" : "sign up"}
            </span>
          </p>
        </div>
      </section>

    </div>
  );
}
