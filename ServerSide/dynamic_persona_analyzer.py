import re
import yaml
import os
from typing import Dict, List, Set
from collections import Counter

class DynamicPersonaAnalyzer:
    """Dynamic persona analyzer that extracts keywords without hardcoding"""
    
    def __init__(self, config_path: str = "persona_config.yaml"):
        self.config_path = config_path
        self.config = self._load_config()
        
    def _load_config(self) -> Dict:
        """Load configuration from YAML file"""
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    return yaml.safe_load(f)
            else:
                # Fallback minimal config if file doesn't exist
                return self._get_minimal_config()
        except Exception as e:
            print(f"Warning: Could not load config file {self.config_path}: {e}")
            return self._get_minimal_config()
    
    def _get_minimal_config(self) -> Dict:
        """Minimal fallback configuration"""
        return {
            "domain_indicators": {
                "travel": ["travel", "trip", "hotel", "restaurant", "destination", "vacation"],
                "academic": ["research", "study", "academic", "literature", "analysis"],
                "business": ["business", "financial", "market", "revenue", "strategy"],
                "technical": ["technology", "software", "development", "data", "system"],
                "healthcare": ["medical", "health", "patient", "clinical", "treatment"],
                "legal": ["legal", "law", "regulation", "compliance", "contract"]
            },
            "task_patterns": {
                "planning": ["plan", "organize", "prepare", "schedule", "arrange"],
                "analysis": ["analyze", "review", "evaluate", "assess", "examine"],
                "research": ["research", "investigate", "study", "explore"],
                "creation": ["create", "develop", "build", "design", "generate"]
            },
            "stop_words": ["the", "and", "for", "are", "but", "not", "you", "all", "can", "her", "was", "one", "our", "had", "day", "get", "has", "him", "how", "man", "new", "now", "old", "see", "two", "way", "who", "boy", "did", "its", "let", "put", "say", "she", "too", "use"]
        }
    
    def extract_keywords_from_text(self, text: str, min_length: int = 3) -> List[str]:
        """Extract meaningful keywords from any text"""
        if not text:
            return []
        
        # Normalize text
        text = text.lower()
        # Extract words (3+ characters, not in stop words)
        words = re.findall(r'\b\w{' + str(min_length) + r',}\b', text)
        
        # Filter stop words
        stop_words = set(self.config.get("stop_words", []))
        filtered_words = [word for word in words if word not in stop_words]
        return filtered_words
    
    def detect_domain(self, text: str) -> List[str]:
        """Dynamically detect domain based on keyword presence"""
        text_lower = text.lower()
        domain_indicators = self.config.get("domain_indicators", {})
        
        detected_domains = []
        for domain, keywords in domain_indicators.items():
            matches = sum(1 for keyword in keywords if keyword in text_lower)
            if matches > 0:
                detected_domains.append((domain, matches))
        
        # Sort by number of matches and return domain names
        detected_domains.sort(key=lambda x: x[1], reverse=True)
        return [domain for domain, _ in detected_domains]
    
    def extract_persona_keywords(self, persona: str) -> Set[str]:
        """Dynamically extract keywords from persona description"""
        # Extract basic keywords from persona text
        basic_keywords = set(self.extract_keywords_from_text(persona))
        
        # Detect domain and add domain-specific keywords
        detected_domains = self.detect_domain(persona)
        domain_keywords = set()
        
        persona_patterns = self.config.get("persona_patterns", {})
        for domain in detected_domains[:2]:  # Top 2 domains
            domain_key = f"{domain}_domain"
            if domain_key in persona_patterns:
                domain_keywords.update(persona_patterns[domain_key])
        
        # Combine all keywords
        all_keywords = basic_keywords.union(domain_keywords)
        
        return all_keywords
    
    def extract_task_keywords(self, task: str) -> Set[str]:
        """Dynamically extract keywords from task description"""
        # Extract basic keywords
        basic_keywords = set(self.extract_keywords_from_text(task))
        
        # Detect task patterns and add related keywords
        task_lower = task.lower()
        task_patterns = self.config.get("task_patterns", {})
        pattern_keywords = set()
        
        for pattern_type, keywords in task_patterns.items():
            for keyword in keywords:
                if keyword in task_lower:
                    pattern_keywords.update(keywords)
                    break
        
        # Detect domain from task and add domain keywords
        detected_domains = self.detect_domain(task)
        domain_keywords = set()
        
        persona_patterns = self.config.get("persona_patterns", {})
        for domain in detected_domains[:1]:  # Top domain only for tasks
            domain_key = f"{domain}_domain"
            if domain_key in persona_patterns:
                domain_keywords.update(persona_patterns[domain_key][:10])  # Limit to top 10
        
        # Combine all keywords
        all_keywords = basic_keywords.union(pattern_keywords).union(domain_keywords)
        
        return all_keywords
    
    def calculate_keyword_weights(self, persona_keywords: Set[str], task_keywords: Set[str]) -> Dict[str, float]:
        """Calculate dynamic weights based on keyword overlap and frequency"""
        keyword_weights = {}
        
        for keyword in persona_keywords.union(task_keywords):
            weight = 1.0
            
            # Higher weight for overlapping keywords
            if keyword in persona_keywords and keyword in task_keywords:
                weight = 2.0
            # Medium weight for persona-specific keywords
            elif keyword in persona_keywords:
                weight = 1.5
            # Base weight for task-specific keywords
            elif keyword in task_keywords:
                weight = 1.2
            
            # Bonus weight for longer, more specific keywords
            if len(keyword) > 8:
                weight *= 1.1
            
            keyword_weights[keyword] = weight
        
        return keyword_weights
    
    def analyze_persona_task(self, persona: str, task: str) -> Dict:
        """Dynamically analyze persona and task to extract keywords"""
        # Extract keywords dynamically
        persona_keywords = self.extract_persona_keywords(persona)
        task_keywords = self.extract_task_keywords(task)
        
        # Combine keywords
        all_keywords = persona_keywords.union(task_keywords)
        
        # Calculate dynamic weights
        keyword_weights = self.calculate_keyword_weights(persona_keywords, task_keywords)
        
        # Detect domains for analysis
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
                    "persona": persona_domains,
                    "task": task_domains
                }
            }
        }
    
    def add_domain_keywords(self, domain: str, keywords: List[str]):
        """Dynamically add new domain keywords (runtime extensibility)"""
        if "persona_patterns" not in self.config:
            self.config["persona_patterns"] = {}
        
        domain_key = f"{domain}_domain"
        if domain_key in self.config["persona_patterns"]:
            # Extend existing domain
            self.config["persona_patterns"][domain_key].extend(keywords)
        else:
            # Add new domain
            self.config["persona_patterns"][domain_key] = keywords
    
    def add_task_pattern(self, pattern_name: str, keywords: List[str]):
        """Dynamically add new task patterns (runtime extensibility)"""
        if "task_patterns" not in self.config:
            self.config["task_patterns"] = {}
        
        self.config["task_patterns"][pattern_name] = keywords
