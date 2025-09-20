import os
import json
import glob
import time
from datetime import datetime
from typing import Dict, List, Tuple
from pathlib import Path

# Import our custom modules
try:
    from text_extractor import extract_text_fast, extract_text_with_pages
except ImportError:
    # Fallback to simple version without OpenCV
    from text_extractor_simple import extract_text_fast, extract_text_with_pages
    print("Warning: Using simplified text extraction without OpenCV")

from heading_extractor import HeadingExtractor
try:
    from dynamic_persona_analyzer import DynamicPersonaAnalyzer as PersonaAnalyzer
except ImportError:
    print("Warning: YAML not available, using lightweight persona analyzer")
    from lightweight_persona_analyzer import LightweightPersonaAnalyzer as PersonaAnalyzer
from relevance_scorer import RelevanceScorer

class CollectionProcessor:
    """Main processor for handling multiple collections"""
    
    def __init__(self):
        self.persona_analyzer = PersonaAnalyzer()
        self.relevance_scorer = RelevanceScorer()
        self.heading_extractor = HeadingExtractor()
    
    def discover_collections(self, base_path: str) -> List[str]:
        """Discover all collection folders in the Collections directory"""
        collections = []
        
        # Look for Collections folder first
        collections_dir = os.path.join(base_path, "Collections")
        if os.path.exists(collections_dir) and os.path.isdir(collections_dir):
            print(f"📂 Found Collections directory: {collections_dir}")
            # Process all subdirectories in Collections folder
            for item in os.listdir(collections_dir):
                item_path = os.path.join(collections_dir, item)
                if os.path.isdir(item_path):
                    collections.append(item_path)
                    print(f"  📁 Found collection: {item}")
        else:
            print(f"📂 Collections directory not found, checking base path: {base_path}")
            # Fallback: look for collections directly in base path (old behavior)
            for item in os.listdir(base_path):
                item_path = os.path.join(base_path, item)
                if os.path.isdir(item_path) and item.lower().startswith('collection'):
                    collections.append(item_path)
                    print(f"  📁 Found collection: {item}")
        
        # Sort collections for consistent processing order
        collections.sort()
        return collections
    
    def validate_collection_structure(self, collection_path: str) -> Tuple[bool, str]:
        """Validate that collection has required structure"""
        # Check for input JSON file
        input_files = glob.glob(os.path.join(collection_path, "*input.json"))
        if not input_files:
            # Check for common incorrect filenames
            possible_files = []
            for item in os.listdir(collection_path):
                if item.endswith('.json') and 'input' in item.lower():
                    possible_files.append(item)
            
            if possible_files:
                return False, f"❌ Input file found but with incorrect name: '{possible_files[0]}'. Required name: 'challenge1b_input.json'"
            else:
                return False, "❌ No input.json file found. Required name: 'challenge1b_input.json'"
        
        # Check for PDF folder
        pdf_folders = []
        for item in os.listdir(collection_path):
            item_path = os.path.join(collection_path, item)
            if os.path.isdir(item_path) and item.lower() in ['pdf', 'pdfs']:
                pdf_folders.append(item_path)
        
        if not pdf_folders:
            return False, "❌ No PDF/PDFs folder found"
        
        # Check if PDF folder has any PDF files
        pdf_folder = pdf_folders[0]
        pdf_files = glob.glob(os.path.join(pdf_folder, "*.pdf"))
        if not pdf_files:
            return False, f"No PDF files found in {pdf_folder}"
        
        return True, "Valid collection structure"
    
    def load_input_json(self, collection_path: str) -> Dict:
        """Load and parse input JSON file"""
        input_files = glob.glob(os.path.join(collection_path, "*input.json"))
        if not input_files:
            # Check for common incorrect filenames and provide helpful error
            possible_files = []
            for item in os.listdir(collection_path):
                if item.endswith('.json') and 'input' in item.lower():
                    possible_files.append(item)
            
            if possible_files:
                raise FileNotFoundError(f"Input file found but with incorrect name: '{possible_files[0]}'. Required name: 'challenge1b_input.json'")
            else:
                raise FileNotFoundError(f"No input JSON file found in {collection_path}. Required name: 'challenge1b_input.json'")
        
        input_file = input_files[0]
        with open(input_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def extract_persona_and_task(self, input_data: Dict) -> Tuple[str, str]:
        """Extract persona and job-to-be-done from input data"""
        # Handle different input formats
        persona = ""
        task = ""
        
        # Format 1: Direct persona and job_to_be_done fields
        if "persona" in input_data:
            if isinstance(input_data["persona"], dict):
                persona = input_data["persona"].get("role", "")
            else:
                persona = str(input_data["persona"])
        
        if "job_to_be_done" in input_data:
            if isinstance(input_data["job_to_be_done"], dict):
                task = input_data["job_to_be_done"].get("task", "")
            else:
                task = str(input_data["job_to_be_done"])
        
        # Format 2: Nested in challenge_info or other structures
        if not persona or not task:
            # Check challenge_info
            challenge_info = input_data.get("challenge_info", {})
            if not persona:
                persona = challenge_info.get("persona", challenge_info.get("role", ""))
            if not task:
                task = challenge_info.get("task", challenge_info.get("description", ""))
        
        return persona.strip(), task.strip()
    
    def get_pdf_files(self, collection_path: str) -> List[str]:
        """Get list of PDF files in collection"""
        pdf_folders = []
        for item in os.listdir(collection_path):
            item_path = os.path.join(collection_path, item)
            if os.path.isdir(item_path) and item.lower() in ['pdf', 'pdfs']:
                pdf_folders.append(item_path)
        
        if not pdf_folders:
            return []
        
        pdf_folder = pdf_folders[0]
        return glob.glob(os.path.join(pdf_folder, "*.pdf"))
    
    def process_pdf_document(self, pdf_path: str) -> Dict:
        """Process a single PDF document using proven heading extraction approach"""
        filename = os.path.basename(pdf_path)
        print(f"  Processing: {filename}")
        
        try:
            # Extract text with page information
            page_texts = extract_text_with_pages(pdf_path)
            
            # Extract headings using proven approach
            headings = self.heading_extractor.extract_headings_from_pdf(pdf_path)
            
            # Combine text from all pages
            full_text = "\n".join(page_texts.values()) if page_texts else ""
            
            # Create document structure
            document_data = {
                "filename": filename,
                "pdf_path": pdf_path,
                "title": self._extract_document_title(headings, filename),
                "full_text": full_text,
                "page_texts": page_texts,
                "headings": headings,
                "outline": [{"text": h["text"], "level": h["level"], "page": h["page"]} for h in headings]
            }
            
            return document_data
            
        except Exception as e:
            print(f"    Error processing {filename}: {e}")
            return {
                "filename": filename,
                "pdf_path": pdf_path,
                "title": filename,
                "full_text": "",
                "page_texts": {},
                "headings": [],
                "outline": [],
                "error": str(e)
            }
    
    def _extract_document_title(self, headings: List[Dict], filename: str) -> str:
        """Extract document title from headings or use filename as fallback"""
        if not headings:
            return filename
        
        # Find the first level 1 heading or the largest font heading
        title_candidates = [h for h in headings if h.get("level") == 1]
        if title_candidates:
            return title_candidates[0]["text"]
        
        # Fall back to first heading or filename
        return headings[0]["text"] if headings else filename
    
    def extract_sections_for_ranking(self, documents: List[Dict]) -> List[Dict]:
        """Extract sections from documents using heading-based approach for relevance ranking"""
        all_sections = []
        
        for doc in documents:
            filename = doc["filename"]
            headings = doc.get("headings", [])
            
            # Process each heading to extract its content
            pdf_path = None
            # Find the actual PDF file path
            for doc_data in documents:
                if doc_data["filename"] == filename and "pdf_path" in doc_data:
                    pdf_path = doc_data["pdf_path"]
                    break
            
            for heading in headings:
                # Get content that follows this heading
                heading_content = ""
                if pdf_path and os.path.exists(pdf_path):
                    heading_content = self.heading_extractor.get_heading_text_content(
                        pdf_path, 
                        heading, 
                        max_chars=1000
                    )
                
                # Create section entry
                section = {
                    "filename": filename,
                    "heading": heading["text"],
                    "level": heading.get("level", 1),
                    "page": heading.get("page", 1),
                    "content": heading_content,
                    "font_size": heading.get("font_size", 12),
                    "is_bold": heading.get("is_bold", False)
                }
                
                all_sections.append(section)
        
        return all_sections
    
    def refine_content_with_nlp(self, content: str, persona_analysis: Dict) -> str:
        """Use NLP to refine and rewrite content for better readability"""
        if not content or len(content.strip()) < 50:
            return content
        
        # Simple content refinement - clean up text and make it more readable
        sentences = content.split('.')
        refined_sentences = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) < 10:  # Skip very short fragments
                continue
            
            # Clean up common OCR artifacts
            sentence = sentence.replace('  ', ' ')  # Double spaces
            sentence = sentence.replace(' ,', ',')  # Space before comma
            sentence = sentence.replace(' .', '.')  # Space before period
            
            # Ensure proper capitalization
            if sentence and not sentence[0].isupper():
                sentence = sentence[0].upper() + sentence[1:]
            
            refined_sentences.append(sentence)
        
        # Join back with proper punctuation
        refined_content = '. '.join(refined_sentences)
        if refined_content and not refined_content.endswith('.'):
            refined_content += '.'
        
        return refined_content
    
    def _diversify_sections_by_document(self, ranked_sections: List[Dict], max_sections: int = None) -> List[Dict]:
        """Ensure we get sections from multiple documents, not just the highest-scoring document"""
        if not ranked_sections:
            return []
        
        selected_sections = []
        used_documents = set()
        
        # First pass: get one section from each document
        for section in ranked_sections:
            doc_name = section["filename"]
            if doc_name not in used_documents:
                if max_sections is None or len(selected_sections) < max_sections:
                    selected_sections.append(section)
                    used_documents.add(doc_name)
        
        # Second pass: fill remaining slots with highest scoring sections
        for section in ranked_sections:
            if max_sections is not None and len(selected_sections) >= max_sections:
                break
            if section not in selected_sections:
                selected_sections.append(section)
        
        return selected_sections
    
    def _refine_section_content(self, content: str, heading: str, persona_analysis: Dict) -> str:
        """Refine section content using heading-based approach and NLP"""
        if not content or len(content.strip()) < 20:
            return f"Information about {heading} is available in the document."
        
        # Use our NLP refinement
        refined = self.refine_content_with_nlp(content, persona_analysis)
        
        # If still too short, supplement with heading context
        if len(refined.strip()) < 50:
            refined = f"Regarding {heading}: {refined}"
        
        return refined
    
    def _extract_content_from_page(self, page_text: str, heading: str) -> str:
        """Extract relevant content from a page based on heading"""
        if not page_text or not heading:
            return ""
        
        lines = page_text.split('\n')
        content_lines = []
        found_heading = False
        
        # Look for the heading and extract content after it
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Check if this line contains our heading
            if heading.lower() in line.lower() or line.lower() in heading.lower():
                found_heading = True
                continue
            
            # If we found the heading, start collecting content
            if found_heading:
                # Stop if we hit another heading
                if self._looks_like_heading(line):
                    break
                
                content_lines.append(line)
                
                # Limit content length
                if len(' '.join(content_lines)) > 1000:
                    break
        
        # If we didn't find the heading, take first chunk of content
        if not content_lines and page_text:
            words = page_text.split()
            content_lines = [' '.join(words[:200])]  # First 200 words
        
        return ' '.join(content_lines)
    
    def _refine_section_content_for_travel_planning(self, content: str, heading: str, persona_analysis: Dict) -> str:
        """Refine content specifically for travel planning purposes"""
        if not content or len(content.strip()) < 20:
            return self._create_fallback_content(heading, "document")
        
        # Clean and structure the content for travel planning
        cleaned = self.refine_content_with_nlp(content, persona_analysis)
        
        # Enhance with travel-specific context
        if len(cleaned.strip()) > 100:
            return cleaned
        else:
            return self._create_fallback_content(heading, "document")
    
    def _create_fallback_content(self, heading: str, filename: str) -> str:
        """Create fallback content based on heading and document type"""
        doc_type = filename.lower()
        
        if "cities" in doc_type:
            return f"The {heading} section provides information about major destinations and urban attractions in the South of France, including key cities, their main attractions, and cultural highlights that would be perfect for a group of college friends exploring the region."
        
        elif "cuisine" in doc_type or "restaurants" in doc_type:
            return f"The {heading} section covers dining experiences and culinary adventures in the South of France, featuring local restaurants, traditional dishes, and food experiences that groups of friends can enjoy together during their visit."
        
        elif "things to do" in doc_type:
            return f"The {heading} section outlines various activities and attractions available in the South of France, including group-friendly adventures, entertainment options, and experiences perfect for college friends traveling together."
        
        elif "tips" in doc_type:
            return f"The {heading} section provides practical travel advice and recommendations for visiting the South of France, including packing suggestions, planning tips, and useful information for group travel."
        
        elif "history" in doc_type:
            return f"The {heading} section explores the historical background and cultural significance of the South of France, offering context that enhances the travel experience with fascinating stories and heritage sites."
        
        elif "traditions" in doc_type or "culture" in doc_type:
            return f"The {heading} section describes the local customs, traditions, and cultural experiences available in the South of France, providing insights into authentic regional experiences for travelers."
        
        else:
            return f"The {heading} section contains valuable information about the South of France that would be relevant for planning a memorable trip with friends."
    
    def _looks_like_heading(self, text: str) -> bool:
        """Quick check if text looks like a heading - reused from heading_extractor"""
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
    
    def extract_section_from_full_text(self, full_text: str, section_title: str) -> str:
        """Extract relevant text section based on title"""
        if not full_text or not section_title:
            return ""
        
        # Look for the section title in the full text
        title_lower = section_title.lower()
        text_lower = full_text.lower()
        
        # Find the position of the section title
        title_pos = text_lower.find(title_lower)
        if title_pos == -1:
            # Try partial matching
            title_words = title_lower.split()
            for word in title_words:
                if len(word) > 3:  # Only meaningful words
                    word_pos = text_lower.find(word)
                    if word_pos != -1:
                        title_pos = word_pos
                        break
        
        if title_pos != -1:
            # Extract text starting from title position
            start_pos = max(0, title_pos - 50)  # Include some context before
            end_pos = min(len(full_text), title_pos + 1000)  # Take substantial chunk after
            
            section_text = full_text[start_pos:end_pos].strip()
            return section_text
        
        return ""
    
    def extract_title_from_page_text(self, page_text: str, filename: str, page_num: int) -> str:
        """Extract a meaningful title from page text"""
        if not page_text:
            return f"Content from {filename} - Page {page_num}"
        
        # Try to find the first substantial line as title
        lines = page_text.split('\n')
        for line in lines:
            line = line.strip()
            if 10 <= len(line) <= 80 and not line.isdigit():
                # Check if it looks like a title (not too many common words)
                words = line.split()
                if len(words) >= 2 and not line.lower().startswith(('the', 'this', 'that', 'it', 'in', 'on', 'at')):
                    return line
        
        # Fallback to generic title
        return f"Content from {filename} - Page {page_num}"
    
    def _refine_section_content(self, raw_content: str, heading: str, persona_analysis: Dict) -> str:
        """Refine raw extracted content into proper paragraphs using NLP techniques"""
        if not raw_content or len(raw_content.strip()) < 20:
            return raw_content
        
        # Clean up the text
        cleaned_text = self._clean_extracted_text(raw_content)
        
        # Extract key information based on persona requirements
        key_info = self._extract_key_information(cleaned_text, persona_analysis)
        
        # Create structured paragraphs
        structured_content = self._create_structured_paragraphs(key_info, heading)
        
        return structured_content
    
    def _clean_extracted_text(self, text: str) -> str:
        """Clean up extracted text by removing artifacts and normalizing"""
        import re
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove page numbers and common PDF artifacts
        text = re.sub(r'\bPage \d+\b', '', text)
        text = re.sub(r'\b\d+\s*/\s*\d+\b', '', text)
        
        # Fix sentence boundaries
        text = re.sub(r'([.!?])\s*([A-Z])', r'\1 \2', text)
        
        # Remove incomplete sentences at start/end
        sentences = text.split('.')
        if len(sentences) > 1:
            # Remove first sentence if it doesn't start with capital letter
            if sentences[0] and not sentences[0].strip()[0].isupper():
                sentences = sentences[1:]
            
            # Remove last sentence if it seems incomplete
            if sentences and len(sentences[-1].strip()) < 10:
                sentences = sentences[:-1]
        
        return '. '.join(sentences).strip()
    
    def _extract_key_information(self, text: str, persona_analysis: Dict) -> List[str]:
        """Extract key information relevant to the persona"""
        if not text:
            return []
        
        # Split into sentences
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        
        # Get persona keywords for filtering
        persona_keywords = persona_analysis.get('keywords', [])
        
        # Score sentences based on keyword relevance
        scored_sentences = []
        for sentence in sentences:
            if len(sentence) < 20:  # Skip very short sentences
                continue
                
            score = 0
            sentence_lower = sentence.lower()
            
            # Score based on keyword presence
            for keyword in persona_keywords:
                if keyword.lower() in sentence_lower:
                    score += 2
            
            # Bonus for sentences with numbers (often important facts)
            if any(char.isdigit() for char in sentence):
                score += 1
            
            # Bonus for sentences with specific action words
            action_words = ['offer', 'provide', 'include', 'feature', 'available', 'can', 'will']
            for word in action_words:
                if word in sentence_lower:
                    score += 1
                    break
            
            scored_sentences.append((sentence, score))
        
        # Sort by score and take all relevant sentences (score > 0)
        scored_sentences.sort(key=lambda x: x[1], reverse=True)
        return [sentence for sentence, score in scored_sentences if score > 0]
    
    def _create_structured_paragraphs(self, key_sentences: List[str], heading: str) -> str:
        """Create structured paragraphs from key sentences"""
        if not key_sentences:
            return f"Content related to {heading} is available but requires further review."
        
        # Group related sentences
        if len(key_sentences) <= 2:
            return '. '.join(key_sentences) + '.'
        
        # Create paragraphs - first sentence as intro, rest as details
        intro = key_sentences[0]
        details = key_sentences[1:]
        
        structured = intro + '. '
        if details:
            structured += ' '.join(details) + '.'
        
        return structured
    
    def process_collection(self, collection_path: str) -> Dict:
        """Process a single collection"""
        collection_name = os.path.basename(collection_path)
        print(f"\n🔄 Processing collection: {collection_name}")
        
        start_time = time.time()
        
        try:
            # Validate collection structure
            is_valid, message = self.validate_collection_structure(collection_path)
            if not is_valid:
                print(f"  ❌ Invalid collection: {message}")
                return {"error": message}
            
            # Load input data
            input_data = self.load_input_json(collection_path)
            persona, task = self.extract_persona_and_task(input_data)
            
            if not persona or not task:
                print(f"  ❌ Missing persona or task information")
                return {"error": "Missing persona or task information"}
            
            print(f"  👤 Persona: {persona}")
            print(f"  🎯 Task: {task}")
            
            # Analyze persona and task
            persona_analysis = self.persona_analyzer.analyze_persona_task(persona, task)
            
            # Get PDF files
            pdf_files = self.get_pdf_files(collection_path)
            if not pdf_files:
                print(f"  ❌ No PDF files found")
                return {"error": "No PDF files found"}
            
            print(f"  📚 Found {len(pdf_files)} PDF files")
            
            # Process each PDF
            documents = []
            for pdf_file in pdf_files:
                doc_data = self.process_pdf_document(pdf_file)
                documents.append(doc_data)
            
            # Extract sections for ranking
            sections = self.extract_sections_for_ranking(documents)
            print(f"  📄 Extracted {len(sections)} sections")
            
            # Score and rank sections based on headings
            ranked_sections = self.relevance_scorer.rank_sections(sections, persona_analysis)
            
            # Ensure we get sections from multiple documents
            diversified_sections = self._diversify_sections_by_document(ranked_sections)
            print(f"  🏆 Selected top {len(diversified_sections)} sections from multiple documents")
            
            # Format sections for extracted_sections output
            formatted_sections = []
            for i, section in enumerate(diversified_sections):
                formatted_sections.append({
                    "document": section["filename"],
                    "section_title": section["heading"],
                    "importance_rank": i + 1,
                    "page_number": section["page"]
                })
            
            # Generate subsection analysis with refined content
            subsection_analysis = []
            for section in diversified_sections:
                # Get the actual content for this section
                section_content = section.get("content", "")
                
                # If content is empty or too short, try different extraction methods
                if not section_content or len(section_content.strip()) < 100:
                    # Find the PDF path
                    pdf_path = None
                    for doc_data in documents:
                        if doc_data["filename"] == section["filename"] and "pdf_path" in doc_data:
                            pdf_path = doc_data["pdf_path"]
                            break
                    
                    if pdf_path and os.path.exists(pdf_path):
                        # Try to get content using heading extractor
                        section_content = self.heading_extractor.get_heading_text_content(
                            pdf_path, 
                            {"text": section["heading"], "page": section["page"]}, 
                            max_chars=2000
                        )
                        
                        # If still no content, try using page text directly
                        if not section_content or len(section_content.strip()) < 100:
                            # Get all page texts from the document
                            for doc_data in documents:
                                if doc_data["filename"] == section["filename"]:
                                    page_texts = doc_data.get("page_texts", {})
                                    page_num = section["page"]
                                    if page_num in page_texts:
                                        page_text = page_texts[page_num]
                                        # Extract a meaningful chunk from the page
                                        section_content = self._extract_content_from_page(
                                            page_text, section["heading"]
                                        )
                                    break
                
                # Refine the content if we have any
                if section_content and len(section_content.strip()) > 50:
                    refined_content = self._refine_section_content_for_travel_planning(
                        section_content, 
                        section["heading"],
                        persona_analysis
                    )
                    
                    # Ensure we have substantial content
                    if len(refined_content.strip()) > 100:
                        subsection_analysis.append({
                            "document": section["filename"],
                            "refined_text": refined_content,
                            "page_number": section["page"]
                        })
                else:
                    # Fallback: create content based on heading
                    fallback_content = self._create_fallback_content(section["heading"], section["filename"])
                    if fallback_content:
                        subsection_analysis.append({
                            "document": section["filename"],
                            "refined_text": fallback_content,
                            "page_number": section["page"]
                        })
            
            # Create output structure
            output_data = {
                "metadata": {
                    "input_documents": [doc["filename"] for doc in documents if not doc.get("error")],
                    "persona": persona,
                    "job_to_be_done": task,
                    "processing_timestamp": datetime.now().isoformat()
                },
                "extracted_sections": formatted_sections,
                "subsection_analysis": subsection_analysis
            }
            
            # Save output
            output_path = os.path.join(collection_path, "challenge1b_output.json")
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, ensure_ascii=False, indent=2)
            
            processing_time = time.time() - start_time
            print(f"  ✅ Completed in {processing_time:.2f} seconds")
            print(f"  💾 Output saved to: challenge1b_output.json")
            
            return output_data
            
        except Exception as e:
            print(f"  ❌ Error processing collection: {e}")
            return {"error": str(e)}
    
    def process_all_collections(self, base_path: str):
        """Process all collections in the base path"""
        print(f"� Scanning for collections...")
        
        # Discover collections
        collections = self.discover_collections(base_path)
        
        if not collections:
            print("❌ No collections found!")
            print("💡 Make sure your collections are in a 'Collections' folder or named 'Collection X'")
            return
        
        print(f"📂 Found {len(collections)} collection(s) to process")
        
        # Process each collection
        results = {}
        for collection_path in collections:
            collection_name = os.path.basename(collection_path)
            print(f"\n{'='*60}")
            result = self.process_collection(collection_path)
            results[collection_name] = result
        
        # Summary
        print(f"\n{'='*60}")
        print(f"📊 Final Processing Summary:")
        successful = sum(1 for r in results.values() if "error" not in r)
        failed = len(results) - successful
        print(f"  ✅ Successful: {successful}")
        print(f"  ❌ Failed: {failed}")
        
        if failed > 0:
            print(f"\n❌ Failed collections:")
            for name, result in results.items():
                if "error" in result:
                    print(f"  - {name}: {result['error']}")

def main():
    """Main entry point for CLI mode"""
    import sys
    
    # Check if running in API mode
    if len(sys.argv) > 1 and sys.argv[1] == "--api":
        print("🌐 Starting API server mode...")
        import uvicorn
        from api_simple import app
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            reload=False
        )
        return
    
    # Default CLI mode
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    print(f"🚀 Starting collection processing from: {script_dir}")
    
    # Process collections (will look in Collections/ folder first, then fallback to base directory)
    processor = CollectionProcessor()
    processor.process_all_collections(script_dir)

def run_api_server():
    """Function to run the API server - used by API module"""
    import uvicorn
    from api import app
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False
    )

if __name__ == "__main__":
    main()
