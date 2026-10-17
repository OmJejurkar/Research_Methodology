#!/usr/bin/env python3
"""
Extract MCQ questions from NPTEL quiz PDFs and generate questions.json
"""
import fitz  # PyMuPDF
import json
import os
import re
from pathlib import Path

PDF_DIR = Path(r"d:\B_Tech\7th Sem\NPTEL")
OUTPUT_JSON = PDF_DIR / "questions_raw.json"
OUTPUT_TEXT = PDF_DIR / "extracted_text.txt"

# Map PDF files to week numbers based on timestamp order
PDF_FILES = sorted([
    f for f in PDF_DIR.iterdir()
    if f.name.startswith("screencapture") and f.suffix == ".pdf"
])

print(f"Found {len(PDF_FILES)} PDF files:")
for i, f in enumerate(PDF_FILES, 1):
    print(f"  Week {i}: {f.name}")

def extract_text_from_pdf(pdf_path):
    """Extract all text from a PDF file."""
    doc = fitz.open(str(pdf_path))
    full_text = ""
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        full_text += f"\n--- PAGE {page_num + 1} ---\n" + text
    doc.close()
    return full_text

# Extract text from all PDFs
all_texts = {}
with open(OUTPUT_TEXT, "w", encoding="utf-8") as f_out:
    for week_num, pdf_path in enumerate(PDF_FILES, 1):
        print(f"\nExtracting Week {week_num}: {pdf_path.name}")
        text = extract_text_from_pdf(pdf_path)
        all_texts[week_num] = text
        f_out.write(f"\n{'='*80}\n")
        f_out.write(f"WEEK {week_num}: {pdf_path.name}\n")
        f_out.write(f"{'='*80}\n")
        f_out.write(text)
        f_out.write("\n")

print(f"\nAll text extracted to: {OUTPUT_TEXT}")
print("Now review extracted_text.txt and use it to build questions.json")
