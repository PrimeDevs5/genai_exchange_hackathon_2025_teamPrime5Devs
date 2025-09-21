"""
Google Gemini AI Service for Advanced Legal Document Analysis
Provides detailed clause analysis, risk assessment, and legal summaries
"""

import google.generativeai as genai
import json
import re
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiLegalAnalyzer:
    def __init__(self, api_key: str):
        """
        Initialize Gemini AI service for legal analysis
        
        Args:
            api_key: Google Gemini API key
        """
        self.api_key = api_key
        genai.configure(api_key=api_key)
        
        # Configure the model for legal analysis
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",  # Using latest Gemini model
            generation_config={
                "temperature": 0.1,  # Low temperature for factual legal analysis
                "top_p": 0.8,
                "top_k": 40,
                "max_output_tokens": 8192,  # Increased for detailed analysis
            },
            safety_settings=[
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        )
    
    def analyze_legal_document(self, document_text: str, document_type: str = "contract") -> List[Dict[str, Any]]:
        """
        Analyze legal document and extract clauses with risk assessment
        
        Args:
            document_text: Full text of the legal document
            document_type: Type of document (contract, agreement, policy, etc.)
            
        Returns:
            List of analyzed clauses with risk assessment
        """
        try:
            # Create comprehensive legal analysis prompt
            prompt = self._create_analysis_prompt(document_text, document_type)
            
            # Generate analysis using Gemini
            response = self.model.generate_content(prompt)
            
            # Parse and structure the response
            analysis_result = self._parse_gemini_response(response.text)
            
            return analysis_result
            
        except Exception as e:
            logger.error(f"Error in legal document analysis: {str(e)}")
            return self._create_error_response(str(e))
    
    def _create_analysis_prompt(self, document_text: str, document_type: str) -> str:
        """Create a comprehensive prompt for legal analysis"""
        
        prompt = f"""
You are an expert legal analyst specializing in contract review and risk assessment. 
Analyze the following {document_type} and provide detailed analysis for each important clause.

DOCUMENT TEXT:
{document_text}

ANALYSIS REQUIREMENTS:
1. Identify ALL important clauses in the document
2. For each clause, provide risk assessment (High/Medium/Low)
3. Explain the legal implications and original law basis
4. Provide detailed summary with potential impact

OUTPUT FORMAT (JSON):
Return a JSON array where each object represents a clause analysis:

[
  {{
    "clause": "Full text of the identified clause",
    "risk": "High|Medium|Low",
    "laws": "Relevant legal principles, statutes, or common law that applies to this clause",
    "summary": "Detailed analysis explaining: 1) What this clause means in plain language, 2) Potential risks or benefits, 3) Impact on parties involved, 4) Recommendations"
  }}
]

FOCUS AREAS:
- Payment terms and penalties
- Liability and indemnification clauses
- Termination conditions
- Intellectual property rights
- Confidentiality agreements
- Force majeure provisions
- Dispute resolution mechanisms
- Warranties and representations
- Limitation of liability
- Governing law and jurisdiction

RISK ASSESSMENT CRITERIA:
- High Risk: Could result in significant financial loss, legal liability, or operational disruption
- Medium Risk: Moderate impact on business operations or legal exposure
- Low Risk: Minor implications with limited impact

Provide comprehensive, accurate, and actionable legal analysis. Focus on practical implications for business decisions.

IMPORTANT: Return ONLY the JSON array, no additional text or formatting.
"""
        return prompt
    
    def _parse_gemini_response(self, response_text: str) -> List[Dict[str, Any]]:
        """Parse Gemini response and extract structured analysis"""
        try:
            # Clean the response text
            cleaned_text = self._clean_response_text(response_text)
            
            # Try to parse as JSON
            analysis_data = json.loads(cleaned_text)
            
            # Validate and structure the response
            structured_analysis = []
            
            for item in analysis_data:
                if isinstance(item, dict):
                    clause_analysis = {
                        "clause": item.get("clause", ""),
                        "risk": self._validate_risk_level(item.get("risk", "Medium")),
                        "laws": item.get("laws", "General contract law principles"),
                        "summary": item.get("summary", "Analysis not available"),
                        "analyzed_at": datetime.now().isoformat(),
                        "confidence": "high"  # Gemini typically provides high-confidence analysis
                    }
                    structured_analysis.append(clause_analysis)
            
            return structured_analysis
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {str(e)}")
            return self._fallback_text_parsing(response_text)
        except Exception as e:
            logger.error(f"Response parsing error: {str(e)}")
            return self._create_error_response(f"Parsing error: {str(e)}")
    
    def _clean_response_text(self, text: str) -> str:
        """Clean the response text for JSON parsing"""
        # Remove markdown code blocks
        text = re.sub(r'```json\s*', '', text)
        text = re.sub(r'```\s*', '', text)
        
        # Remove any extra text before/after JSON
        text = text.strip()
        
        # Find the JSON array
        start_idx = text.find('[')
        end_idx = text.rfind(']') + 1
        
        if start_idx != -1 and end_idx != -1:
            text = text[start_idx:end_idx]
        
        return text
    
    def _validate_risk_level(self, risk: str) -> str:
        """Validate and standardize risk level"""
        risk_lower = risk.lower().strip()
        if risk_lower in ['high', 'medium', 'low']:
            return risk_lower.capitalize()
        return "Medium"  # Default fallback
    
    def _fallback_text_parsing(self, response_text: str) -> List[Dict[str, Any]]:
        """Fallback parsing when JSON parsing fails"""
        try:
            # Simple text-based extraction
            clauses = []
            
            # Split by common clause indicators
            sections = re.split(r'\n\s*(?=\d+\.|\*|\-)', response_text)
            
            for i, section in enumerate(sections):
                if len(section.strip()) > 50:  # Only process substantial sections
                    clause_analysis = {
                        "clause": section[:500] + "..." if len(section) > 500 else section,
                        "risk": "Medium",  # Default risk
                        "laws": "General contract law principles",
                        "summary": f"Clause analysis extracted from section {i+1}",
                        "analyzed_at": datetime.now().isoformat(),
                        "confidence": "medium"
                    }
                    clauses.append(clause_analysis)
            
            return clauses[:10]  # Limit to 10 clauses
            
        except Exception as e:
            logger.error(f"Fallback parsing error: {str(e)}")
            return self._create_error_response(f"Fallback parsing failed: {str(e)}")
    
    def _create_error_response(self, error_message: str) -> List[Dict[str, Any]]:
        """Create error response in expected format"""
        return [{
            "clause": "Error in document analysis",
            "risk": "High",
            "laws": "Unable to determine applicable laws due to analysis error",
            "summary": f"Analysis failed: {error_message}. Please try again with a different document or contact support.",
            "analyzed_at": datetime.now().isoformat(),
            "confidence": "low",
            "error": True
        }]
    
    def analyze_specific_clause(self, clause_text: str, context: str = "") -> Dict[str, Any]:
        """
        Analyze a specific clause in detail
        
        Args:
            clause_text: The specific clause to analyze
            context: Additional context about the document
            
        Returns:
            Detailed analysis of the specific clause
        """
        prompt = f"""
Analyze this specific legal clause in detail:

CLAUSE: {clause_text}

CONTEXT: {context}

Provide detailed analysis in this exact JSON format:
{{
  "clause": "The full clause text",
  "risk": "High|Medium|Low",
  "laws": "Specific laws, regulations, or legal principles that apply",
  "summary": "Comprehensive analysis including interpretation, risks, benefits, and recommendations"
}}

Focus on practical implications and actionable insights.
"""
        
        try:
            response = self.model.generate_content(prompt)
            return self._parse_single_clause_response(response.text)
        except Exception as e:
            return self._create_error_response(str(e))[0]
    
    def _parse_single_clause_response(self, response_text: str) -> Dict[str, Any]:
        """Parse response for single clause analysis"""
        try:
            cleaned_text = self._clean_response_text(response_text)
            clause_data = json.loads(cleaned_text)
            
            return {
                "clause": clause_data.get("clause", ""),
                "risk": self._validate_risk_level(clause_data.get("risk", "Medium")),
                "laws": clause_data.get("laws", "General legal principles"),
                "summary": clause_data.get("summary", "Analysis not available"),
                "analyzed_at": datetime.now().isoformat(),
                "confidence": "high"
            }
        except Exception as e:
            return self._create_error_response(str(e))[0]

# Example usage and testing
if __name__ == "__main__":
    # Test the service (you'll need to provide your API key)
    API_KEY = "your-gemini-api-key-here"
    
    if API_KEY != "your-gemini-api-key-here":
        analyzer = GeminiLegalAnalyzer(API_KEY)
        
        sample_contract = """
        This Agreement shall commence on the Effective Date and shall continue for a period of one (1) year, 
        unless terminated earlier in accordance with the terms hereof. Either party may terminate this Agreement 
        at any time with thirty (30) days' written notice to the other party.
        
        The Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
        arising out of or relating to this Agreement, regardless of the theory of liability.
        """
        
        results = analyzer.analyze_legal_document(sample_contract, "service_agreement")
        print(json.dumps(results, indent=2))
