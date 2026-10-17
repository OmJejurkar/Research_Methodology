# MCQ Practice Hub – Research Methodology

A **production-ready MCQ practice website** for the NPTEL Research Methodology course (SWAYAM). Contains all **120 questions across 12 weeks**, built with React + Vite + Tailwind CSS.

## 🚀 Getting Started

```bash
# Navigate to project folder
cd mcq-practice

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## ✨ Features

| Feature | Description |
|---|---|
| 📅 Week-wise Practice | 12 individual week quizzes, 10 questions each |
| ⚡ Full Test Mode | 10 / 25 / 50 / 120 questions, configurable |
| 🔀 Shuffle | Randomize question order for full test |
| ⏱️ Timer | Optional countdown timer with pause/resume |
| ✅ Instant Results | Score breakdown after every quiz |
| 🔍 Review Mode | Filter correct / wrong / skipped answers |
| 💡 Explanations | Expandable explanations for each answer |
| 📊 Dashboard | Track best scores, history, and progress per week |
| 🌙 Dark Mode | Toggle between light and dark themes |
| 💾 Persistence | All progress saved in localStorage |

## 📚 Question Types

- **MCQ**: Single correct answer
- **MSQ**: Multiple correct answers (select ALL correct options)
- **TF**: True / False

## 🗂️ Pages

| Route | Page |
|---|---|
| `/` | Home – course overview & week cards |
| `/week/:weekNumber` | Week practice (W1–W12) |
| `/full-test` | Full practice test (configurable) |
| `/review` | Post-quiz answer review |
| `/dashboard` | Progress analytics |
| `/about` | About & data source info |

## 🛠️ Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS v4**
- **React Router v6**
- **Zustand** (state + localStorage persistence)
- **Lucide React** (icons)
- **Inter** (Google Font)

## 📋 Data

All 120 questions are in [`src/data/questions.json`](src/data/questions.json). Questions were extracted directly from the 12 NPTEL assignment PDFs — no fabrication. See [`EXTRACTION_REPORT.md`](EXTRACTION_REPORT.md) for full details.
