# Adobe Hackathon Challenge 1B - Approach Explanation

## Methodology Overview

Our solution implements a **persona-driven document intelligence system** that analyzes PDF collections and extracts the most relevant sections based on user personas and their specific job-to-be-done requirements.

## Core Architecture

### 1. **Multi-Stage PDF Processing Pipeline**
- **Text Extraction**: Advanced OCR with table detection and removal using OpenCV and Tesseract
- **Section Detection**: Font-based heading extraction and semantic section identification  
- **Page-aware Processing**: Maintains document structure and page number associations

### 2. **Persona Intelligence Engine**
- **Keyword Mapping**: Pre-built domain-specific keyword sets for 15+ persona types (researchers, travel planners, business analysts, etc.)
- **Task Analysis**: NLP-based extraction of action verbs and requirements from job descriptions
- **Weighted Scoring**: Dynamic keyword weighting based on persona-task intersection

### 3. **Relevance Scoring Algorithm**
Our multi-factor scoring system evaluates sections using:
- **Keyword Overlap (40%)**: TF-IDF weighted matching against persona/task keywords
- **Title Relevance (25%)**: Section headers often indicate content focus
- **Position Weight (20%)**: Earlier sections typically contain overview information
- **Content Quality (15%)**: Optimal length and structure indicators

### 4. **Subsection Extraction & Refinement**
- **Intelligent Chunking**: Paragraph-level extraction with sentence-boundary awareness
- **Diversity Filtering**: Prevents redundant content through overlap detection
- **Length Optimization**: Balances comprehensiveness with conciseness (50-500 words)

## Technical Implementation

### **Constraint Compliance**
- **CPU-Only Processing**: Utilizes scikit-learn TF-IDF and rule-based NLP (no GPU required)
- **Model Size**: Lightweight approach with <100MB total footprint
- **Processing Speed**: Multi-threaded PDF processing + optimized algorithms target <60s for 5 documents
- **Offline Operation**: All dependencies pre-packaged in Docker container

### **Scalability Features**
- **Collection Auto-Discovery**: Automatically processes multiple collection folders
- **Batch Processing**: Handles n collections with consistent output format
- **Error Resilience**: Graceful handling of corrupted PDFs or missing files

## Quality Assurance

### **Section Relevance (60 points)**
- Domain-specific keyword libraries ensure high precision
- Multi-factor scoring prevents over-reliance on single metrics
- Position-aware ranking captures document importance patterns

### **Subsection Relevance (40 points)**
- Granular paragraph-level analysis
- Semantic coherence preservation
- Diversity enforcement for comprehensive coverage

## Innovation Highlights

1. **Adaptive Persona Mapping**: Flexible keyword extraction handles diverse persona descriptions
2. **Hybrid Scoring**: Combines rule-based matching with TF-IDF similarity for robust relevance assessment  
3. **Structure Preservation**: Maintains document hierarchy and page references throughout processing
4. **Quality Filtering**: Multi-stage validation ensures output relevance and readability

This approach delivers accurate, persona-aligned document analysis while meeting all technical constraints and performance requirements.
