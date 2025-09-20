import re
import yaml
import os
from typing import Dict, List, Set

class PersonaAnalyzer:
    """Analyze persona and extract relevant keywords and domain focus"""
    
    def __init__(self):
        self.persona_keywords = {
            # Travel and Tourism
            "travel_planner": ["destinations", "hotels", "restaurants", "activities", "attractions", "transportation", "itinerary", "booking", "accommodation", "sightseeing", "tourism", "vacation", "trip", "travel"],
            "tourist": ["places", "visit", "see", "explore", "attractions", "landmarks", "culture", "local", "experience", "guide", "tour"],
            
            # Academic and Research
            "researcher": ["methodology", "analysis", "data", "results", "findings", "literature", "review", "study", "research", "investigation", "hypothesis", "experiment"],
            "phd_researcher": ["dissertation", "thesis", "academic", "scholarly", "publication", "peer-review", "methodology", "theoretical", "framework", "citation"],
            "student": ["study", "learn", "understand", "concepts", "topics", "curriculum", "assignment", "exam", "education", "knowledge"],
            "undergraduate": ["basic", "fundamental", "introductory", "course", "semester", "degree", "major", "study", "learn"],
            
            # Business and Finance
            "investment_analyst": ["financial", "revenue", "profit", "growth", "market", "investment", "returns", "portfolio", "risk", "performance", "valuation", "analysis"],
            "business_analyst": ["strategy", "operations", "efficiency", "process", "improvement", "metrics", "performance", "business", "analysis", "optimization"],
            "entrepreneur": ["startup", "business", "opportunity", "market", "innovation", "growth", "strategy", "funding", "venture", "competitive"],
            
            # Technical and Scientific
            "software_engineer": ["code", "programming", "development", "software", "algorithm", "system", "architecture", "design", "implementation", "technology"],
            "data_scientist": ["data", "analytics", "machine learning", "statistics", "modeling", "prediction", "analysis", "insights", "visualization"],
            
            # Healthcare and Medical
            "doctor": ["medical", "diagnosis", "treatment", "patient", "clinical", "health", "disease", "symptoms", "therapy", "medicine"],
            "nurse": ["patient care", "nursing", "clinical", "health", "medical", "treatment", "care", "healthcare", "wellness"],
            
            # Legal and Compliance
            "lawyer": ["legal", "law", "regulation", "compliance", "contract", "agreement", "litigation", "rights", "jurisdiction", "statute"],
            
            # Marketing and Sales
            "marketer": ["marketing", "brand", "campaign", "audience", "promotion", "advertising", "engagement", "conversion", "strategy"],
            "salesperson": ["sales", "customers", "leads", "conversion", "revenue", "targets", "pipeline", "negotiation", "deals"],
            
            # Generic professional roles
            "consultant": ["advisory", "recommendations", "expertise", "solutions", "analysis", "strategy", "improvement", "consulting"],
            "manager": ["management", "team", "leadership", "coordination", "planning", "execution", "oversight", "supervision"],
        }
        
        self.task_keywords = {
            # Planning and Organization
            "plan": ["schedule", "organize", "arrange", "coordinate", "timeline", "itinerary", "preparation", "strategy"],
            "prepare": ["ready", "setup", "organize", "compile", "gather", "arrangement", "preparation"],
            "organize": ["structure", "arrange", "categorize", "sort", "systematize", "order", "coordinate"],
            
            # Analysis and Review
            "analyze": ["examine", "evaluate", "assess", "investigate", "study", "review", "scrutinize", "inspect"],
            "review": ["examine", "assess", "evaluate", "survey", "overview", "analysis", "summary", "critique"],
            "summarize": ["overview", "synopsis", "abstract", "summary", "condensed", "brief", "digest"],
            "compare": ["contrast", "difference", "similarity", "evaluation", "assessment", "comparison", "benchmark"],
            
            # Research and Learning
            "research": ["investigate", "study", "explore", "discover", "inquiry", "examination", "analysis"],
            "study": ["learn", "examine", "analyze", "review", "investigate", "understand", "explore"],
            "identify": ["find", "locate", "discover", "recognize", "detect", "pinpoint", "determine"],
            
            # Creation and Development
            "create": ["develop", "build", "design", "construct", "generate", "produce", "make", "establish"],
            "develop": ["create", "build", "design", "formulate", "establish", "construct", "generate"],
            "design": ["create", "plan", "develop", "architect", "blueprint", "layout", "structure"],
            
            # Evaluation and Assessment
            "evaluate": ["assess", "judge", "appraise", "estimate", "analyze", "examine", "review"],
            "assess": ["evaluate", "judge", "estimate", "appraise", "analyze", "examine", "measure"],
        }
    
    def extract_persona_keywords(self, persona: str) -> Set[str]:
        """Extract relevant keywords for a given persona"""
        persona_lower = persona.lower().replace(" ", "_")
        
        # Direct match
        if persona_lower in self.persona_keywords:
            return set(self.persona_keywords[persona_lower])
        
        # Partial match
        keywords = set()
        for key, values in self.persona_keywords.items():
            if any(word in persona_lower for word in key.split("_")):
                keywords.update(values)
        
        # Fallback: extract from persona text itself
        persona_words = re.findall(r'\b\w+\b', persona.lower())
        keywords.update(persona_words)
        
        return keywords
    
    def extract_task_keywords(self, task: str) -> Set[str]:
        """Extract relevant keywords from job-to-be-done task"""
        task_lower = task.lower()
        keywords = set()
        
        # Extract action words
        for action, related in self.task_keywords.items():
            if action in task_lower:
                keywords.add(action)
                keywords.update(related)
        
        # Extract domain-specific words
        task_words = re.findall(r'\b\w{3,}\b', task_lower)
        
        # Filter out common stop words
        stop_words = {"the", "and", "for", "are", "but", "not", "you", "all", "can", "her", "was", "one", "our", "had", "day", "get", "has", "him", "how", "man", "new", "now", "old", "see", "two", "way", "who", "boy", "did", "its", "let", "put", "say", "she", "too", "use"}
        
        filtered_words = [word for word in task_words if word not in stop_words and len(word) > 2]
        keywords.update(filtered_words)
        
        return keywords
    
    def analyze_persona_task(self, persona: str, task: str) -> Dict:
        """Analyze persona and task to extract comprehensive keyword set"""
        persona_keywords = self.extract_persona_keywords(persona)
        task_keywords = self.extract_task_keywords(task)
        
        # Combine and weight keywords
        all_keywords = persona_keywords.union(task_keywords)
        
        # Create weighted keyword scores
        keyword_weights = {}
        for keyword in all_keywords:
            weight = 1.0
            if keyword in persona_keywords and keyword in task_keywords:
                weight = 2.0  # Higher weight for overlapping keywords
            elif keyword in persona_keywords:
                weight = 1.5  # Medium weight for persona-specific
            elif keyword in task_keywords:
                weight = 1.2  # Slightly higher for task-specific
            
            keyword_weights[keyword] = weight
        
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
                "task_specific": len(task_keywords)
            }
        }
