Villain Arc

An interactive, scroll-based presentation about villains who are more developed than the protagonists they stand against — Eren Yeager (Attack on Titan), Meruem (Hunter × Hunter), and Darth Vader (Star Wars).

Built with React, TypeScript, Tailwind CSS, and Motion (Framer Motion).

Run locally

bashnpm install
npm run dev

Then open the local URL printed in the terminal (usually http://localhost:5173).

Navigation


Scroll through the page normally, or
Keyboard: ↓ / → / Page Down to advance one section, ↑ / ← / Page Up to go back, Home / End to jump to the first/last section
Click the dots on the right edge of the screen to jump to any slide


Slides


Cover — title and thesis statement
The Argument — why some villains outshine their heroes
Eren Yeager / Meruem / Darth Vader — one slide each, with:

An Arc Bar: a duotone gradient bar showing the character's transformation (e.g. HERO → TITAN)
A portrait image, quote, and short description
A "Watch arc" button that opens a YouTube video in a modal (supports regular videos, youtu.be links, and YouTube Shorts — Shorts automatically display in a vertical player)



Place your bet — a recap mini-game: roll a die, the number decides the question's difficulty (1–2 easy, 3–4 medium, 5–6 hard) and how many points are on the line (dice × 10 if correct, dice × 5 lost if wrong). Five rounds, then a final score and verdict.
Conclusion — all three Arc Bars side by side, plus the closing message


Customizing content

All character data lives in the CHARACTERS array near the top of src/app/App.tsx:

ts{
  id: "eren",
  name: "EREN YEAGER",
  series: "Attack on Titan",
  fromLabel: "HERO",
  toLabel: "TITAN",
  startColor: "#3E8E7E",
  endColor: "#C1432E",
  progress: 78,        // marker position on the Arc Bar, 0–100
  quote: "...",
  description: "...",
  imageUrl: "...",     // portrait image
  videoUrl: "...",     // YouTube link (watch, youtu.be, or shorts — any format works)
}

The trivia questions for the dice game live in QUESTION_BANK, grouped by dice value (1–6).

Project structure

src/
  app/
    App.tsx        — everything: slides, Arc Bar, video modal, bet game
  styles/
    fonts.css       — Google Fonts import (Anton, Inter, JetBrains Mono)
    theme.css       — color tokens
  main.tsx          — entry point

Credits

This project includes components from shadcn/ui used under the MIT license.

This project includes a photo from Unsplash used under the Unsplash license.