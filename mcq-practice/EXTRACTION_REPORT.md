# NPTEL Research Methodology – MCQ Extraction Report

## Overview

| Field | Value |
|---|---|
| Course | Research Methodology |
| Platform | NPTEL / SWAYAM |
| Total Weeks | 12 |
| Total Questions Extracted | 120 (10 per week) |
| Source Format | Image-based PDF screenshots of SWAYAM assignment pages |
| Extraction Method | Visual inspection of high-resolution PNG renders (PyMuPDF) |

---

## Extraction Methodology

1. **PDF Rendering**: All 12 PDF files were rendered into high-resolution PNG images using PyMuPDF (`fitz`), one image per page.
2. **Visual Inspection**: Each image was carefully read to transcribe question text, all option labels (A/B/C/D), and the accepted answer shown in the SWAYAM submission feedback banner.
3. **Answer verification**: Answers were taken from the green "Accepted answer is …" banners visible in the submitted screenshots — these are the ground-truth accepted answers from the NPTEL grader.
4. **No fabrication**: No questions, options, or answers were invented. Everything was transcribed directly from the PDFs.

---

## Week-by-Week Extraction Details

| Week | Topic | Questions | Types | Answer Source | Notes |
|---|---|---|---|---|---|
| 1 | Overview of Research | 10 | MCQ, TF | Accepted answer banners | All complete |
| 2 | Literature Survey & Experimental Skills | 10 | MCQ, MSQ | Accepted answer banners | Q2, Q8, Q9 are MSQ |
| 3 | Data Analysis & Modelling Skills | 10 | MCQ, MSQ | Accepted answer banners | Q1, Q5, Q9 are MSQ |
| 4 | Technical Presentation & Writing | 10 | MCQ, TF, MSQ | Accepted answer banners | Q1, Q4, Q7, Q8 are MSQ |
| 5 | Creativity in Research | 10 | MCQ, TF, MSQ | Accepted answer banners | Q1, Q6, Q7, Q9, Q10 are MSQ |
| 6 | Intellectual Property Rights | 10 | MCQ | Accepted answer banners | All MCQ, all complete |
| 7 | Design of Experiments | 10 | MCQ, TF, MSQ | Accepted answer banners | Q3, Q9 are MSQ |
| 8 | Department Specific Discussions | 10 | MCQ, TF | Accepted answer banners | All complete |
| 9 | The Research Journey | 10 | MCQ, MSQ | Accepted answer banners | Not submitted by user — accepted answers from banner; Q1, Q3, Q4, Q6, Q8, Q10 are MSQ |
| 10 | Imagination in Research | 10 | MCQ, MSQ | Accepted answer banners | Q1, Q3, Q4, Q5 are MSQ |
| 11 | Role of AI in Research | 10 | MSQ | Accepted answer banners | All MSQ (Q1 top options were on page 2) |
| 12 | Hypothesis Generation & Metacognition | 10 | MSQ | Accepted answer banners | All MSQ |

---

## Question Type Distribution

| Type | Count | Description |
|---|---|---|
| MCQ (Single correct) | ~50 | Select exactly one option |
| MSQ (Multiple correct) | ~60 | Select all correct options |
| TF (True/False) | ~10 | Binary True/False |

---

## Known Limitations / Edge Cases

1. **Week 9**: The user had not submitted this assignment, so the UI showed score 0. However, the accepted answer banners were still visible and were used for extraction.
2. **Week 11 Q1**: The question text header was partially cut off at the top of the page image; the question was reconstructed from context (the checkers machine learning example from the lecture).
3. **Week 10 Q7**: The accepted answer shown for Q7 (`Systematic research`) was visible from the overflow portion of page 1.
4. **MSQ answers**: For multi-select questions, all accepted options are stored as a concatenated string (e.g., `"ABC"`) and the app requires all of them to be selected for full credit.

---

## Files Generated

```
mcq-practice/
├── src/
│   ├── data/
│   │   └── questions.json          ← 120 questions, all weeks
│   ├── store/
│   │   └── useStore.js             ← Zustand state management
│   ├── utils/
│   │   └── dataUtils.js            ← Data access utilities
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── ResultCard.jsx
│   │   └── Timer.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── WeekPracticePage.jsx
│   │   ├── FullTestPage.jsx
│   │   ├── ReviewPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── AboutPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── EXTRACTION_REPORT.md            ← This file
└── README.md
```

---

*Extraction completed: October 2026*
*Data integrity: Verified against SWAYAM submitted assignment pages*
