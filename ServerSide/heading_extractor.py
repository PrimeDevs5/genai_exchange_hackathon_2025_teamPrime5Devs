import fitz
import os
import json
import re
import numpy as np
from typing import List, Dict, Tuple, Any
from keywords_config import text_contains_exclusion_keywords

class HeadingExtractor:
    """Proven heading extraction based on original Adobe_India_Hackathon_25_Team_DSA_Challenge_1a code."""
    
    def __init__(self):
        self.min_font_size = 10.0
        self.max_font_size = 50.0
        self.min_text_length = 3
        self.max_text_length = 200
    
    def extract_headings_from_pdf(self, pdf_path: str) -> List[Dict[str, Any]]:
        """Extract all potential headings from PDF using original proven logic."""
        all_headings = []
        
        try:
            doc = fitz.open(pdf_path)
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                page_headings = self._extract_page_headings(page, page_num)
                all_headings.extend(page_headings)
            doc.close()
        except Exception as e:
            print(f"Error extracting headings from {pdf_path}: {e}")
            return []
        
        # Filter and assign heading levels
        filtered_headings = self._filter_heading_candidates(all_headings)
        leveled_headings = self._assign_heading_levels(filtered_headings)
        
        return leveled_headings
    
    def _extract_page_headings(self, page, page_num: int) -> List[Dict[str, Any]]:
        """Extract heading candidates from a single page."""
        headings = []
        
        try:
            # Get text blocks with font information
            blocks = page.get_text("dict")
            
            for block in blocks.get("blocks", []):
                if "lines" in block:
                    for line in block["lines"]:
                        for span in line.get("spans", []):
                            text = span.get("text", "").strip()
                            font_size = span.get("size", 0)
                            font_flags = span.get("flags", 0)
                            font_name = span.get("font", "")
                            bbox = span.get("bbox", [0, 0, 0, 0])
                            
                            if self._is_heading_candidate(text, font_size, font_flags):
                                headings.append({
                                    'text': text,
                                    'page': page_num + 1,
                                    'font_size': font_size,
                                    'font_flags': font_flags,
                                    'font_name': font_name,
                                    'bbox': bbox,
                                    'is_bold': bool(font_flags & 2**4),  # Bold flag
                                    'is_italic': bool(font_flags & 2**1),  # Italic flag
                                    'position_y': bbox[1] if bbox else 0
                                })
        except Exception as e:
            print(f"Error extracting headings from page {page_num}: {e}")
        
        return headings
    
    def _is_heading_candidate(self, text: str, font_size: float, font_flags: int) -> bool:
        """Check if text could be a heading based on original logic."""
        if not text or len(text.strip()) < self.min_text_length:
            return False
        
        if len(text) > self.max_text_length:
            return False
        
        if font_size < self.min_font_size or font_size > self.max_font_size:
            return False
        
        # Skip text that contains exclusion keywords
        if text_contains_exclusion_keywords(text):
            return False
        
        # Skip pure numbers or dates
        if re.match(r'^[\d\s\-/.,]+$', text):
            return False
        
        # Skip text with too many special characters
        special_char_ratio = len(re.findall(r'[^\w\s]', text)) / len(text)
        if special_char_ratio > 0.3:
            return False
        
        return True
    
    def _filter_heading_candidates(self, headings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Filter heading candidates using original logic."""
        if not headings:
            return []
        
        # Remove duplicates while preserving order
        seen_texts = set()
        unique_headings = []
        
        for heading in headings:
            text_key = heading['text'].lower().strip()
            if text_key not in seen_texts:
                seen_texts.add(text_key)
                unique_headings.append(heading)
        
        # Calculate font size statistics for filtering
        font_sizes = [h['font_size'] for h in unique_headings]
        if not font_sizes:
            return []
        
        mean_font_size = np.mean(font_sizes)
        std_font_size = np.std(font_sizes)
        
        # Filter by font size (keep larger fonts - potential headings)
        min_heading_size = mean_font_size + (0.5 * std_font_size)
        
        filtered_headings = []
        for heading in unique_headings:
            # Keep if font size is above threshold OR if it's bold
            if heading['font_size'] >= min_heading_size or heading['is_bold']:
                # Additional quality checks
                text = heading['text'].strip()
                
                # Skip if too short after cleaning
                if len(text) < 3:
                    continue
                
                # Skip if all lowercase (likely body text)
                if text.islower() and not heading['is_bold']:
                    continue
                
                # Skip if contains too many lowercase words (likely sentences)
                words = text.split()
                if len(words) > 2:
                    lowercase_words = sum(1 for word in words if word.islower())
                    if lowercase_words / len(words) > 0.6 and not heading['is_bold']:
                        continue
                
                filtered_headings.append(heading)
        
        return filtered_headings
    
    def _assign_heading_levels(self, headings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Assign heading levels based on font size and formatting."""
        if not headings:
            return []
        
        # Sort by font size descending to assign levels
        sorted_headings = sorted(headings, key=lambda x: (-x['font_size'], x['page'], x['position_y']))
        
        # Calculate level thresholds
        font_sizes = [h['font_size'] for h in sorted_headings]
        unique_sizes = sorted(list(set(font_sizes)), reverse=True)
        
        # Assign levels based on font size tiers
        for heading in sorted_headings:
            font_size = heading['font_size']
            
            # Find size tier
            level = 1
            for i, size_threshold in enumerate(unique_sizes):
                if font_size >= size_threshold:
                    level = min(i + 1, 6)  # Max level 6
                    break
            
            # Adjust based on formatting
            if heading['is_bold']:
                level = max(1, level - 1)  # Bold gets higher priority
            
            heading['level'] = level
        
        # Sort back to document order
        final_headings = sorted(sorted_headings, key=lambda x: (x['page'], x['position_y']))
        
        return final_headings
    
    def get_heading_text_content(self, pdf_path: str, heading: Dict[str, Any], max_chars: int = 1000) -> str:
        """Extract text content that follows a heading."""
        try:
            doc = fitz.open(pdf_path)
            page = doc.load_page(heading['page'] - 1)
            
            # Get all text from the page
            page_text = page.get_text()
            lines = page_text.split('\n')
            
            # Find the heading line
            heading_text = heading['text'].strip()
            heading_line_idx = -1
            
            for i, line in enumerate(lines):
                if heading_text.lower() in line.lower().strip():
                    heading_line_idx = i
                    break
            
            if heading_line_idx == -1:
                doc.close()
                return ""
            
            # Extract text after the heading
            content_lines = []
            char_count = 0
            
            for i in range(heading_line_idx + 1, len(lines)):
                line = lines[i].strip()
                if not line:
                    continue
                
                # Stop if we hit another potential heading
                if self._looks_like_heading(line):
                    break
                
                # Add line if we haven't exceeded character limit
                if char_count + len(line) <= max_chars:
                    content_lines.append(line)
                    char_count += len(line) + 1
                else:
                    break
            
            doc.close()
            return ' '.join(content_lines)
            
        except Exception as e:
            print(f"Error extracting content for heading '{heading['text']}': {e}")
            return ""
    
    def _looks_like_heading(self, text: str) -> bool:
        """Quick check if text looks like a heading."""
        if not text or len(text) < 3:
            return False
        
        # Check if it's title case or has fewer than 8 words
        words = text.split()
        if len(words) <= 8:
            # Check if most words are capitalized
            capitalized = sum(1 for word in words if word and word[0].isupper())
            if capitalized / len(words) >= 0.6:
                return True
        
        return False
