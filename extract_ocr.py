#!/usr/bin/env python3
"""
Extract images from PDFs and run OCR to get MCQ text.
"""
import pymupdf  # PyMuPDF
import os
from pathlib import Path
from PIL import Image
import io

PDF_DIR = Path(r"d:\B_Tech\7th Sem\NPTEL")
OUTPUT_DIR = PDF_DIR / "pdf_images"
OUTPUT_DIR.mkdir(exist_ok=True)

PDF_FILES = sorted([
    f for f in PDF_DIR.iterdir()
    if f.name.startswith("screencapture") and f.suffix == ".pdf"
])

print(f"Found {len(PDF_FILES)} PDF files")

# Extract pages as high-res images
for week_num, pdf_path in enumerate(PDF_FILES, 1):
    print(f"\nWeek {week_num}: {pdf_path.name}")
    doc = pymupdf.open(str(pdf_path))
    print(f"  Pages: {len(doc)}")
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        # Render at 2x zoom for better OCR quality
        mat = pymupdf.Matrix(2.0, 2.0)
        pix = page.get_pixmap(matrix=mat)
        
        out_path = OUTPUT_DIR / f"week{week_num:02d}_page{page_num+1:02d}.png"
        pix.save(str(out_path))
        print(f"  Saved: {out_path.name} ({pix.width}x{pix.height})")
    
    doc.close()

print(f"\nAll images saved to: {OUTPUT_DIR}")
print("Total images:", len(list(OUTPUT_DIR.glob("*.png"))))
