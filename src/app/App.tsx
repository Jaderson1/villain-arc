import { useState, useEffect, useRef } from "react";
import {
  Play,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Check,
  RotateCcw,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── types ───────────────────────────────────────────────────────────────────

interface Character {
  id: string;
  name: string;
  series: string;
  fromLabel: string;
  toLabel: string;
  startColor: string;
  endColor: string;
  progress: number;
  quote: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
}

// ─── data ─────────────────────────────────────────────────────────────────────

const CHARACTERS: Character[] = [
  {
    id: "eren",
    name: "EREN YEAGER",
    series: "Attack on Titan",
    fromLabel: "HERO",
    toLabel: "TITAN",
    startColor: "#3E8E7E",
    endColor: "#C1432E",
    progress: 78,
    quote:
      '"I keep moving forward until my enemies are destroyed."',
    description:
      "Starts as a hero seeking freedom for his people. His beliefs and actions shift so dramatically that audiences across the world still debate whether he ever truly became a villain — or remained a prisoner of his own convictions.",
    imageUrl:
      "https://i.pinimg.com/736x/db/c7/1b/dbc71b68572b5586d9da9938d6340b8b.jpg",
    videoUrl: "https://www.youtube.com/watch?v=zOBxPFRu1XI",
  },
  {
    id: "meruem",
    name: "MERUEM",
    series: "Hunter × Hunter",
    fromLabel: "CRUEL",
    toLabel: "EMPATHY",
    startColor: "#E8E2D5",
    endColor: "#5B3470",
    progress: 100,
    quote:
      '"Even I, the most powerful being alive, could learn what it means to live."',
    description:
      "Born believing humans were inferior creatures unworthy of his attention. Through a single bond with Komugi, he discovers empathy, respect, and the fragile weight of life — completing the most devastating arc in shonen history.",
    imageUrl:
      "https://i.pinimg.com/736x/7f/5f/64/7f5f6446030c303c1ad703c0750cd95b.jpg",
    videoUrl: "https://www.youtube.com/shorts/Qi0s5AKSRBg?feature=share",
  },
  {
    id: "vader",
    name: "DARTH VADER",
    series: "Star Wars",
    fromLabel: "JEDI",
    toLabel: "REDEMPTION",
    startColor: "#D4A24C",
    endColor: "#9E1B1B",
    progress: 55,
    quote:
      '"There is still good in him."',
    description:
      "Once Anakin Skywalker — gifted Jedi Knight, hopeful father, devoted husband. Fear and grief bent him toward the dark side. Decades later, a son's refusal to give up on him becomes the axis of his redemption.",
    imageUrl:
      "https://images.unsplash.com/photo-1547700055-b61cacebece9?w=480&h=600&fit=crop&auto=format",
    videoUrl: "https://www.youtube.com/watch?v=oKMBsEUkjA4",
  },
];

// ─── arc bar ─────────────────────────────────────────────────────────────────

interface ArcBarProps {
  fromLabel: string;
  toLabel: string;
  startColor: string;
  endColor: string;
  progress: number;
  animate?: boolean;
  thin?: boolean;
}

function ArcBar({
  fromLabel,
  toLabel,
  startColor,
  endColor,
  progress,
  animate = true,
  thin = false,
}: ArcBarProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : progress);

  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => setDisplayed(progress), 120);
    return () => clearTimeout(timer);
  }, [animate, progress]);

  return (
    <div className="w-full select-none">
      <div className="flex justify-between mb-2">
        <span
          className="font-mono text-[11px] uppercase tracking-widest"
          style={{ color: startColor, opacity: 0.8 }}
        >
          {fromLabel}
        </span>
        <span
          className="font-mono text-[11px] uppercase tracking-widest"
          style={{ color: endColor, opacity: 0.8 }}
        >
          {toLabel}
        </span>
      </div>

      <div
        className="relative w-full rounded-full"
        style={{
          height: thin ? "3px" : "6px",
          background: `linear-gradient(90deg, ${startColor}, ${endColor})`,
        }}
      >
        {!thin && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 16,
              height: 16,
              background: "#0B0B0F",
              border: "3px solid #EDEAE3",
              marginLeft: -8,
            }}
            animate={{ left: `${displayed}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </div>
    </div>
  );
}

// ─── video modal ─────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }
    if (u.pathname.startsWith("/shorts/")) {
      return u.pathname.split("/shorts/")[1];
    }
    if (u.pathname.startsWith("/embed/")) {
      return u.pathname.split("/embed/")[1];
    }
    const v = u.searchParams.get("v");
    if (v) return v;
    return "";
  } catch {
    return "";
  }
}

function VideoModal({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const videoId = extractYouTubeId(url);
  const isShort = url.includes("/shorts/");

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(11,11,15,0.92)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full mx-4"
        style={{ maxWidth: isShort ? 380 : 768 }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute -top-10 right-0 text-[#8A8A92] hover:text-[#EDEAE3] transition-colors"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div className="relative" style={{ paddingBottom: isShort ? "177.78%" : "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-sm"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Character arc video"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── watch button ─────────────────────────────────────────────────────────────

function WatchButton({
  endColor,
  onClick,
}: {
  endColor: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2 font-mono text-[13px] uppercase tracking-widest rounded-full transition-all duration-300"
      style={{
        padding: "10px 22px",
        border: `1.5px solid ${endColor}`,
        background: hovered ? endColor : "transparent",
        color: hovered ? "#0B0B0F" : endColor,
      }}
    >
      <Play size={13} fill={hovered ? "#0B0B0F" : endColor} />
      Watch arc
    </button>
  );
}

// ─── slides ───────────────────────────────────────────────────────────────────

function SlideCover() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 overflow-hidden">
      {/* background arc bars — texture */}
      <div className="absolute inset-0 flex flex-col justify-center gap-12 px-8 md:px-16 pointer-events-none opacity-[0.07]">
        {CHARACTERS.map((c) => (
          <ArcBar
            key={c.id}
            fromLabel=""
            toLabel=""
            startColor={c.startColor}
            endColor={c.endColor}
            progress={c.progress}
            animate={false}
            thin
          />
        ))}
      </div>

      <motion.div
        className="relative max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.2em] mb-8"
          style={{ color: "#8A8A92" }}
        >
          Character Analysis
        </p>
        <h1
          className="font-display text-[clamp(52px,10vw,96px)] leading-[0.9] uppercase mb-8"
          style={{ letterSpacing: "-0.02em", color: "#EDEAE3" }}
        >
          Villains
          <br />
          Who Outgrew
          <br />
          The Hero
        </h1>
        <p
          className="text-lg leading-relaxed max-w-lg"
          style={{ color: "#8A8A92", fontFamily: "Inter, sans-serif" }}
        >
          Why some antagonists are more developed than the protagonists
          they stand against.
        </p>
      </motion.div>
    </section>
  );
}

function SlideArgument() {
  return (
    <section
      className="min-h-screen flex flex-col justify-center px-8 md:px-16"
      style={{ borderTop: "1px solid #2A2A33" }}
    >
      <motion.div
        className="max-w-3xl w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.2em] mb-10"
          style={{ color: "#8A8A92" }}
        >
          The Argument
        </p>

        <h2
          className="font-display text-[clamp(36px,6vw,64px)] leading-[0.92] uppercase mb-10"
          style={{ letterSpacing: "-0.02em", color: "#EDEAE3" }}
        >
          Protagonists are usually
          <br />
          the center of the story.
          <br />
          But some villains
          <br />
          carry more weight.
        </h2>

        <div
          className="w-full h-px mb-10"
          style={{ background: "#2A2A33" }}
        />

        <ul
          className="flex flex-col gap-3"
          style={{ color: "#8A8A92", fontFamily: "Inter, sans-serif" }}
        >
          {[
            "More complex personalities.",
            "Deeper motivations.",
            "Greater character development.",
          ].map((line) => (
            <li key={line} className="flex items-center gap-3 text-base">
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: "#8A8A92" }}
              />
              {line}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}

function SlideCharacter({
  character,
  onWatch,
}: {
  character: Character;
  onWatch: () => void;
}) {
  return (
    <section
      className="min-h-screen flex flex-col justify-center px-8 md:px-16 py-16"
      style={{ borderTop: "1px solid #2A2A33" }}
    >
      <motion.div
        className="max-w-5xl w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
          <h2
            className="font-display text-[clamp(40px,8vw,80px)] leading-none uppercase"
            style={{ letterSpacing: "-0.02em", color: "#EDEAE3" }}
          >
            {character.name}
          </h2>
          <span
            className="font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "#8A8A92" }}
          >
            {character.series}
          </span>
        </div>

        {/* Arc Bar */}
        <div className="mt-6 mb-10">
          <ArcBar
            fromLabel={character.fromLabel}
            toLabel={character.toLabel}
            startColor={character.startColor}
            endColor={character.endColor}
            progress={character.progress}
            animate
          />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 items-start">
          {/* Image */}
          <div
            className="relative overflow-hidden rounded-sm aspect-[4/5]"
            style={{ background: "#15151C" }}
          >
            <img
              src={character.imageUrl}
              alt={`${character.name} visual`}
              className="w-full h-full object-cover opacity-80"
              style={{
                filter: `grayscale(60%) contrast(1.1)`,
              }}
            />
            {/* duotone overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, ${character.startColor}22, ${character.endColor}44)`,
                mixBlendMode: "multiply",
              }}
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6 pt-2">
            <blockquote
              className="text-xl leading-snug"
              style={{
                color: character.endColor,
                fontFamily: "Inter, sans-serif",
                fontStyle: "italic",
              }}
            >
              {character.quote}
            </blockquote>

            <div
              className="w-12 h-px"
              style={{ background: "#2A2A33" }}
            />

            <p
              className="text-base leading-relaxed"
              style={{ color: "#8A8A92", fontFamily: "Inter, sans-serif" }}
            >
              {character.description}
            </p>

            <WatchButton
              endColor={character.endColor}
              onClick={onWatch}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── recap: place your bet ──────────────────────────────────────────────────

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
const BET_GOLD = "#D9A441";
const BET_ROUNDS = 5;

