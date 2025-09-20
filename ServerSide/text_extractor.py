import os
import fitz  # PyMuPDF
import pytesseract
import cv2
import numpy as np
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import time

def process_page(page):
    """
    Process a single PDF page to extract text while excluding tables
    """
    try:
        # Step 1: Convert PDF page to image
        pix = page.get_pixmap(dpi=150)  # use lower DPI for speed
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        image = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

        # Step 2: Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Step 3: Detect rectangular box contours
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        edged = cv2.Canny(blur, 30, 50)
        contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Step 4: Create mask and remove boxed areas
        mask = np.ones(gray.shape, dtype="uint8") * 255
        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)
            if w > 50 and h > 30:  # ignore small artifacts
                cv2.rectangle(mask, (x, y), (x + w, y + h), 0, -1)

        # Step 5: Mask out boxes and apply OCR
        unboxed_area = cv2.bitwise_and(gray, gray, mask=mask)
        config = r'--oem 3 --psm 11'  # fast sparse text config
        text = pytesseract.image_to_string(unboxed_area, config=config)

        return text
    except Exception as e:
        print(f"Error processing page: {e}")
        return ""

def extract_text_fast(pdf_path):
    """
    Extract text from PDF while excluding tables and boxed content
    """
    try:
        doc = fitz.open(pdf_path)
        max_threads = min(os.cpu_count() or 4, 4)  # Limit threads for stability
        
        with ThreadPoolExecutor(max_workers=max_threads) as executor:
            results = executor.map(process_page, [doc[i] for i in range(len(doc))])
        
        doc.close()
        return "\n".join(results)
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
        return ""

def extract_text_with_pages(pdf_path):
    """
    Extract text from PDF with page information
    """
    try:
        doc = fitz.open(pdf_path)
        page_texts = {}
        
        for i in range(len(doc)):
            page = doc[i]
            text = process_page(page)
            page_texts[i + 1] = text  # Page numbers start from 1
        
        doc.close()
        return page_texts
    except Exception as e:
        print(f"Error extracting text with pages from {pdf_path}: {e}")
        return {}

def normalize_text(text):
    """Normalize text for comparison - from original version"""
    import re
    # Convert to lowercase
    text = text.lower()
    # Replace multiple spaces/newlines/tabs with a single space
    text = re.sub(r'\s+', ' ', text)
    # Optional: remove punctuation (you can skip this if formatting matters)
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()
