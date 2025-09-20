import re
import os
from typing import Dict, List, Set
from collections import Counter

class LightweightPersonaAnalyzer:
    """Lightweight persona analyzer without external dependencies"""
    
    def __init__(self):
        # Minimal configuration embedded in code but organized for easy modification
        self.domain_indicators = {
            "travel": ["travel", "trip", "hotel", "restaurant", "destination", "vacation", "tourism", "itinerary", "booking", "sightseeing", "attraction", "guide", "culture"],
            "academic": ["research", "study", "academic", "literature", "analysis", "methodology", "thesis", "dissertation", "scholarly", "education", "learning", "knowledge"],
            "business": ["business", "financial", "market", "revenue", "strategy", "profit", "investment", "performance", "competitive", "portfolio", "operations"],
            "technical": ["technology", "software", "development", "data", "system", "programming", "engineering", "algorithm", "analytics", "innovation"],
            "healthcare": ["medical", "health", "patient", "clinical", "treatment", "diagnosis", "therapy", "healthcare", "wellness", "care"],
            "legal": ["legal", "law", "regulation", "compliance", "contract", "litigation", "rights", "jurisdiction"]
        }
        
        self.task_patterns = {
            "planning": ["plan", "organize", "prepare", "schedule", "arrange", "coordinate", "strategy", "timeline"],
            "analysis": ["analyze", "review", "evaluate", "assess", "examine", "investigate", "study", "compare"],
            "research": ["research", "investigate", "study", "explore", "discover", "find", "identify"],
            "creation": ["create", "develop", "build", "design", "generate", "produce", "establish"],
            "evaluation": ["evaluate", "assess", "judge", "measure", "benchmark", "appraise"]
        }
        
        self.stop_words = {
            "the", "and", "for", "are", "but", "not", "you", "all", "can", "her", "was", "one", "our", "had", 
            "day", "get", "has", "him", "how", "man", "new", "now", "old", "see", "two", "way", "who", "boy", 
            "did", "its", "let", "put", "say", "she", "too", "use", "this", "that", "with", "have", "they", 
            "will", "been", "from", "would", "there", "their", "what", "about", "which", "when", "make", 
            "like", "into", "time", "very", "after", "first", "well", "much", "also", "many", "such", "only", 
            "some", "other", "then", "them", "these", "come", "could", "want", "look", "over", "think", 
            "where", "just", "work", "life", "even", "back", "any", "good", "woman", "through", "down", 
            "may", "call"
        }
    
    def extract_keywords_from_text(self, text: str, min_length: int = 3) -> List[str]:
        """Extract meaningful keywords from text"""
        if not text:
            return []
        
        # Normalize and extract words
        text = text.lower()
        words = re.findall(r'\b\w{' + str(min_length) + r',}\b', text)
        
        # Filter stop words and duplicates
        filtered_words = list(set(word for word in words if word not in self.stop_words))
        
        return filtered_words
    
    def detect_domain(self, text: str) -> List[str]:
        """Detect domain based on keyword presence"""
        text_lower = text.lower()
        detected_domains = []
        
        for domain, keywords in self.domain_indicators.items():
            matches = sum(1 for keyword in keywords if keyword in text_lower)
            if matches > 0:
                detected_domains.append((domain, matches))
        
        # Sort by matches and return domain names
        detected_domains.sort(key=lambda x: x[1], reverse=True)
        return [domain for domain, _ in detected_domains]
    
    def extract_persona_keywords(self, persona: str) -> Set[str]:
        """Extract keywords from persona description"""
        # Basic keywords from persona text
        basic_keywords = set(self.extract_keywords_from_text(persona))
        
        # Add domain-specific keywords
        detected_domains = self.detect_domain(persona)
        domain_keywords = set()
        
        for domain in detected_domains[:2]:  # Top 2 domains
            if domain in self.domain_indicators:
                domain_keywords.update(self.domain_indicators[domain])
        
        return basic_keywords.union(domain_keywords)
    
    def extract_task_keywords(self, task: str) -> Set[str]:
        """Extract keywords from task description"""
        # Basic keywords from task text
        basic_keywords = set(self.extract_keywords_from_text(task))
        
        # Add task pattern keywords
        task_lower = task.lower()
        pattern_keywords = set()
        
        for pattern_type, keywords in self.task_patterns.items():
            for keyword in keywords:
                if keyword in task_lower:
                    pattern_keywords.update(keywords[:5])  # Limit to top 5 per pattern
                    break
        
        # Add domain keywords from task
        detected_domains = self.detect_domain(task)
        domain_keywords = set()
        
        for domain in detected_domains[:1]:  # Top domain only
            if domain in self.domain_indicators:
                domain_keywords.update(self.domain_indicators[domain][:8])  # Limit to 8 keywords
        
        return basic_keywords.union(pattern_keywords).union(domain_keywords)
    
    def calculate_keyword_weights(self, persona_keywords: Set[str], task_keywords: Set[str]) -> Dict[str, float]:
        """Calculate keyword weights"""
        keyword_weights = {}
        
        for keyword in persona_keywords.union(task_keywords):
            # Base weight
            weight = 1.0
            
            # Higher weight for overlapping keywords
            if keyword in persona_keywords and keyword in task_keywords:
                weight = 2.5
            elif keyword in persona_keywords:
                weight = 1.5
            elif keyword in task_keywords:
                weight = 1.3
            
            # Bonus for longer, more specific keywords
            if len(keyword) > 7:
                weight *= 1.2
            elif len(keyword) > 10:
                weight *= 1.3
            
            keyword_weights[keyword] = weight
        
        return keyword_weights
    
    def analyze_persona_task(self, persona: str, task: str) -> Dict:
        """Analyze persona and task dynamically"""
        # Extract keywords
        persona_keywords = self.extract_persona_keywords(persona)
        task_keywords = self.extract_task_keywords(task)
        
        # Combine keywords
        all_keywords = persona_keywords.union(task_keywords)
        
        # Calculate weights
        keyword_weights = self.calculate_keyword_weights(persona_keywords, task_keywords)
        
        # Detect domains
        persona_domains = self.detect_domain(persona)
        task_domains = self.detect_domain(task)
        
        return {
            "persona_keywords": list(persona_keywords),
            "task_keywords": list(task_keywords),
            "all_keywords": list(all_keywords),
            "keyword_weights": keyword_weights,
            "analysis": {
                "persona": persona,
                "task": task,
                "total_keywords": len(all_keywords),
                "persona_specific": len(persona_keywords),
                "task_specific": len(task_keywords),
                "detected_domains": {
                    "persona": persona_domains[:3],  # Top 3 domains
                    "task": task_domains[:3]
                }
            }
        }
    
    def extend_domain(self, domain: str, keywords: List[str]):
        """Add keywords to existing domain or create new domain"""
        if domain in self.domain_indicators:
            self.domain_indicators[domain].extend(keywords)
        else:
            self.domain_indicators[domain] = keywords
    
    def extend_task_pattern(self, pattern: str, keywords: List[str]):
        """Add keywords to existing task pattern or create new pattern"""
        if pattern in self.task_patterns:
            self.task_patterns[pattern].extend(keywords)
        else:
            self.task_patterns[pattern] = keywords
