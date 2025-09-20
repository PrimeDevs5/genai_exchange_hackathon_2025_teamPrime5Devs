# 🧪 **Local Testing Guide**

## Quick Setup & Test Commands

### **Prerequisites Check**
```bash
cd /d/GEN_AI_EXCHANGE_HACKATHON_25_TEAM_PRIME5DEVS
python --version  # Should be 3.9+
```

### **1. Test CLI Mode (Batch Processing)**
```bash
# Process existing collections
python main.py

# Expected output:
# 🚀 Starting collection processing...
# 📂 Found 3 collection(s) to process
# ✅ Completed processing
```

### **2. Test API Mode (Web Server)**
```bash
# Start API server
python main.py --api

# Expected output:
# 🌐 Starting API server mode...
# INFO: Uvicorn running on http://0.0.0.0:8000
```

**Then test in another terminal/browser:**
```bash
# Test health check
curl http://localhost:8000/

# Or open in browser:
# http://localhost:8000
# http://localhost:8000/docs  (Interactive API docs)
```

### **3. Test PDF Upload (API Mode)**

**Step 1:** Start API server
```bash
python main.py --api
```

**Step 2:** In another terminal, test upload
```bash
# Create a test upload (using existing PDF)
curl -X POST "http://localhost:8000/upload-pdfs" \
  -F "files=@Collections/Collection 1/PDFs/South of France - Cities.pdf" \
  -F "persona=College student planning vacation" \
  -F "job_to_be_done=Plan 5-day trip with friends"
```

**Step 3:** Check job status
```bash
# Use job_id from previous response
curl "http://localhost:8000/job/{job_id}"
```

### **4. Using Startup Scripts**

**Windows:**
```cmd
start_cli.bat    # CLI mode
start_api.bat    # API mode
```

**Linux/Mac:**
```bash
./start_cli.sh   # CLI mode
./start_api.sh   # API mode
```

### **5. Docker Testing (Optional)**
```bash
# Build and run API
docker-compose up pdf-intelligence-api

# Test CLI in Docker
docker-compose --profile cli up pdf-intelligence-cli
```

## 🎯 **What to Expect**

### **CLI Mode Success:**
- Processes all collections in Collections/ folder
- Generates challenge1b_output.json in each collection
- Shows processing time and success/failure count

### **API Mode Success:**
- Server starts on http://localhost:8000
- Interactive docs available at http://localhost:8000/docs
- Health check returns JSON response
- File uploads create background jobs

### **Common Test Scenarios:**

1. **Upload single PDF:**
   ```bash
   curl -X POST "http://localhost:8000/upload-pdfs" \
     -F "files=@path/to/document.pdf" \
     -F "persona=Data analyst" \
     -F "job_to_be_done=Extract key insights"
   ```

2. **Upload multiple PDFs:**
   ```bash
   curl -X POST "http://localhost:8000/upload-pdfs" \
     -F "files=@doc1.pdf" \
     -F "files=@doc2.pdf" \
     -F "persona=Marketing manager" \
     -F "job_to_be_done=Create campaign strategy"
   ```

3. **Process existing collection:**
   ```bash
   curl -X POST "http://localhost:8000/process-collection" \
     -d "collection_path=/app/Collections/Collection 1"
   ```

## 🔧 **Troubleshooting**

### **If imports fail:**
```bash
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### **If API won't start:**
- Check if port 8000 is available
- Try different port: `export API_PORT=8001`

### **If file uploads fail:**
- Check file size (max 50MB by default)
- Ensure file is PDF format
- Check upload directory permissions

### **Performance Notes:**
- First run may be slower (downloading models)
- Processing time depends on PDF size and complexity
- CLI mode: ~1-4 minutes per collection
- API mode: Similar processing time per job

## 🚀 **Ready for Demo!**

Your system is now ready for:
- ✅ Live demonstrations
- ✅ Hackathon presentations  
- ✅ Production deployment
- ✅ Further development

**Quick Demo Flow:**
1. Start API: `python main.py --api`
2. Open browser: `http://localhost:8000/docs`
3. Use "Try it out" on `/upload-pdfs` endpoint
4. Upload sample PDFs with persona/task
5. Show real-time job tracking
6. Display results!
