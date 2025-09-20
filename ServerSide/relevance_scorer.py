import re
import math
from typing import Dict, List, Tuple
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class RelevanceScorer:
    """Score text relevance based on persona and task requirements"""
    
    def __init__(self):
        self.tfidf_vectorizer = None
        self.stop_words = {
            'english': {'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with'}
        }
    
    def normalize_text(self, text: str) -> str:
        """Normalize text for processing"""
        # Convert to lowercase
        text = text.lower()
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep alphanumeric and spaces
        text = re.sub(r'[^\w\s]', ' ', text)
        return text.strip()
    
    def extract_keywords_from_text(self, text: str, min_length: int = 3) -> List[str]:
        """Extract meaningful keywords from text"""
        normalized = self.normalize_text(text)
        words = normalized.split()
        
        # Filter words
        keywords = []
        for word in words:
            if (len(word) >= min_length and 
                word not in self.stop_words['english'] and
                not word.isdigit()):
                keywords.append(word)
        
        return keywords
    
    def calculate_keyword_overlap_score(self, text: str, reference_keywords: List[str], weights: Dict[str, float] = None) -> float:
        """Calculate relevance score based on keyword overlap"""
        if not reference_keywords or not text:
            return 0.0
        
        text_keywords = self.extract_keywords_from_text(text)
        if not text_keywords:
            return 0.0
        
        # Calculate weighted overlap
        total_weight = 0.0
        matched_weight = 0.0
        
        for keyword in reference_keywords:
            weight = weights.get(keyword, 1.0) if weights else 1.0
            total_weight += weight
            
            # Check for exact match or substring match
            keyword_lower = keyword.lower()
            if any(keyword_lower in text_word or text_word in keyword_lower for text_word in text_keywords):
                matched_weight += weight
        
        return matched_weight / total_weight if total_weight > 0 else 0.0
    
    def calculate_tfidf_similarity(self, text: str, reference_text: str) -> float:
        """Calculate TF-IDF based similarity"""
        try:
            if not text or not reference_text:
                return 0.0
            
            # Prepare documents
            documents = [self.normalize_text(text), self.normalize_text(reference_text)]
            
            # Calculate TF-IDF
            vectorizer = TfidfVectorizer(stop_words='english', max_features=1000, ngram_range=(1, 2))
            tfidf_matrix = vectorizer.fit_transform(documents)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(similarity)
            
        except Exception as e:
            print(f"Error calculating TF-IDF similarity: {e}")
            return 0.0
    
    def calculate_position_score(self, position: int, total_sections: int) -> float:
        """Calculate position-based relevance score (earlier sections often more important)"""
        if total_sections <= 1:
            return 1.0
        
        # Linear decay: first section gets 1.0, last gets 0.3
        decay_factor = 0.7 / (total_sections - 1)
        score = 1.0 - (position - 1) * decay_factor
        return max(score, 0.3)  # Minimum score of 0.3
    
    def calculate_length_score(self, text: str) -> float:
        """Calculate relevance score based on text length (moderate length preferred)"""
        if not text:
            return 0.0
        
        word_count = len(text.split())
        
        # Optimal length around 50-200 words
        if 50 <= word_count <= 200:
            return 1.0
        elif 20 <= word_count < 50:
            return 0.8
        elif 200 < word_count <= 400:
            return 0.9
        elif 10 <= word_count < 20:
            return 0.6
        elif 400 < word_count <= 800:
            return 0.7
        else:
            return 0.4
    
    def score_section_relevance(self, 
                              section_text: str, 
                              section_title: str,
                              persona_keywords: List[str], 
                              task_keywords: List[str],
                              keyword_weights: Dict[str, float] = None,
                              position: int = 1,
                              total_sections: int = 1) -> Dict[str, float]:
        """
        Calculate comprehensive relevance score for a section
        """
        if not section_text and not section_title:
            return {
                "total_score": 0.0,
                "keyword_score": 0.0,
                "position_score": 0.0,
                "length_score": 0.0,
                "title_score": 0.0
            }
        
        # Combine text and title for analysis
        combined_text = f"{section_title} {section_text}".strip()
        
        # Calculate individual scores
        all_keywords = list(set(persona_keywords + task_keywords))
        keyword_score = self.calculate_keyword_overlap_score(combined_text, all_keywords, keyword_weights)
        
        # Title gets separate scoring (titles are often more indicative)
        title_score = self.calculate_keyword_overlap_score(section_title, all_keywords, keyword_weights) if section_title else 0.0
        
        # Position and length scores
        position_score = self.calculate_position_score(position, total_sections)
        length_score = self.calculate_length_score(section_text)
        
        # Weighted combination
        total_score = (
            keyword_score * 0.4 +           # 40% - keyword matching
            title_score * 0.25 +            # 25% - title relevance
            position_score * 0.2 +          # 20% - position importance
            length_score * 0.15             # 15% - content length quality
        )
        
        return {
            "total_score": round(total_score, 4),
            "keyword_score": round(keyword_score, 4),
            "title_score": round(title_score, 4),
            "position_score": round(position_score, 4),
            "length_score": round(length_score, 4)
        }
    
    def rank_sections(self, sections: List[Dict], persona_analysis: Dict) -> List[Dict]:
        """
        Rank sections based on relevance scores
        """
        if not sections:
            return []
        
        persona_keywords = persona_analysis.get("persona_keywords", [])
        task_keywords = persona_analysis.get("task_keywords", [])
        keyword_weights = persona_analysis.get("keyword_weights", {})
        
        scored_sections = []
        total_sections = len(sections)
        
        for i, section in enumerate(sections):
            section_text = section.get("text", "")
            section_title = section.get("title", section.get("section_title", ""))
            
            scores = self.score_section_relevance(
                section_text=section_text,
                section_title=section_title,
                persona_keywords=persona_keywords,
                task_keywords=task_keywords,
                keyword_weights=keyword_weights,
                position=i + 1,
                total_sections=total_sections
            )
            
            # Add scores to section
            section_with_scores = section.copy()
            section_with_scores.update(scores)
            scored_sections.append(section_with_scores)
        
        # Sort by total score (descending)
        scored_sections.sort(key=lambda x: x.get("total_score", 0), reverse=True)
        
        # Add importance rank
        for i, section in enumerate(scored_sections):
            section["importance_rank"] = i + 1
        
        return scored_sections
