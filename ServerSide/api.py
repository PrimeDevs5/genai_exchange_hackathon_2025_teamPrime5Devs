"""
FastAPI web service for PDF Document Intelligence
Provides REST API endpoints for uploading PDFs and processing them with persona-driven analysis
"""

import os
import json
import uuid
import shutil
import tempfile
import asyncio
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import aiofiles

# Import our processing modules
from main import CollectionProcessor
from config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Legal Document Intelligence API",
    description="Upload legal PDFs and get AI-powered legal document analysis including key provisions, obligations, rights, and risks",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allowing all origins for easy frontend integration
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global processor instance
processor = CollectionProcessor()

# Storage for processing jobs
processing_jobs = {}

class ProcessingJob:
    def __init__(self, job_id: str, status: str = "pending"):
        self.job_id = job_id
        self.status = status  # pending, processing, completed, failed
        self.result = None
        self.error = None
        self.created_at = datetime.now()
        self.completed_at = None

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
        "active_jobs": len([job for job in processing_jobs.values() if job.status == "processing"]),
        "total_jobs": len(processing_jobs)
    }

@app.post("/process-pdfs-sync")
async def process_pdfs_sync(
    files: List[UploadFile] = File(...)
):
    """
    Process legal PDFs synchronously and return analysis results immediately
    
    Args:
        files: List of PDF files to upload (legal documents)
        
    Returns:
        Direct legal document analysis results in JSON format
    """
    
    # Predefined values for legal document analysis
    persona = "Legal Document Analyst"
    job_to_be_done = "Legal analysis of the document including key provisions, obligations, rights, risks, and important clauses"
    
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
        # Create temporary directory for this processing
        temp_dir = tempfile.mkdtemp(prefix=f"pdf_sync_")
        pdfs_dir = os.path.join(temp_dir, "PDFs")
        os.makedirs(pdfs_dir, exist_ok=True)
        
        # Save uploaded files - sync endpoint
        file_paths = []
        for file in files:
            file_path = os.path.join(pdfs_dir, file.filename)
            # Read file content first to avoid closed file issues
            content = await file.read()
            # Write to disk
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(content)
            file_paths.append(file_path)
        
        # Create input JSON with predefined legal analysis parameters
        input_data = {
            "persona": persona,
            "job_to_be_done": job_to_be_done
        }
        
        input_file = os.path.join(temp_dir, "challenge1b_input.json")
        with open(input_file, 'w') as f:
            json.dump(input_data, f, indent=2)
        
        # Process the collection synchronously
        result = await asyncio.get_event_loop().run_in_executor(
            None,
            processor.process_collection,
            temp_dir
        )
        
        # Return the result directly
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
        
    finally:
        # Cleanup temporary files
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)

