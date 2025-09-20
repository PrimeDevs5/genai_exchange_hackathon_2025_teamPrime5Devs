# Deployment Guide

## Prerequisites
- Python 3.9+ 
- Docker (optional, for containerized deployment)
- At least 4GB RAM recommended
- 2GB disk space for models and temporary files

## Installation Options

### Option 1: Local Development Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Optional Dependencies** (for full functionality):
   ```bash
   # For OCR support
   sudo apt-get install tesseract-ocr  # Linux
   brew install tesseract              # macOS
   
   # NLTK data
   python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
   ```

3. **Create Environment File** (optional):
   ```bash
   cp .env.template .env
   # Edit .env with your settings
   ```

### Option 2: Docker Deployment

1. **Build and Run API Server**:
   ```bash
   docker-compose up pdf-intelligence-api
   ```

2. **Run CLI Mode**:
   ```bash
   docker-compose --profile cli up pdf-intelligence-cli
   ```

## Usage

### CLI Mode (Original Functionality)
Process existing collections with personas and tasks:

```bash
# Direct execution
python main.py

# Using scripts
./start_cli.sh       # Linux/Mac
start_cli.bat        # Windows
```

### API Mode (New Web Interface)
Start the web server for file uploads and API access:

```bash
# Direct execution
python main.py --api

# Using scripts
./start_api.sh       # Linux/Mac
start_api.bat        # Windows

# API will be available at:
# - Main API: http://localhost:8000
# - Documentation: http://localhost:8000/docs
# - ReDoc: http://localhost:8000/redoc
```

### Example API Usage

1. **Upload PDFs**:
   ```bash
   curl -X POST "http://localhost:8000/upload-pdfs" \
     -F "files=@document1.pdf" \
     -F "files=@document2.pdf" \
     -F "persona=Business analyst" \
     -F "job_to_be_done=Create quarterly report"
   ```

2. **Check Status**:
   ```bash
   curl "http://localhost:8000/job/{job_id}"
   ```

3. **Get Results**:
   ```bash
   curl "http://localhost:8000/job/{job_id}/result"
   ```

## Directory Structure
```
project/
├── api.py                 # FastAPI web server
├── main.py               # Main CLI and entry point
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── Dockerfile           # Docker container definition
├── docker-compose.yml   # Docker deployment configuration
├── start_*.sh|bat       # Platform-specific startup scripts
├── .env.template        # Environment variables template
├── Collections/         # Input collections (CLI mode)
├── uploads/             # Temporary uploads (API mode)
├── temp/                # Temporary processing files
├── models/              # Cached models
└── output/              # Processing results
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| API_HOST | 0.0.0.0 | API server host |
| API_PORT | 8000 | API server port |
| DEBUG | false | Enable debug mode |
| MAX_FILE_SIZE | 50000000 | Max upload size (50MB) |
| MAX_CONCURRENT_JOBS | 5 | Max simultaneous jobs |
| CLEANUP_TEMP_FILES | true | Auto-cleanup temp files |

## Production Deployment

### Using Docker Compose
```bash
# Production deployment
docker-compose up -d pdf-intelligence-api

# Scale for high availability
docker-compose up -d --scale pdf-intelligence-api=3
```

### Using Systemd (Linux)
Create `/etc/systemd/system/pdf-intelligence.service`:
```ini
[Unit]
Description=PDF Intelligence API
After=network.target

[Service]
Type=simple
User=pdf-user
WorkingDirectory=/path/to/project
ExecStart=/path/to/python main.py --api
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable pdf-intelligence
sudo systemctl start pdf-intelligence
```

### Reverse Proxy with Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # For file uploads
        client_max_body_size 50M;
    }
}
```

## Monitoring and Logs

### Health Checks
- Basic: `GET /health`
- Status: Monitor active jobs and system health

### Performance Monitoring
- Processing time: Available in job results
- Memory usage: Monitor Docker containers
- API response times: Use APM tools

### Troubleshooting

1. **Import Errors**: Install missing dependencies
   ```bash
   pip install -r requirements.txt
   ```

2. **Memory Issues**: Reduce concurrent jobs
   ```bash
   export MAX_CONCURRENT_JOBS=2
   ```

3. **File Upload Issues**: Check file size limits
   ```bash
   export MAX_FILE_SIZE=100000000  # 100MB
   ```

4. **Model Loading Issues**: Check disk space and permissions
   ```bash
   mkdir -p models uploads temp
   chmod 755 models uploads temp
   ```

## Security Considerations

### For Production
- Add authentication (API keys, OAuth)
- Use HTTPS with SSL certificates
- Implement rate limiting
- Add input validation and sanitization
- Use read-only file systems where possible
- Regular security updates

### Example Security Headers
```python
# Add to FastAPI app
from fastapi.middleware.security import SecurityMiddleware

app.add_middleware(
    SecurityMiddleware,
    headers={
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block"
    }
)
```

## Backup and Recovery
- Regular backups of Collections/ directory
- Database backups (if using persistent storage)
- Configuration file backups
- Model cache backups for faster startup
