import re
from typing import Dict, List, Tuple

class SubsectionExtractor:
    """Extract and refine relevant subsections from document text"""
    
    def __init__(self):
        self.sentence_endings = r'[.!?]+\s+'
        self.paragraph_separators = r'\n\s*\n|\n\n+'
        self.min_subsection_length = 100  # Minimum characters for a meaningful subsection
        self.max_subsection_length = 1000  # Maximum characters to keep content focused
    
    def split_into_meaningful_chunks(self, text: str) -> List[str]:
        """Split text into meaningful, content-rich chunks"""
        if not text:
            return []
        
        # Clean text first
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Try to split by clear paragraph markers first
        chunks = re.split(self.paragraph_separators, text)
        
        # Filter and process chunks
        meaningful_chunks = []
        for chunk in chunks:
            chunk = chunk.strip()
            if len(chunk) >= self.min_subsection_length:
                meaningful_chunks.append(chunk)
            elif len(chunk) >= 50:  # Shorter chunks might be combinable
                # Try to extend with context
                extended_chunk = self.extend_chunk_with_context(chunk, text)
                if len(extended_chunk) >= self.min_subsection_length:
                    meaningful_chunks.append(extended_chunk)
        
        # If we don't have good paragraph splits, try sentence-based chunking
        if not meaningful_chunks:
            meaningful_chunks = self.create_sentence_based_chunks(text)
        
        return meaningful_chunks
    
    def extend_chunk_with_context(self, chunk: str, full_text: str) -> str:
        """Extend a short chunk with surrounding context"""
        chunk_pos = full_text.find(chunk)
        if chunk_pos == -1:
            return chunk
        
        # Look for context before and after
        start = max(0, chunk_pos - 200)
        end = min(len(full_text), chunk_pos + len(chunk) + 200)
        
        extended = full_text[start:end].strip()
        
        # Clean up the boundaries to end at sentence boundaries
        sentences = re.split(self.sentence_endings, extended)
        if len(sentences) > 1:
            # Take complete sentences
            complete_text = '. '.join(sentences[:-1]) + '.'
            return complete_text
        
        return extended
    
    def create_sentence_based_chunks(self, text: str) -> List[str]:
        """Create chunks by combining sentences to reach minimum length"""
        sentences = re.split(self.sentence_endings, text)
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            # Add sentence to current chunk
            if current_chunk:
                current_chunk += ". " + sentence
            else:
                current_chunk = sentence
            
            # If chunk is long enough, save it
            if len(current_chunk) >= self.min_subsection_length:
                if not current_chunk.endswith('.'):
                    current_chunk += '.'
                chunks.append(current_chunk)
                current_chunk = ""
        
        # Add any remaining chunk if it's substantial
        if current_chunk and len(current_chunk) >= 50:
            if not current_chunk.endswith('.'):
                current_chunk += '.'
            chunks.append(current_chunk)
        
        return chunks
    
    def score_subsection_relevance(self, text: str, keywords: List[str], weights: Dict[str, float] = None) -> float:
        """Score relevance of a subsection based on keyword presence and content quality"""
        if not text or not keywords:
            return 0.0
        
        text_lower = text.lower()
        total_weight = 0.0
        matched_weight = 0.0
        
        # Keyword matching score
        for keyword in keywords:
            weight = weights.get(keyword, 1.0) if weights else 1.0
            total_weight += weight
            
            keyword_lower = keyword.lower()
            if keyword_lower in text_lower:
                # Count occurrences and give bonus for multiple mentions
                count = text_lower.count(keyword_lower)
                matched_weight += weight * min(count, 3)  # Cap at 3x weight
        
        keyword_score = matched_weight / total_weight if total_weight > 0 else 0.0
        
        # Content quality bonuses
        quality_bonus = 0.0
        
        # Bonus for specific details (numbers, specific names, etc.)
        if re.search(r'\b\d+\b', text):  # Contains numbers
            quality_bonus += 0.1
        
        # Bonus for actionable content (verbs like "visit", "try", "explore")
        action_words = ['visit', 'try', 'explore', 'enjoy', 'experience', 'discover', 'learn', 'take', 'go']
        for word in action_words:
            if word in text_lower:
                quality_bonus += 0.05
        
        # Bonus for structured content (colons, dashes indicating lists/categories)
        if ':' in text or '-' in text:
            quality_bonus += 0.1
        
        # Bonus for proper length (not too short, not too long)
        text_length = len(text)
        if 150 <= text_length <= 500:
            quality_bonus += 0.2
        elif 100 <= text_length <= 600:
            quality_bonus += 0.1
        
        return keyword_score + quality_bonus
    
    def extract_best_subsections(self, 
                                text: str, 
                                keywords: List[str], 
                                weights: Dict[str, float] = None,
                                max_subsections: int = 2,
                                min_length: int = 100) -> List[Dict]:
        """
        Extract the most relevant and content-rich subsections from text
        """
        if not text or len(text) < min_length:
            return []
        
        # Split into meaningful chunks
        chunks = self.split_into_meaningful_chunks(text)
        
        if not chunks:
            return []
        
        # Score each chunk
        scored_chunks = []
        for i, chunk in enumerate(chunks):
            if len(chunk) >= min_length:
                score = self.score_subsection_relevance(chunk, keywords, weights)
                scored_chunks.append({
                    "text": chunk,
                    "score": score,
                    "position": i,
                    "length": len(chunk),
                    "word_count": len(chunk.split())
                })
        
        # Sort by score (highest first)
        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        
        # Select diverse, high-quality subsections
        selected_subsections = []
        for chunk in scored_chunks:
            if len(selected_subsections) >= max_subsections:
                break
            
            # Check for significant overlap with already selected
            is_too_similar = False
            for selected in selected_subsections:
                overlap = self.calculate_text_overlap(chunk["text"], selected["text"])
                if overlap > 0.6:  # 60% overlap threshold
                    is_too_similar = True
                    break
            
            # Only add if it's different enough and has good quality
            if not is_too_similar and chunk["score"] > 0.1:  # Minimum quality threshold
                selected_subsections.append(chunk)
        
        return selected_subsections
    
    def calculate_text_overlap(self, text1: str, text2: str) -> float:
        """Calculate text overlap ratio between two texts"""
        if not text1 or not text2:
            return 0.0
        
        # Simple word-based overlap
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = len(words1.intersection(words2))
        union = len(words1.union(words2))
        
        return intersection / union if union > 0 else 0.0
    
    def refine_subsection_text(self, text: str, max_length: int = 600) -> str:
        """
        Refine subsection text by cleaning and ensuring completeness
        """
        if not text:
            return ""
        
        # Clean text
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Ensure text ends properly
        if not text.endswith(('.', '!', '?', ':')):
            # Try to find a good ending point
            sentences = re.split(r'[.!?]+', text)
            if len(sentences) > 1:
                # Take all complete sentences
                complete_sentences = sentences[:-1]  # Exclude the last incomplete one
                text = '. '.join(complete_sentences) + '.'
            else:
                # Add period if it's a complete thought
                text += '.'
        
        # If text is too long, truncate at sentence boundary
        if len(text) > max_length:
            sentences = re.split(r'([.!?]+)', text)
            refined_text = ""
            
            for i in range(0, len(sentences), 2):  # Every other element is sentence + punctuation
                sentence = sentences[i]
                punctuation = sentences[i + 1] if i + 1 < len(sentences) else '.'
                
                if len(refined_text + sentence + punctuation) <= max_length:
                    refined_text += sentence + punctuation
                else:
                    break
            
            if refined_text:
                text = refined_text.strip()
        
        return text
    
    def extract_and_refine_subsections(self, 
                                     document_sections: List[Dict], 
                                     persona_analysis: Dict,
                                     max_subsections_total: int = 10) -> List[Dict]:
        """
        Extract and refine subsections from multiple document sections with better quality
        """
        all_keywords = persona_analysis.get("all_keywords", [])
        keyword_weights = persona_analysis.get("keyword_weights", {})
        
        # Collect all potential subsections from all documents
        all_candidate_subsections = []
        
        for section in document_sections:
            document = section.get("document", "")
            section_text = section.get("text", "")
            page_number = section.get("page_number", section.get("page", 1))
            section_title = section.get("section_title", "")
            importance_rank = section.get("importance_rank", 999)
            
            if not section_text or len(section_text.strip()) < 50:
                continue
            
            # Extract subsections from this section with higher limit per section
            max_per_section = min(3, max(1, max_subsections_total // len(document_sections)))
            subsections = self.extract_best_subsections(
                text=section_text,
                keywords=all_keywords,
                weights=keyword_weights,
                max_subsections=max_per_section,
                min_length=self.min_subsection_length
            )
            
            # Convert to output format and add metadata
            for subsection in subsections:
                refined_text = self.refine_subsection_text(subsection["text"])
                
                if refined_text and len(refined_text) >= 80:  # Ensure substantial content
                    all_candidate_subsections.append({
                        "document": document,
                        "refined_text": refined_text,
                        "page_number": page_number,
                        "section_title": section_title,
                        "relevance_score": subsection["score"],
                        "section_importance": importance_rank,
                        "text_quality": len(refined_text.split()),  # Word count as quality indicator
                        "has_specifics": self.has_specific_details(refined_text)
                    })
        
        # Sort by combined score (relevance + section importance + quality)
        for item in all_candidate_subsections:
            combined_score = (
                item["relevance_score"] * 0.5 +  # 50% relevance
                (1.0 / max(item["section_importance"], 1)) * 0.3 +  # 30% section importance (inverse)
                (item["text_quality"] / 100.0) * 0.1 +  # 10% word count quality
                (0.2 if item["has_specifics"] else 0.0) * 0.1  # 10% bonus for specific details
            )
            item["combined_score"] = combined_score
        
        # Sort by combined score
        all_candidate_subsections.sort(key=lambda x: x["combined_score"], reverse=True)
        
        # Select diverse, high-quality subsections
        final_subsections = []
        documents_used = set()
        
        for candidate in all_candidate_subsections:
            if len(final_subsections) >= max_subsections_total:
                break
            
            # Ensure diversity across documents (but allow multiple from same doc if high quality)
            doc_count_for_this = sum(1 for fs in final_subsections if fs["document"] == candidate["document"])
            
            # Allow up to 2 subsections per document, but prioritize diversity
            if doc_count_for_this >= 2 and len(documents_used) < len(set(s.get("document", "") for s in document_sections)):
                continue
            
            # Check for content overlap with already selected
            is_duplicate = False
            for selected in final_subsections:
                overlap = self.calculate_text_overlap(candidate["refined_text"], selected["refined_text"])
                if overlap > 0.5:  # 50% overlap threshold
                    is_duplicate = True
                    break
            
            if not is_duplicate and candidate["combined_score"] > 0.1:
                # Clean up the final item (remove internal scoring fields)
                final_item = {
                    "document": candidate["document"],
                    "refined_text": candidate["refined_text"],
                    "page_number": candidate["page_number"]
                }
                final_subsections.append(final_item)
                documents_used.add(candidate["document"])
        
        return final_subsections
    
    def has_specific_details(self, text: str) -> bool:
        """Check if text contains specific, actionable details"""
        # Look for specific indicators of detailed content
        indicators = [
            r'\b\d+\b',  # Numbers
            r'\b[A-Z][a-z]+\s+[A-Z][a-z]+\b',  # Proper names (e.g., "Saint Tropez")
            r':\s*[A-Z]',  # Colons followed by capitalized text (structured content)
            r'-\s*[A-Z]',  # Dashes followed by capitalized text (lists)
            r'\b(visit|try|explore|enjoy|experience|discover|take|go|see)\b',  # Action verbs
        ]
        
        text_lower = text.lower()
        count = 0
        for pattern in indicators:
            if re.search(pattern, text, re.IGNORECASE):
                count += 1
        
        return count >= 2  # Must have at least 2 indicators
