const BASE_URL = 'https://genai-exchange-hackathon-2025.onrender.com';

/**
 * API Service for PDF Document Intelligence Backend
 */
class APIService {
  /**
   * Health check - verify if API is running
   */
  static async healthCheck() {
    try {
      const response = await fetch(`${BASE_URL}/`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  /**
   * Detailed health check with active jobs info
   */
  static async detailedHealthCheck() {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`Detailed health check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Detailed health check failed:', error);
      throw error;
    }
  }

  /**
   * Analyze legal documents (updated endpoint name)
   * @param {File[]} files - Array of PDF files
   * @param {string} persona - User persona/role description (optional for current API)
   * @param {string} jobToBeDone - Task description (optional for current API)
   */
  static async uploadPDFs(files, persona, jobToBeDone) {
    try {
      const formData = new FormData();
      
      // Add files to form data - the API expects 'files' parameter
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Note: Current API doesn't seem to accept persona and job_to_be_done
      // but we'll keep the parameters for future compatibility
      
      const response = await fetch(`${BASE_URL}/analyze-legal-documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result); // Debug log to see the response structure
      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  /**
   * Process existing collection
   * @param {string} collectionPath - Path to collection folder
   */
  static async processCollection(collectionPath) {
    try {
      const formData = new URLSearchParams();
      formData.append('collection_path', collectionPath);

      const response = await fetch(`${BASE_URL}/process-collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Collection processing failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Collection processing failed:', error);
      throw error;
    }
  }

  /**
   * Check job status
   * @param {string} jobId - Job ID to check
   */
  static async getJobStatus(jobId) {
    try {
      const response = await fetch(`${BASE_URL}/job/${jobId}`);
      if (!response.ok) {
        throw new Error(`Job status check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Job status check failed:', error);
      throw error;
    }
  }

  /**
   * Get job result
   * @param {string} jobId - Job ID to get result for
   */
  static async getJobResult(jobId) {
    try {
      const response = await fetch(`${BASE_URL}/job/${jobId}/result`);
      if (!response.ok) {
        throw new Error(`Job result fetch failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Job result fetch failed:', error);
      throw error;
    }
  }

  /**
   * List all jobs
   */
  static async listJobs() {
    try {
      const response = await fetch(`${BASE_URL}/jobs`);
      if (!response.ok) {
        throw new Error(`Jobs list fetch failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Jobs list fetch failed:', error);
      throw error;
    }
  }

  /**
   * Delete a job
   * @param {string} jobId - Job ID to delete
   */
  static async deleteJob(jobId) {
    try {
      const response = await fetch(`${BASE_URL}/job/${jobId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Job deletion failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Job deletion failed:', error);
      throw error;
    }
  }

  /**
   * Poll job status until completion
   * @param {string} jobId - Job ID to poll
   * @param {function} onProgress - Callback for progress updates
   * @param {number} pollInterval - Polling interval in milliseconds (default: 3000)
   */
  static async pollJobCompletion(jobId, onProgress = null, pollInterval = 3000) {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getJobStatus(jobId);
          
          if (onProgress) {
            onProgress(status);
          }

          if (status.status === 'completed') {
            resolve(status);
          } else if (status.status === 'failed' || status.status === 'error') {
            reject(new Error(`Job failed: ${status.error || 'Unknown error'}`));
          } else {
            // Continue polling
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  /**
   * Upload and process documents with immediate results (compatibility method)
   * @param {File[]} files - Array of files
   * @param {string} persona - User persona/role description
   * @param {string} jobToBeDone - Task description
   * @param {function} onProgress - Callback for progress updates (unused for immediate API)
   */
  static async uploadAndProcess(files, persona, jobToBeDone, onProgress = null) {
    try {
      if (onProgress) {
        onProgress({ status: 'uploading', message: 'Processing documents...' });
      }

      // Call the direct API
      const result = await this.uploadPDFs(files, persona, jobToBeDone);
      
      if (onProgress) {
        onProgress({ status: 'completed', message: 'Processing completed successfully!' });
      }

      return {
        job_id: Date.now().toString(),
        status: 'completed',
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        result: result
      };
    } catch (error) {
      console.error('Upload and process failed:', error);
      throw error;
    }
  }
}

export default APIService;