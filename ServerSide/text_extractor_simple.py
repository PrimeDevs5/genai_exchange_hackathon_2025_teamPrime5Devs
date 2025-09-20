"""
Simplified text extractor that works without OpenCV for cloud deployment
Falls back to basic PyMuPDF text extraction
"""
import os
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import time

def process_page_simple(page):
    """
    Process a single PDF page to extract text using simple PyMuPDF extraction
    """
    try:
        # Direct text extraction from PDF
        text = page.get_text()
        
        # If direct extraction fails or gives little text, try OCR
        if len(text.strip()) < 50:
            try:
                # Convert PDF page to image for OCR
                pix = page.get_pixmap(dpi=150)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                
                # Use OCR as fallback
                ocr_text = pytesseract.image_to_string(img, lang='eng')
                if len(ocr_text.strip()) > len(text.strip()):
                    text = ocr_text
            except Exception as ocr_error:
                print(f"OCR fallback failed: {ocr_error}")
                # Continue with direct extracted text
        
        return text
    except Exception as e:
        print(f"Error processing page: {e}")
        return ""

def extract_text_fast_simple(pdf_path):
    """
    Simple fast text extraction from PDF without OpenCV
    """
    try:
        doc = fitz.open(pdf_path)
        texts = []
        
        # Use threading for faster processing
        with ThreadPoolExecutor(max_workers=4) as executor:
            futures = [executor.submit(process_page_simple, doc[i]) for i in range(len(doc))]
            texts = [future.result() for future in futures]
        
        doc.close()
        return '\n'.join(texts)
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
        return ""

def extract_text_with_pages_simple(pdf_path):
    """
    Simple text extraction with page numbers without OpenCV
    """
    try:
        doc = fitz.open(pdf_path)
        pages_text = {}
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = process_page_simple(page)
            pages_text[page_num + 1] = text
        
        doc.close()
        return pages_text
    except Exception as e:
        print(f"Error extracting text with pages from {pdf_path}: {e}")
        return {}

# Main extraction functions with fallback
def extract_text_fast(pdf_path):
    """
    Main text extraction function with OpenCV fallback
    """
    try:
        # Try to import the full version with OpenCV
        from text_extractor import extract_text_fast as extract_cv2
        return extract_cv2(pdf_path)
    except ImportError:
        # Fall back to simple version without OpenCV
        return extract_text_fast_simple(pdf_path)

def extract_text_with_pages(pdf_path):
    """
    Main text extraction with pages function with OpenCV fallback
    """
    try:
        # Try to import the full version with OpenCV
        from text_extractor import extract_text_with_pages as extract_cv2_pages
        return extract_cv2_pages(pdf_path)
    except ImportError:
        # Fall back to simple version without OpenCV
        return extract_text_with_pages_simple(pdf_path)