const QUESTION_BANK: Record<
  number,
  { q: string; options: string[]; answer: number }[]
> = {
  1: [
    {
      q: "Which titan can Eren transform into?",
      options: ["Attack Titan", "Armored Titan", "Colossal Titan", "Beast Titan"],
      answer: 0,
    },
    {
      q: "What is Darth Vader's home planet?",
      options: ["Tatooine", "Naboo", "Coruscant", "Alderaan"],
      answer: 0,
    },
  ],
  2: [
    {
      q: "What military unit does Eren join after enlisting?",
      options: ["Survey Corps", "Garrison Regiment", "Military Police", "Royal Guard"],
      answer: 0,
    },
    {
      q: "What was Darth Vader's name before he turned to the dark side?",
      options: ["Anakin Skywalker", "Obi-Wan Kenobi", "Qui-Gon Jinn", "Mace Windu"],
      answer: 0,
    },
  ],
  3: [
    {
      q: "What is Meruem's role among the Chimera Ants?",
      options: ["King", "Royal Guard", "Squadron Leader", "Soldier"],
      answer: 0,
    },
    {
      q: "Who trains Anakin Skywalker as a Jedi apprentice?",
      options: ["Obi-Wan Kenobi", "Yoda", "Mace Windu", "Qui-Gon Jinn"],
      answer: 0,
    },
  ],
  4: [
    {
      q: "Who teaches Meruem about patience and connection through a board game?",
      options: ["Komugi", "Netero", "Pitou", "Gon"],
      answer: 0,
    },
    {
      q: "What is the name of the outermost wall protecting humanity in Attack on Titan?",
      options: ["Wall Maria", "Wall Rose", "Wall Sina", "Wall Eldia"],
      answer: 0,
    },
  ],
  5: [
    {
      q: "What board game does Meruem become obsessed with mastering?",
      options: ["Gungi", "Shogi", "Chess", "Go"],
      answer: 0,
    },
    {
      q: "On which planet does the duel that costs Anakin his limbs take place?",
      options: ["Mustafar", "Geonosis", "Kamino", "Coruscant"],
      answer: 0,
    },
  ],
  6: [
    {
      q: "Whose name does Meruem ask to be written correctly, as a final act of growth?",
      options: ["Komugi", "Netero", "Pitou", "Gon"],
      answer: 0,
    },
    {
      q: "What large-scale event does Eren ultimately set in motion later in the story?",
      options: [
        "The Rumbling",
        "The Coordinate's Awakening",
        "The Founder's Curse",
        "The Eclipse",
      ],
      answer: 0,
    },
  ],
};

