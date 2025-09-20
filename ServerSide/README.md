# PDF Document Intelligence System
## Persona-Driven Document Analysis with Web API

### 🎯 **Overview**
This system provides both CLI and Web API interfaces for intelligent document analysis that extracts and prioritizes the most relevant sections from PDF collections based on specific personas and their job-to-be-done requirements.

**NEW**: 🌐 **Web API Support** - Upload PDFs and get analysis results via REST API endpoints!

---

## 📋 **Table of Contents**
1. [Features](#features)
2. [Quick Start](#quick-start)
3. [Installation & Usage](#installation--usage)
4. [API Usage](#api-usage)
5. [File Structure](#file-structure)
6. [Docker Deployment](#docker-deployment)
7. [Original Challenge Info](#original-challenge-info)

---

## 🚀 **Features**

### Core Functionality
- **Persona-Driven Analysis**: Extracts sections most relevant to specific user personas
- **Multi-PDF Processing**: Handles collections of 3-10 related PDFs
- **Intelligent Section Ranking**: Uses NLP to rank sections by importance
- **Fast Processing**: Optimized for ≤60 seconds processing time
- **CPU-Only**: No GPU required, works on any machine

### New Web API Features
- **File Upload**: Upload PDFs via web interface
- **Asynchronous Processing**: Background job processing with status tracking
- **RESTful API**: Complete REST API with OpenAPI/Swagger documentation
- **Multiple Modes**: Both CLI and web API modes available
- **Docker Support**: Easy deployment with Docker containers

---

## � **Quick Start**

### Option 1: Web API Mode (Recommended)
```bash
# Install dependencies
pip install -r requirements.txt

# Start API server
python main.py --api
# Or use: ./start_api.sh (Linux/Mac) or start_api.bat (Windows)

# API will be available at http://localhost:8000
# Interactive docs at http://localhost:8000/docs
```

### Option 2: CLI Mode (Original)
```bash
# Install dependencies
pip install -r requirements.txt

# Run CLI processing
python main.py
# Or use: ./start_cli.sh (Linux/Mac) or start_cli.bat (Windows)
```

### Option 3: Docker Deployment
```bash
# API Mode (default)
docker-compose up pdf-intelligence-api

# CLI Mode
docker-compose --profile cli up pdf-intelligence-cli
```

---

## 🌐 **API Usage**

### Upload and Process PDFs
```bash
curl -X POST "http://localhost:8000/upload-pdfs" \
  -F "files=@document1.pdf" \
  -F "files=@document2.pdf" \
  -F "persona=College student planning a trip with friends" \
  -F "job_to_be_done=Plan a 5-day trip to South of France"
```

### Check Processing Status
```bash
curl "http://localhost:8000/job/{job_id}"
```

### Get Results
```bash
curl "http://localhost:8000/job/{job_id}/result"
```

### Interactive Documentation
Visit `http://localhost:8000/docs` for complete API documentation with interactive testing.

📖 **Full API Documentation**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🎯 **Problem Statement**

**Input:** 
- Document Collection: 3-10 related PDFs
- Persona Definition: Role description with specific expertise areas
- Job-to-be-Done: Concrete task the persona needs to accomplish

**Output:** JSON structure containing:
- Metadata (documents, persona, task, timestamp)
- Extracted sections ranked by importance
- Refined subsection analysis with relevant text

**Constraints:**
- CPU-only processing
- Model size ≤ 1GB
- Processing time ≤ 60 seconds
- No internet access during execution

---

## 🏗️ **Solution Architecture**

### **Core Components**

1. **Text Extractor** (`text_extractor.py`)
   - Advanced OCR with table detection/removal
   - Multi-threaded page processing
   - Page-aware text extraction

2. **Section Extractor** (`section_extractor.py`)
   - Font-based heading detection
   - Semantic section identification
   - Document structure preservation

3. **Persona Analyzer** (`persona_analyzer.py`)
   - Domain-specific keyword mapping
   - Task requirement extraction
   - Weighted relevance scoring

4. **Relevance Scorer** (`relevance_scorer.py`)
   - Multi-factor section scoring
   - TF-IDF similarity calculation
   - Position and quality weighting

5. **Subsection Extractor** (`subsection_extractor.py`)
   - Paragraph-level content extraction
   - Relevance-based filtering
   - Text refinement and optimization

6. **Collection Processor** (`main.py`)
   - Auto-discovery of collections
   - Batch processing orchestration
   - Output generation and validation

---

## 🚀 **Installation & Usage**

### **Setup Options**

#### **Option 1: Docker (Recommended)**
```bash
# Build the Docker image
docker build --platform linux/amd64 -t adobe-challenge-1b:teamDSA .


# put the sample collections into the Collection folder (check Troubleshooting if you face any issue)

# Run the container with volume mounts
docker run --rm \
  -v $(pwd)/Collections:/app/Collections \
  --network none \
  adobe-challenge-1b:teamDSA


# review the output.json files
```

#### **Option 2: Local Setup**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install system dependencies (Ubuntu/Debian)
sudo apt-get install tesseract-ocr tesseract-ocr-eng

# Run the application
python3 main.py
```

---

## 📁 **File Structure**

```
Adobe_India_Hackathon_25_Team_DSA_Challenge_1b/
├── main.py                     # Main collection processor
├── text_extractor.py           # PDF text extraction with OCR
├── heading_extractor.py        # Document heading detection
├── persona_analyzer.py         # Persona and task analysis
├── relevance_scorer.py         # Multi-factor relevance scoring
├── subsection_extractor.py     # Subsection extraction and refinement
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container configuration
├── docker-compose.yml          # Multi-container setup
├── README.md                   # This file
├── approach_explanation.md     # Detailed methodology documentation
└── Collections/                # Collections folder
    └── Collection N/           # Individual collection folders
        ├── challenge1b_input.json  # Input specification (REQUIRED NAME)
        ├── PDFs/               # Source documents folder
        │   ├── document1.pdf
        │   └── document2.pdf
        └── challenge1b_output.json # Generated results
```

**⚠️ Important File Naming:**
- Input file MUST be named: `challenge1b_input.json`
- PDFs should be placed in a `PDFs/` or `PDFs` folder
- Output will be generated as: `challenge1b_output.json`

---

## 📝 **Input/Output Format**

### **Input Structure** (`challenge1b_input.json`)
```json
{
    "challenge_info": {
        "challenge_id": "round_1b_002",
        "test_case_name": "travel_planner",
        "description": "France Travel"
    },
    "documents": [
        {
            "filename": "South of France - Cities.pdf",
            "title": "South of France - Cities"
        }
    ],
    "persona": {
        "role": "Travel Planner"
    },
    "job_to_be_done": {
        "task": "Plan a trip of 4 days for a group of 10 college friends."
    }
}
```

### **Output Structure** (`challenge1b_output.json`)
```json
{
    "metadata": {
        "input_documents": ["document1.pdf", "document2.pdf"],
        "persona": "Travel Planner",
        "job_to_be_done": "Plan a trip of 4 days for a group of 10 college friends.",
        "processing_timestamp": "2025-07-10T15:31:22.632389"
    },
    "extracted_sections": [
        {
            "document": "document1.pdf",
            "section_title": "Section Title",
            "importance_rank": 1,
            "page_number": 1
        }
    ],
    "subsection_analysis": [
        {
            "document": "document1.pdf",
            "refined_text": "Extracted and refined text content...",
            "page_number": 1
        }
    ]
}
```

---

## ⚡ **Performance Specifications**

### **Processing Capabilities**
- **Document Capacity**: 3-10 PDFs per collection
- **Page Limit**: Up to 50 pages per document
- **File Size**: Supports up to 100MB PDFs
- **Collection Processing**: Unlimited collections

### **Performance Metrics**
- **Processing Speed**: <60 seconds for 5 documents
- **Memory Usage**: <4GB RAM
- **Model Size**: <1GB total footprint
- **CPU Utilization**: Multi-threaded optimization

### **Quality Assurance**
- **Section Relevance**: Multi-factor scoring algorithm
- **Subsection Quality**: Semantic coherence preservation
- **Output Consistency**: Standardized JSON format
- **Error Handling**: Graceful degradation for corrupted files

---

## 🐳 **Docker Deployment**

### **Container Specifications**


## 🔧 **Troubleshooting**

### **Common Issues**

#### **File Naming Errors**
```
❌ Error: "Input file found but with incorrect name: 'challenge1b_input .json'"
✅ Solution: Rename file to 'challenge1b_input.json' (remove extra space)

❌ Error: "No input.json file found. Required name: 'challenge1b_input.json'"
✅ Solution: Ensure input file is named exactly 'challenge1b_input.json'
```

#### **Folder Structure Issues**
```
❌ Error: "No PDF/PDFs folder found"
✅ Solution: Create 'PDFs' folder and place all PDF files inside it

❌ Error: "No collections found!"
✅ Solution: Ensure collections are in 'Collections' folder or named 'Collection X'
```

#### **Docker Issues**
```bash
# Fix permission issues
sudo chmod -R 755 Collections/

# Rebuild if dependencies changed
docker build --no-cache -t adobe-challenge-1b:teamDSA .
```

---

## 🔧 **Configuration & Customization**


### **Relevance Tuning**
Adjust scoring weights in `relevance_scorer.py`:
```python
total_score = (
    keyword_score * 0.4 +     # Keyword matching weight
    title_score * 0.25 +      # Title relevance weight
    position_score * 0.2 +    # Position importance weight
    length_score * 0.15       # Content quality weight
)
```

### **Output Customization**
Modify output format in `main.py` collection processor.

---

## 📊 **Testing & Validation**

### **Test Collections**
The system includes sample collections for validation:
- Travel planning scenario
- Academic research context
- Business analysis use case

### **Validation Metrics**
- Section relevance accuracy
- Subsection quality assessment
- Processing time compliance
- Memory usage monitoring

---

## 🤝 **Team Information**

**Team:** DSA (Devraj, Saksham, and Anuj)  
**Challenge:** Round 1B - Persona-Driven Document Intelligence  
**Theme:** "Connect What Matters — For the User Who Matters"

**Key Features:**
- ✅ Multi-persona support
- ✅ Intelligent section ranking with multi-factor scoring
- ✅ Advanced OCR with table detection
- ✅ Subsection extraction and refinement
- ✅ Docker containerization for reproducible deployment
- ✅ CPU-only processing for broad compatibility
- ✅ Offline operation with pre-packaged models

---


## 📄 **License & Usage**

This solution is developed for the Adobe India Hackathon 2025. All code and documentation are provided for evaluation purposes.

For questions or technical support, please refer to the approach_explanation.md for detailed methodology information.

<img width="1780" height="624" alt="image" src="https://github.com/user-attachments/assets/84e24c34-b27e-40a0-99d5-4e02e9868d0b" />
<img width="1864" height="651" alt="image" src="https://github.com/user-attachments/assets/6e615c21-b266-4778-ad26-8b93aab8da31" />



