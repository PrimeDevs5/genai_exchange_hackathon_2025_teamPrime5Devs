# Quick Start Guide - Adobe Challenge 1B

## 🚀 Ready to Run!

Your complete persona-driven document intelligence system is now ready. Here's how to use it:

## Option 1: Docker (Recommended) - No Setup Required

### Windows:
```cmd
docker.bat
```

### Linux/Mac:
```bash
chmod +x docker.sh
./docker.sh
```

### Alternative Docker Commands:
```bash
# Build and run manually
docker build -t adobe-challenge-1b .
docker run --rm -v "$(pwd):/app" adobe-challenge-1b

# Or use docker-compose
docker-compose up --build
```

## Option 2: Local Python Execution

### 1. Install Dependencies:
```bash
pip install -r requirements.txt
```

### 2. Install Tesseract OCR:
**Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr tesseract-ocr-eng
```

**Windows:**
- Download from: https://github.com/UB-Mannheim/tesseract/wiki
- Add to PATH

**macOS:**
```bash
brew install tesseract
```

### 3. Test Setup:
```bash
python test_setup.py
```

### 4. Run Analysis:
```bash
python main.py
```

## 📁 Collection Structure

Ensure your collections follow this structure:
```
Collection N/
├── challenge1b_input.json  # Input with persona & task
├── PDFs/                   # Folder with PDF files
│   ├── document1.pdf
│   └── document2.pdf
└── output.json            # Generated results (auto-created)
```

## 📊 Expected Output

The system will:
1. 🔍 Auto-discover all Collection folders
2. 📖 Process PDFs in each collection
3. 🎯 Analyze based on persona & task
4. 📝 Generate ranked sections and subsections
5. 💾 Save results to `output.json` in each collection

## ⏱️ Performance

- **Processing Time**: ~15-45 seconds per collection (5 PDFs)
- **Memory Usage**: ~2-4GB during processing
- **Output Quality**: Ranked sections with relevance scores

## 🆘 Troubleshooting

**Common Issues:**

1. **"Docker not found"**: Install Docker Desktop
2. **"Permission denied"**: Run `chmod +x docker.sh` first
3. **"Tesseract not found"**: Install Tesseract OCR (see above)
4. **"Module not found"**: Run `pip install -r requirements.txt`

**Test Your Setup:**
```bash
python test_setup.py
```

## 📝 Input Format Example

Your `challenge1b_input.json` should look like:
```json
{
    "persona": {
        "role": "Travel Planner"
    },
    "job_to_be_done": {
        "task": "Plan a trip of 4 days for a group of 10 college friends."
    },
    "documents": [
        {"filename": "South of France - Cities.pdf"}
    ]
}
```

## 🎯 Ready to Go!

Run the system and check the `output.json` files in each Collection folder for your persona-driven document analysis results!

**Questions?** Check the `README.md` and `approach_explanation.md` for detailed documentation.
