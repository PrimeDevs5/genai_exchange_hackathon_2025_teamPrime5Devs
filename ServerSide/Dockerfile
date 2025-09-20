# Simplified Dockerfile for Render deployment
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV API_HOST=0.0.0.0
ENV PORT=8000
ENV DEBUG=false
ENV OPENCV_IO_ENABLE_OPENEXR=0

# Install minimal system dependencies for headless OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    libglib2.0-0 \
    libgomp1 \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Download NLTK data in separate steps for better caching
RUN python -c "import nltk; nltk.download('punkt', quiet=True)" || echo "punkt download failed"
RUN python -c "import nltk; nltk.download('stopwords', quiet=True)" || echo "stopwords download failed"
RUN python -c "import nltk; nltk.download('wordnet', quiet=True)" || echo "wordnet download failed"

# Copy application code
COPY *.py ./
COPY *.yaml ./
COPY *.yml ./
COPY Collections/ ./Collections/

# Create necessary directories
RUN mkdir -p uploads temp output logs

# Expose port (dynamic from environment)
EXPOSE $PORT

# Health check (dynamic port)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

# Run the application (use PORT environment variable)
CMD ["sh", "-c", "python -m uvicorn api_simple:app --host 0.0.0.0 --port $PORT"]