function difficultyLabel(value: number) {
  if (value <= 2) return { label: "Easy", color: "#3E8E7E" };
  if (value <= 4) return { label: "Medium", color: BET_GOLD };
  return { label: "Hard", color: "#C1432E" };
}

function shuffleQuestion(question: {
  q: string;
  options: string[];
  answer: number;
}) {
  const indices = question.options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    q: question.q,
    options: indices.map((i) => question.options[i]),
    answer: indices.indexOf(question.answer),
  };
}

function pickQuestion(value: number, used: Set<string>) {
  const bank = QUESTION_BANK[value];
  const fresh = bank.filter((_, i) => !used.has(`${value}-${i}`));
  const pool = fresh.length ? fresh : bank;
  const template = pool[Math.floor(Math.random() * pool.length)];
  const idx = bank.indexOf(template);
  return { question: shuffleQuestion(template), key: `${value}-${idx}` };
}

type BetView = "intro" | "rolling" | "question" | "answered" | "summary";

function BetQuizOverlay({ onClose }: { onClose: (score: number) => void }) {
  const [view, setView] = useState<BetView>("intro");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [displayDice, setDisplayDice] = useState(1);
  const [question, setQuestion] = useState<
    { q: string; options: string[]; answer: number } | null
  >(null);
  const [selected, setSelected] = useState<number | null>(null);
  const usedRef = useRef<Set<string>>(new Set());

  const rollDice = () => {
    setView("rolling");
    setSelected(null);
    let ticks = 0;
    const interval = setInterval(() => {
      setDisplayDice(1 + Math.floor(Math.random() * 6));
      ticks++;
      if (ticks > 10) {
        clearInterval(interval);
        const final = 1 + Math.floor(Math.random() * 6);
        setDisplayDice(final);
        setDiceValue(final);
        const { question: q, key } = pickQuestion(final, usedRef.current);
        usedRef.current.add(key);
        setQuestion(q);
        setTimeout(() => setView("question"), 500);
      }
    }, 80);
  };

  const handleAnswer = (i: number) => {
    if (selected !== null || !question) return;
    setSelected(i);
    const correct = i === question.answer;
    setScore((s) => (correct ? s + diceValue * 10 : s - diceValue * 5));
    setView("answered");
  };

  const handleNextRound = () => {
    if (round >= BET_ROUNDS) {
      setView("summary");
    } else {
      setRound((r) => r + 1);
      setQuestion(null);
      rollDice();
    }
  };

  const diff = difficultyLabel(diceValue);
  const DiceIcon = DICE_ICONS[displayDice - 1];

  const verdict =
    score >= 150
      ? "High roller. You bet big on the hard questions and it paid off."
      : score >= 60
      ? "Solid run — you played it smart."
      : score >= 0
      ? "You broke even. The house always has an edge."
      : "Rough night at the tables. The dice weren't on your side.";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{ background: "#0B0B0F" }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center px-8 py-16">
        <button
          onClick={() => onClose(score)}
          className="fixed top-6 right-6 font-mono text-[12px] uppercase tracking-widest flex items-center gap-2"
          style={{ color: "#8A8A92" }}
        >
          <X size={14} />
          Exit bet
        </button>

        <div className="w-full max-w-md text-center">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3"
            style={{ color: "#8A8A92" }}
          >
            Place your bet — round {Math.min(round, BET_ROUNDS)} / {BET_ROUNDS}
          </p>
          <p
            className="font-mono text-[13px] uppercase tracking-widest mb-10"
            style={{ color: BET_GOLD }}
          >
            Score: {score}
          </p>

          <AnimatePresence mode="wait">
            {view === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2
                  className="font-display text-[clamp(28px,5vw,44px)] leading-[1.05] uppercase mb-6"
                  style={{ color: "#EDEAE3" }}
                >
                  Roll the dice
                </h2>
                <p
                  className="text-base mb-10"
                  style={{ color: "#8A8A92", fontFamily: "Inter, sans-serif" }}
                >
                  Higher roll, harder question, bigger payout. Wrong answers cost you too.
                </p>
                <button
                  onClick={rollDice}
                  className="font-mono text-[13px] uppercase tracking-widest rounded-full px-8 py-3"
                  style={{ border: `1.5px solid ${BET_GOLD}`, color: BET_GOLD }}
                >
                  Roll the dice
                </button>
              </motion.div>
            )}

            {view === "rolling" && (
              <motion.div
                key="rolling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                >
                  <DiceIcon size={72} color={BET_GOLD} />
                </motion.div>
              </motion.div>
            )}

            {(view === "question" || view === "answered") && question && (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <DiceIcon size={28} color={diff.color} />
                  <span
                    className="font-mono text-[12px] uppercase tracking-widest"
                    style={{ color: diff.color }}
                  >
                    {diff.label} · worth {diceValue * 10}
                  </span>
                </div>

                <h3
                  className="text-xl mb-8"
                  style={{ color: "#EDEAE3", fontFamily: "Inter, sans-serif" }}
                >
                  {question.q}
                </h3>

                <div className="flex flex-col gap-3 mb-8">
                  {question.options.map((opt, i) => {
                    const isPicked = selected === i;
                    const isAnswer = selected !== null && i === question.answer;
                    const isWrongPick = isPicked && i !== question.answer;
                    const dimmed = selected !== null && !isAnswer && !isWrongPick;

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selected !== null}
                        className="font-mono text-[13px] uppercase tracking-wide rounded-xl px-5 py-3 text-left transition-all duration-300 flex items-center justify-between"
                        style={{
                          border: `1.5px solid ${
                            isAnswer ? "#3E8E7E" : isWrongPick ? "#C1432E" : "#2A2A33"
                          }`,
                          background: isAnswer ? "#3E8E7E" : "transparent",
                          color: isAnswer ? "#0B0B0F" : isWrongPick ? "#C1432E" : "#EDEAE3",
                          opacity: dimmed ? 0.35 : 1,
                          cursor: selected !== null ? "default" : "pointer",
                        }}
                      >
                        {opt}
                        {isAnswer && <Check size={14} />}
                        {isWrongPick && <X size={14} />}
                      </button>
                    );
                  })}
                </div>

                {view === "answered" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p
                      className="font-mono text-[13px] uppercase tracking-widest mb-6"
                      style={{
                        color: selected === question.answer ? "#3E8E7E" : "#C1432E",
                      }}
                    >
                      {selected === question.answer
                        ? `+${diceValue * 10} points`
                        : `−${diceValue * 5} points`}
                    </p>
                    <button
                      onClick={handleNextRound}
                      className="flex items-center gap-2 font-mono text-[13px] uppercase tracking-widest mx-auto"
                      style={{ color: "#EDEAE3" }}
                    >
                      {round >= BET_ROUNDS ? "See final score" : "Roll again"}
                      <ChevronRight size={14} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {view === "summary" && (
              <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2
                  className="font-display text-[clamp(28px,5vw,44px)] leading-[1.05] uppercase mb-6"
                  style={{ color: BET_GOLD }}
                >
                  {score} pts
                </h2>
                <p
                  className="text-base mb-10 max-w-sm mx-auto"
                  style={{ color: "#8A8A92", fontFamily: "Inter, sans-serif" }}
                >
                  {verdict}
                </p>
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => onClose(score)}
                    className="font-mono text-[13px] uppercase tracking-widest rounded-full px-8 py-3"
                    style={{ border: `1.5px solid ${BET_GOLD}`, color: BET_GOLD }}
                  >
                    Back to presentation
                  </button>
                  <button
                    onClick={() => {
                      setRound(1);
                      setScore(0);
                      setQuestion(null);
                      usedRef.current = new Set();
                      setView("intro");
                    }}
                    className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest"
                    style={{ color: "#8A8A92" }}
                  >
                    <RotateCcw size={13} />
                    Play again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function SlideRecapBet() {
  const [showBet, setShowBet] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  return (
    <section
      className="min-h-screen flex flex-col justify-center px-8 md:px-16 py-16"
      style={{ borderTop: "1px solid #2A2A33" }}
    >
      <motion.div
        className="max-w-3xl w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3"
          style={{ color: "#8A8A92" }}
        >
          Recap
        </p>
        <h2
          className="font-display text-[clamp(32px,5.5vw,56px)] leading-[1.05] uppercase mb-6"
          style={{ letterSpacing: "-0.01em", color: "#EDEAE3" }}
        >
          Place your bet
        </h2>
        <p
          className="text-lg mb-10 max-w-md"
          style={{ color: "#8A8A92", fontFamily: "Inter, sans-serif" }}
        >
          One last round before the takeaway. Roll the dice — the higher the
          number, the harder the question and the bigger the payout.
        </p>

        <button
          onClick={() => setShowBet(true)}
          className="flex items-center gap-3 font-mono text-[14px] uppercase tracking-widest rounded-full px-8 py-4"
          style={{ border: `1.5px solid ${BET_GOLD}`, color: BET_GOLD }}
        >
          <Dice6 size={18} />
          Enter the bet
        </button>

        {lastScore !== null && (
          <p
            className="font-mono text-[12px] uppercase tracking-widest mt-6"
            style={{ color: "#8A8A92" }}
          >
            Last run: {lastScore} pts
          </p>
        )}
      </motion.div>

      <AnimatePresence>
        {showBet && (
          <BetQuizOverlay
            onClose={(finalScore) => {
              setLastScore(finalScore);
              setShowBet(false);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function SlideConclusion() {
  return (
    <section
      className="min-h-screen flex flex-col justify-center px-8 md:px-16 py-16"
      style={{ borderTop: "1px solid #2A2A33" }}
    >
      <motion.div
        className="max-w-3xl w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.2em] mb-10"
          style={{ color: "#8A8A92" }}
        >
          Conclusion
        </p>

        {/* All three arc bars together */}
        <div className="flex flex-col gap-6 mb-12">
          {CHARACTERS.map((c) => (
            <div key={c.id}>
              <p
                className="font-mono text-[11px] uppercase tracking-widest mb-3"
                style={{ color: "#8A8A92" }}
              >
                {c.name}
              </p>
              <ArcBar
                fromLabel={c.fromLabel}
                toLabel={c.toLabel}
                startColor={c.startColor}
                endColor={c.endColor}
                progress={c.progress}
                animate
              />
            </div>
          ))}
        </div>

        <div
          className="w-full h-px mb-10"
          style={{ background: "#2A2A33" }}
        />

        <h2
          className="font-display text-[clamp(36px,6vw,64px)] leading-[0.92] uppercase mb-4"
          style={{ letterSpacing: "-0.02em", color: "#EDEAE3" }}
        >
          What makes them
          <br />
          unforgettable
        </h2>
        <p
          className="text-lg mb-2"
          style={{ color: "#8A8A92", fontFamily: "Inter, sans-serif" }}
        >
          isn't the villainy.{" "}
          <span style={{ color: "#EDEAE3" }}>It's the arc.</span>
        </p>
        <p
          className="text-base leading-relaxed max-w-md mt-6"
          style={{ color: "#8A8A92", fontFamily: "Inter, sans-serif" }}
        >
          Their complex stories and personal growth make them unforgettable
          to audiences around the world.
        </p>

        <p
          className="font-mono text-[11px] uppercase tracking-[0.2em] mt-16"
          style={{ color: "#2A2A33" }}
        >
          Thank you.
        </p>
      </motion.div>
    </section>
  );
}

// ─── scroll indicator ─────────────────────────────────────────────────────────

function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY < 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "#8A8A92" }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          >
            <ChevronDown size={14} color="#8A8A92" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── nav dots ─────────────────────────────────────────────────────────────────

const SLIDE_COUNT = 7;

function NavDots({ active }: { active: number }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
      {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
        <button
          key={i}
          onClick={() => {
            const sections = document.querySelectorAll("section");
            sections[i]?.scrollIntoView({ behavior: "smooth" });
          }}
          className="transition-all duration-300 rounded-full"
          style={{
            width: active === i ? 6 : 4,
            height: active === i ? 6 : 4,
            background: active === i ? "#EDEAE3" : "#2A2A33",
          }}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ─── app ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const activeSlideRef = useRef(0);
  activeSlideRef.current = activeSlide;

  // track active slide via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(sections).indexOf(
              entry.target as HTMLElement
            );
            if (idx !== -1) setActiveSlide(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // keyboard navigation: arrows move one section at a time, on top of scroll
  useEffect(() => {
    const goTo = (idx: number) => {
      const sections = document.querySelectorAll("section");
      const clamped = Math.max(0, Math.min(idx, sections.length - 1));
      sections[clamped]?.scrollIntoView({ behavior: "smooth" });
    };

    const onKey = (e: KeyboardEvent) => {
      // don't hijack arrows while the video modal is open or focus is on an input
      if (videoUrl) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goTo(activeSlideRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goTo(activeSlideRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(document.querySelectorAll("section").length - 1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [videoUrl]);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "#0B0B0F",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* global font styles */}
      <style>{`
        .font-display { font-family: 'Anton', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      <NavDots active={activeSlide} />
      <ScrollHint />

      <SlideCover />
      <SlideArgument />
      {CHARACTERS.map((char) => (
        <SlideCharacter
          key={char.id}
          character={char}
          onWatch={() => setVideoUrl(char.videoUrl)}
        />
      ))}
      <SlideRecapBet />
      <SlideConclusion />

      <AnimatePresence>
        {videoUrl && (
          <VideoModal url={videoUrl} onClose={() => setVideoUrl(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}