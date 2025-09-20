"""
Simplified and robust FastAPI web service for Legal Document Intelligence
"""

import os
import json
import uuid
import shutil
import tempfile
import traceback
from datetime import datetime
from typing import List

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Import our processing modules
from main import CollectionProcessor

# Initialize FastAPI app
app = FastAPI(
    title="Legal Document Intelligence API",
    description="Upload legal PDFs and get AI-powered legal document analysis",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global processor instance
processor = CollectionProcessor()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Legal Document Intelligence API",
        "status": "healthy",
        "version": "1.0.0",
        "analysis_type": "Legal Document Analysis",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "processor_ready": processor is not None
    }

@app.post("/analyze-legal-documents")
async def analyze_legal_documents(files: List[UploadFile] = File(...)):
    """
    Analyze legal documents and return results immediately
    
    Args:
        files: List of PDF files to analyze
        
    Returns:
        Legal document analysis results in JSON format
    """
    
    # Validate files
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    # Check file types
    for file in files:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=400, 
                detail=f"File {file.filename} is not a PDF"
            )
    
    temp_dir = None
    
    try:
        print(f"📄 Processing {len(files)} legal documents...")
        
        # Create temporary directory
        temp_dir = tempfile.mkdtemp(prefix="legal_analysis_")
        pdfs_dir = os.path.join(temp_dir, "PDFs")
        os.makedirs(pdfs_dir, exist_ok=True)
        
        print(f"📁 Created temp directory: {temp_dir}")
        
        # Save uploaded files
        saved_files = []
        for i, file in enumerate(files):
            try:
                print(f"💾 Saving file {i+1}/{len(files)}: {file.filename}")
                
                # Read file content
                content = await file.read()
                
                # Save to temp directory
                file_path = os.path.join(pdfs_dir, file.filename)
                with open(file_path, 'wb') as f:
                    f.write(content)
                
                saved_files.append(file.filename)
                print(f"✅ Saved: {file.filename} ({len(content)} bytes)")
                
            except Exception as e:
                print(f"❌ Error saving file {file.filename}: {e}")
                raise HTTPException(status_code=500, detail=f"Failed to save file {file.filename}: {str(e)}")
        
        # Create input JSON for legal analysis
        input_data = {
            "persona": "Legal Document Analyst",
            "job_to_be_done": "Legal analysis of the document including key provisions, obligations, rights, risks, and important clauses"
        }
        
        input_file = os.path.join(temp_dir, "challenge1b_input.json")
        with open(input_file, 'w') as f:
            json.dump(input_data, f, indent=2)
        
        print(f"📝 Created input file: {input_file}")
        
        # Process the documents
        print("🔄 Starting document analysis...")
        result = processor.process_collection(temp_dir)
        
        # Check for errors
        if isinstance(result, dict) and "error" in result:
            print(f"❌ Processing error: {result['error']}")
            raise HTTPException(status_code=500, detail=f"Analysis failed: {result['error']}")
        
        print("✅ Analysis completed successfully!")
        
        # Add processing metadata
        if isinstance(result, dict):
            result["processing_info"] = {
                "files_processed": saved_files,
                "total_files": len(files),
                "analysis_type": "Legal Document Analysis",
                "processed_at": datetime.now().isoformat()
            }
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        error_details = traceback.format_exc()
        print(f"❌ Unexpected error: {e}")
        print(f"Full traceback: {error_details}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
        
    finally:
        # Cleanup temporary files
        if temp_dir and os.path.exists(temp_dir):
            try:
                shutil.rmtree(temp_dir)
                print(f"🧹 Cleaned up temp directory: {temp_dir}")
            except Exception as e:
                print(f"⚠️ Warning: Could not clean up temp directory: {e}")

@app.post("/test-processor")
async def test_processor():
    """Test if the processor is working with existing collection"""
    try:
        # Test with existing collection
        collections_dir = "Collections"
        if os.path.exists(collections_dir):
            collection_dirs = [d for d in os.listdir(collections_dir) if os.path.isdir(os.path.join(collections_dir, d))]
            if collection_dirs:
                test_collection = os.path.join(collections_dir, collection_dirs[0])
                print(f"🧪 Testing with collection: {test_collection}")
                
                result = processor.process_collection(test_collection)
                
                return {
                    "test_status": "success",
                    "test_collection": test_collection,
                    "result_type": type(result).__name__,
                    "has_metadata": "metadata" in result if isinstance(result, dict) else False,
                    "has_extracted_sections": "extracted_sections" in result if isinstance(result, dict) else False,
                    "timestamp": datetime.now().isoformat()
                }
            else:
                return {"test_status": "no_collections_found"}
        else:
            return {"test_status": "collections_directory_not_found"}
            
    except Exception as e:
        error_details = traceback.format_exc()
        print(f"❌ Test error: {e}")
        print(f"Full traceback: {error_details}")
        return {
            "test_status": "failed",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Legal Document Intelligence API...")
    uvicorn.run(
        "api_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
