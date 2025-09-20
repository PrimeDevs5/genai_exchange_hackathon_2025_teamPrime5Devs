"""
Configuration settings for the PDF Document Intelligence API
"""

import os
from pathlib import Path

class Settings:
    # API Configuration
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "50000000"))  # 50MB
    ALLOWED_EXTENSIONS: list = [".pdf"]
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    TEMP_DIR: str = os.getenv("TEMP_DIR", "temp")
    
    # Processing Configuration
    MAX_CONCURRENT_JOBS: int = int(os.getenv("MAX_CONCURRENT_JOBS", "5"))
    JOB_TIMEOUT: int = int(os.getenv("JOB_TIMEOUT", "300"))  # 5 minutes
    CLEANUP_TEMP_FILES: bool = os.getenv("CLEANUP_TEMP_FILES", "true").lower() == "true"
    
    # Model Configuration
    MODEL_CACHE_DIR: str = os.getenv("MODEL_CACHE_DIR", "models")
    USE_LIGHTWEIGHT_MODELS: bool = os.getenv("USE_LIGHTWEIGHT_MODELS", "false").lower() == "true"
    
    # Logging Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE: str = os.getenv("LOG_FILE", "api.log")
    
    def __init__(self):
        # Create necessary directories
        Path(self.UPLOAD_DIR).mkdir(exist_ok=True)
        Path(self.TEMP_DIR).mkdir(exist_ok=True)
        Path(self.MODEL_CACHE_DIR).mkdir(exist_ok=True)

# Global settings instance
settings = Settings()
