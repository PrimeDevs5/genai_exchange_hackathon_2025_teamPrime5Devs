# Legal AI Analysis API - ServerSide

A ultra-simplified FastAPI server that provides AI-powered legal document analysis using Google Gemini AI. This API extracts text from PDF documents and performs detailed legal clause analysis with risk assessment.

## 🎯 Overview

This server provides a clean, stateless API for legal document analysis:
- **PDF Upload** → **Text Extraction** → **AI Analysis** → **Detailed Results**

## 🚀 Features

- **📄 PDF Text Extraction**: Advanced OCR with table filtering
- **🤖 AI Legal Analysis**: Powered by Google Gemini AI
- **⚖️ Risk Assessment**: High/Medium/Low risk classification
- **📋 Clause Analysis**: Detailed breakdown of legal provisions
- **🎯 Law Citations**: Applicable legal principles identification
- **⚡ Fast Processing**: Immediate results without storage overhead

## 📁 Project Structure

```
ServerSide/
├── .env                    # Environment configuration (Gemini API key)
├── api.py                  # Main FastAPI application (2 endpoints)
├── config.py               # Configuration management
├── gemini_service.py       # Google Gemini AI integration
├── requirements.txt        # Python dependencies
├── text_extractor.py       # PDF text extraction with OCR
├── Dockerfile              # Docker configuration for deployment
└── README.md              # This documentation
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8+
- Google Gemini API Key
- Tesseract OCR (for PDF text extraction)

### 1. Clone Repository
```bash
git clone <repository-url>
cd ServerSide
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Create a `.env` file:
```env
GEMINI_API_KEY=your-actual-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-flash
```

### 4. Install Tesseract OCR

**Windows:**
```bash
# Download and install from: https://github.com/UB-Mannheim/tesseract/wiki
# Add to PATH: C:\Program Files\Tesseract-OCR
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

**macOS:**
```bash
brew install tesseract
```

### 5. Run Server
```bash
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

## 🌐 API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "Legal AI Analysis API is operational",
  "timestamp": "2025-09-21T20:30:00",
  "ai_enabled": true,
  "version": "3.0.0"
}
```

### Legal Document Analysis
```http
POST /analyze-legal-document
Content-Type: multipart/form-data
```

**Request:**
- `files`: PDF file(s) to analyze

**Response:**
```json
{
  "status": "completed",
  "message": "Successfully analyzed 1 legal documents",
  "files": ["contract.pdf"],
  "total_documents": 1,
  "total_clauses_analyzed": 5,
  "legal_analysis": [
    {
      "clause": "Party agrees to pay liquidated damages of $10,000",
      "risk": "High",
      "laws": "Contract law principles regarding liquidated damages; UCC Article 2 for sales contracts",
      "summary": "This clause creates high risk due to significant financial exposure. Liquidated damages must be reasonable and proportionate to actual harm..."
    },
    {
      "clause": "Termination may occur upon 30 days written notice",
      "risk": "Medium", 
      "laws": "Contract law principles regarding termination; employment law if applicable",
      "summary": "Standard termination clause with reasonable notice period. Medium risk due to potential business disruption..."
    }
  ],
  "analyzed_at": "2025-09-21T20:30:00"
}
```

## 🔗 Integration Guide

### Frontend Integration
```javascript
// Simple file upload
const formData = new FormData();
formData.append('files', pdfFile);

fetch('http://localhost:8000/analyze-legal-document', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    // Process legal analysis results
    console.log(data.legal_analysis);
});
```

### cURL Example
```bash
curl -X POST "http://localhost:8000/analyze-legal-document" \
  -F "files=@contract.pdf" \
  -H "accept: application/json"
```

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t legal-ai-api .
```

### Run Container
```bash
docker run -p 8000:8000 -e GEMINI_API_KEY=your-key legal-ai-api
```

## ☁️ Deploy on Render

1. **Connect Repository** to Render
2. **Service Type**: Web Service
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `GEMINI_MODEL`: `gemini-1.5-flash`

## 📊 Response Format Details

The API returns legal analysis in this exact format:

```json
{
  "clause": "Specific legal clause text",
  "risk": "High/Medium/Low",
  "laws": "Applicable legal principles and statutes",
  "summary": "Detailed analysis with recommendations"
}
```

### Risk Levels
- **High**: Significant legal or financial exposure
- **Medium**: Moderate risk requiring attention  
- **Low**: Minor risk or standard language

## 🔍 Technical Details

### Text Extraction Process
1. **PDF → Images**: Convert PDF pages to high-resolution images
2. **OCR Processing**: Extract text using Tesseract OCR
3. **Table Filtering**: Remove structured data/tables for cleaner text
4. **Multi-threading**: Parallel processing for faster extraction

### AI Analysis Pipeline
1. **Text Preprocessing**: Clean and structure extracted text
2. **Gemini AI Analysis**: Send to Google Gemini for legal analysis
3. **Response Parsing**: Convert AI response to structured format
4. **Risk Assessment**: Automatic risk level classification

## 🚨 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid file format or missing files
- **503 Service Unavailable**: Gemini AI not configured
- **500 Internal Server Error**: Processing failures

## 📈 Performance

- **Processing Time**: ~10-30 seconds per document (depending on size)
- **File Size Limit**: No explicit limit (memory dependent)
- **Concurrent Requests**: Supports multiple simultaneous uploads
- **Memory Usage**: Temporary files cleaned automatically

## 🔒 Security Notes

- **Stateless Design**: No data persistence or user tracking
- **Temporary Storage**: Files deleted immediately after processing
- **API Key Security**: Store Gemini API key in environment variables
- **CORS Enabled**: Configure origins as needed for production

## 🛠️ Development

### Running Tests
```bash
# Test Gemini AI connection
python -c "from gemini_service import GeminiLegalAnalyzer; from config import settings; analyzer = GeminiLegalAnalyzer(settings.GEMINI_API_KEY); print('✅ Gemini AI working')"

# Test text extraction
python -c "from text_extractor import extract_text_fast; print('✅ Text extractor ready')"
```

### Debug Mode
```bash
uvicorn api:app --reload --log-level debug
```

## 📝 Dependencies

See `requirements.txt` for complete list. Key dependencies:
- **FastAPI**: Web framework
- **PyMuPDF**: PDF processing
- **Pytesseract**: OCR text extraction
- **Google Generative AI**: Gemini AI integration
- **OpenCV**: Image processing

## 🆘 Troubleshooting

### Common Issues

**Tesseract not found:**
```bash
# Ensure Tesseract is in PATH
tesseract --version
```

**Gemini API errors:**
- Verify API key is correct
- Check quota/billing in Google Cloud Console
- Ensure Gemini API is enabled

**PDF processing failures:**
- Check file is valid PDF
- Ensure sufficient disk space for temporary files
- Verify PyMuPDF installation

## 📄 License

[Add your license information here]

## 👥 Contributing

[Add contribution guidelines here]

## 📞 Support

For issues and questions:
- Create GitHub issues for bugs
- Check logs for detailed error messages
- Verify environment configuration

---

**Ready to analyze legal documents with AI!** 🚀⚖️🤖