@app.post("/upload-pdfs")
async def upload_pdfs(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    """
    Upload multiple legal PDF files for background processing
    
    Args:
        files: List of PDF files to upload (legal documents)
        
    Returns:
        Job ID for tracking legal document analysis status
    """
    
    # Predefined values for legal document analysis
    persona = "Legal Document Analyst"
    job_to_be_done = "Legal analysis of the document including key provisions, obligations, rights, risks, and important clauses"
    
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
    
    # Generate unique job ID
    job_id = str(uuid.uuid4())
    
    # Create job entry
    job = ProcessingJob(job_id)
    processing_jobs[job_id] = job
    
    # Schedule background processing
    background_tasks.add_task(
        process_uploaded_pdfs,
        job_id,
        files
    )
    
    return {
        "job_id": job_id,
        "status": "accepted",
        "message": f"Processing {len(files)} legal PDF files for analysis",
        "files": [file.filename for file in files],
        "analysis_type": "Legal Document Analysis"
    }

@app.get("/job/{job_id}")
async def get_job_status(job_id: str):
    """Get the status of a processing job"""
    
    if job_id not in processing_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = processing_jobs[job_id]
    
    response = {
        "job_id": job_id,
        "status": job.status,
        "created_at": job.created_at.isoformat(),
    }
    
    if job.completed_at:
        response["completed_at"] = job.completed_at.isoformat()
    
    if job.status == "completed" and job.result:
        # Return the full result directly in the response
        response["result"] = job.result
    
    if job.status == "failed" and job.error:
        response["error"] = job.error
    
    return response

@app.get("/job/{job_id}/result")
async def get_job_result(job_id: str):
    """Get the detailed result of a completed job"""
    
    if job_id not in processing_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = processing_jobs[job_id]
    
    if job.status != "completed":
        raise HTTPException(
            status_code=400, 
            detail=f"Job is not completed yet. Current status: {job.status}"
        )
    
    return job.result

@app.post("/process-collection")
async def process_collection(
    background_tasks: BackgroundTasks,
    collection_path: str = Form(...)
):
    """
    Process an existing collection folder
    
    Args:
        collection_path: Path to the collection folder containing PDFs and input.json
        
    Returns:
        Job ID for tracking processing status
    """
    
    # Validate collection path exists
    if not os.path.exists(collection_path):
        raise HTTPException(status_code=400, detail="Collection path does not exist")
    
    # Generate unique job ID
    job_id = str(uuid.uuid4())
    
    # Create job entry
    job = ProcessingJob(job_id)
    processing_jobs[job_id] = job
    
    # Schedule background processing
    background_tasks.add_task(process_existing_collection, job_id, collection_path)
    
    return {
        "job_id": job_id,
        "status": "accepted",
        "collection_path": collection_path
    }

async def process_uploaded_pdfs(
    job_id: str,
    files: List[UploadFile]
):
    """Background task to process uploaded legal PDF files"""
    
    # Predefined values for legal document analysis
    persona = "Legal Document Analyst"
    job_to_be_done = "Legal analysis of the document including key provisions, obligations, rights, risks, and important clauses"
    
    job = processing_jobs[job_id]
    job.status = "processing"
    
    temp_dir = None
    
    try:
        # Create temporary directory for this job
        temp_dir = tempfile.mkdtemp(prefix=f"pdf_job_{job_id}_")
        pdfs_dir = os.path.join(temp_dir, "PDFs")
        os.makedirs(pdfs_dir, exist_ok=True)
        
        # Save uploaded files - background task
        file_paths = []
        for file in files:
            file_path = os.path.join(pdfs_dir, file.filename)
            # Read file content before writing
            try:
                # Reset file pointer if needed
                await file.seek(0)
                content = await file.read()
            except Exception:
                # If file is already read, get content differently
                content = file.file.read()
                if isinstance(content, str):
                    content = content.encode()
            
            # Write to disk
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(content)
            file_paths.append(file_path)
        
        # Create input JSON with predefined legal analysis parameters
        input_data = {
            "persona": persona,
            "job_to_be_done": job_to_be_done
        }
        
        input_file = os.path.join(temp_dir, "challenge1b_input.json")
        with open(input_file, 'w') as f:
            json.dump(input_data, f, indent=2)
        
        # Process the collection
        result = await asyncio.get_event_loop().run_in_executor(
            None,
            processor.process_collection,
            temp_dir
        )
        
        # Store result
        job.result = result
        job.status = "completed"
        job.completed_at = datetime.now()
        
    except Exception as e:
        job.status = "failed"
        job.error = str(e)
        job.completed_at = datetime.now()
        
    finally:
        # Cleanup temporary files
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)

async def process_existing_collection(job_id: str, collection_path: str):
    """Background task to process an existing collection"""
    
    job = processing_jobs[job_id]
    job.status = "processing"
    
    try:
        # Process the collection
        result = await asyncio.get_event_loop().run_in_executor(
            None,
            processor.process_collection,
            collection_path
        )
        
        # Store result
        job.result = result
        job.status = "completed"
        job.completed_at = datetime.now()
        
    except Exception as e:
        job.status = "failed"
        job.error = str(e)
        job.completed_at = datetime.now()

@app.delete("/job/{job_id}")
async def delete_job(job_id: str):
    """Delete a job and its results"""
    
    if job_id not in processing_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = processing_jobs[job_id]
    
    if job.status == "processing":
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete job that is currently processing"
        )
    
    del processing_jobs[job_id]
    
    return {"message": f"Job {job_id} deleted successfully"}

@app.get("/jobs")
async def list_jobs():
    """List all jobs with their status"""
    
    jobs_list = []
    for job_id, job in processing_jobs.items():
        job_info = {
            "job_id": job_id,
            "status": job.status,
            "created_at": job.created_at.isoformat()
        }
        if job.completed_at:
            job_info["completed_at"] = job.completed_at.isoformat()
        jobs_list.append(job_info)
    
    return {
        "jobs": jobs_list,
        "total": len(jobs_list)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
