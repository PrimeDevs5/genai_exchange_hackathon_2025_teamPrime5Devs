# PDF Document Intelligence API Documentation

## Overview
This API provides endpoints for uploading PDF documents and processing them using persona-driven document intelligence to extract the most relevant sections based on specific user personas and tasks.

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: Update with your domain

## Authentication
Currently, no authentication is required. In production, consider implementing API keys or OAuth.

## API Endpoints

### 1. Health Check
Check if the API is running and healthy.

**Endpoint**: `GET /`  
**Response**:
```json
{
  "message": "PDF Document Intelligence API",
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-09-20T09:50:00"
}
```

### 2. Detailed Health Check
Get detailed health information including active jobs.

**Endpoint**: `GET /health`  
**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-09-20T09:50:00",
  "active_jobs": 0,
  "total_jobs": 5
}
```

### 3. Upload PDFs for Processing
Upload multiple PDF files with persona and task information for processing.

**Endpoint**: `POST /upload-pdfs`  
**Content-Type**: `multipart/form-data`

**Parameters**:
- `files` (required): Array of PDF files to upload
- `persona` (required): Description of the user persona/role
- `job_to_be_done` (required): Description of the task to accomplish

**Example Request**:
```bash
curl -X POST "http://localhost:8000/upload-pdfs" \
  -F "files=@document1.pdf" \
  -F "files=@document2.pdf" \
  -F "persona=College student planning a trip with friends" \
  -F "job_to_be_done=Plan a 5-day trip to South of France with accommodation and activity recommendations"
```

**Response**:
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "accepted",
  "message": "Processing 2 PDF files",
  "files": ["document1.pdf", "document2.pdf"]
}
```

### 4. Process Existing Collection
Process an existing collection folder containing PDFs and input.json.

**Endpoint**: `POST /process-collection`  
**Content-Type**: `application/x-www-form-urlencoded`

**Parameters**:
- `collection_path` (required): Path to the collection folder

**Example Request**:
```bash
curl -X POST "http://localhost:8000/process-collection" \
  -d "collection_path=/app/Collections/Collection 1"
```

**Response**:
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440001",
  "status": "accepted",
  "collection_path": "/app/Collections/Collection 1"
}
```

### 5. Check Job Status
Get the current status of a processing job.

**Endpoint**: `GET /job/{job_id}`

**Example Request**:
```bash
curl "http://localhost:8000/job/550e8400-e29b-41d4-a716-446655440000"
```

**Response (In Progress)**:
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "created_at": "2025-09-20T09:45:00"
}
```

**Response (Completed)**:
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "created_at": "2025-09-20T09:45:00",
  "completed_at": "2025-09-20T09:47:30",
  "result": {
    "metadata": {
      "input_documents": ["document1.pdf", "document2.pdf"],
      "persona": "College student planning a trip with friends",
      "job_to_be_done": "Plan a 5-day trip to South of France",
      "processing_timestamp": "2025-09-20T09:47:30"
    },
    "extracted_sections": [...],
    "subsection_analysis": [...]
  }
}
```

### 6. Get Job Result
Get the detailed result of a completed job.

**Endpoint**: `GET /job/{job_id}/result`

**Example Request**:
```bash
curl "http://localhost:8000/job/550e8400-e29b-41d4-a716-446655440000/result"
```

**Response**: Returns the full processing result (same as the `result` field from job status).

### 7. List All Jobs
Get a list of all processing jobs.

**Endpoint**: `GET /jobs`

**Response**:
```json
{
  "jobs": [
    {
      "job_id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "completed",
      "created_at": "2025-09-20T09:45:00",
      "completed_at": "2025-09-20T09:47:30"
    },
    {
      "job_id": "550e8400-e29b-41d4-a716-446655440001",
      "status": "processing",
      "created_at": "2025-09-20T09:50:00"
    }
  ],
  "total": 2
}
```

### 8. Delete Job
Delete a job and its results.

**Endpoint**: `DELETE /job/{job_id}`

**Example Request**:
```bash
curl -X DELETE "http://localhost:8000/job/550e8400-e29b-41d4-a716-446655440000"
```

**Response**:
```json
{
  "message": "Job 550e8400-e29b-41d4-a716-446655440000 deleted successfully"
}
```

## Job Status Values
- `pending`: Job has been accepted but not yet started
- `processing`: Job is currently being processed
- `completed`: Job finished successfully
- `failed`: Job failed with an error

## Error Responses
All error responses follow this format:
```json
{
  "detail": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `400`: Bad Request (invalid parameters, file type not supported)
- `404`: Not Found (job doesn't exist)
- `422`: Validation Error (missing required fields)
- `500`: Internal Server Error

## File Upload Limits
- **Maximum file size**: 50MB per file
- **Supported formats**: PDF only
- **Maximum concurrent jobs**: 5

## Interactive Documentation
When the API is running, you can access interactive documentation at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Example Workflow

1. **Upload PDFs**:
   ```bash
   curl -X POST "http://localhost:8000/upload-pdfs" \
     -F "files=@travel_guide.pdf" \
     -F "persona=Family with teenagers" \
     -F "job_to_be_done=Plan educational vacation with cultural activities"
   ```

2. **Check Status**:
   ```bash
   curl "http://localhost:8000/job/{job_id}"
   ```

3. **Get Results**:
   ```bash
   curl "http://localhost:8000/job/{job_id}/result"
   ```

4. **Clean Up**:
   ```bash
   curl -X DELETE "http://localhost:8000/job/{job_id}"
   ```
