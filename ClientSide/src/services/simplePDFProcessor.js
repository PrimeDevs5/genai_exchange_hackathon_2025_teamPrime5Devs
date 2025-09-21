import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Simplified PDF processor that extracts basic info without complex PDF.js setup
 * Uses FileReader API to get basic file information and lets Gemini analyze the content description
 */
class SimplePDFProcessor {
  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDp8UDk012Fs6iAoU71MNmbx0IRE5S6_5w');
  }

  // Extract basic info from PDF file (without text extraction)
  async extractBasicPDFInfo(file) {
    try {
      console.log('📄 SimplePDFProcessor - Extracting basic info from:', file.name);
      
      return {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        lastModified: new Date(file.lastModified).toISOString(),
        // We'll let Gemini know this is a PDF but we couldn't extract text
        extractionMethod: 'metadata_only',
        message: 'PDF file detected but text extraction not available. Analysis based on filename and user description.'
      };
    } catch (error) {
      console.error('❌ Error extracting PDF info:', error);
      throw new Error(`Failed to process PDF file: ${error.message}`);
    }
  }

  // Analyze PDF metadata with Gemini (when text extraction fails)
  async analyzeWithoutText(basicInfo, persona, jobToBeDone) {
    try {
      console.log('🤖 SimplePDFProcessor - Starting metadata-based analysis');
      
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `
You are an expert ${persona}. Your task is to ${jobToBeDone}.

I have a PDF file that I cannot directly read the text from, but I can provide you with the file information:

File Name: ${basicInfo.fileName}
File Size: ${basicInfo.fileSize} bytes
File Type: ${basicInfo.fileType}
Last Modified: ${basicInfo.lastModified}

Based on the filename and your expertise as a ${persona}, please create a structured analysis in JSON format with the following structure:

{
  "metadata": {
    "input_documents": ["${basicInfo.fileName}"],
    "persona": "${persona}",
    "job_to_be_done": "${jobToBeDone}",
    "processing_timestamp": "${new Date().toISOString()}",
    "total_pages": "Unknown (PDF text extraction not available)",
    "processing_note": "Analysis based on filename and document type inference"
  },
  "extracted_sections": [
    {
      "document": "${basicInfo.fileName}",
      "section_title": "Document Overview",
      "importance_rank": 1,
      "page_number": "N/A"
    }
  ],
  "subsection_analysis": [
    {
      "page_number": "N/A",
      "refined_text": "Based on the filename '${basicInfo.fileName}', this appears to be a [describe what type of document this likely is]. As a ${persona}, I recommend [provide relevant advice based on the filename and document type]."
    }
  ],
  "processing_info": {
    "files_processed": ["${basicInfo.fileName}"],
    "total_files": 1,
    "analysis_type": "Metadata-based Document Analysis",
    "processed_at": "${new Date().toISOString()}",
    "limitation_note": "Full text analysis not available - recommendations based on document type inference"
  }
}

Important guidelines:
1. Based on the filename, infer what type of document this likely is
2. Provide relevant analysis and recommendations for someone in the ${persona} role
3. Be helpful while acknowledging the limitation of not having the full text
4. Create 3-5 logical sections that would typically be in this type of document
5. Provide practical advice relevant to the ${jobToBeDone} task
6. Ensure the JSON is valid and properly formatted

Please respond with ONLY the JSON structure, no additional text.
`;

      console.log('🤖 SimplePDFProcessor - Sending prompt to Gemini...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('🤖 SimplePDFProcessor - Received response from Gemini');
      
      // Clean up the response and parse JSON
      let cleanedResponse = text.trim();
      
      // Remove any markdown code block formatting
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      try {
        const analysisResult = JSON.parse(cleanedResponse);
        
        console.log('✅ SimplePDFProcessor - Analysis completed successfully');
        return analysisResult;
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError);
        return this.createFallbackAnalysis(basicInfo, persona, jobToBeDone);
      }
      
    } catch (error) {
      console.error('❌ Error in Gemini analysis:', error);
      return this.createFallbackAnalysis(basicInfo, persona, jobToBeDone);
    }
  }

  // Create a basic fallback analysis
  createFallbackAnalysis(basicInfo, persona, jobToBeDone) {
    console.log('🔄 SimplePDFProcessor - Creating fallback analysis');
    
    // Infer document type from filename
    const fileName = basicInfo.fileName.toLowerCase();
    let documentType = 'Document';
    let analysis = 'This document requires review.';
    
    if (fileName.includes('contract') || fileName.includes('agreement')) {
      documentType = 'Contract/Agreement';
      analysis = 'This appears to be a contractual document that likely contains terms, conditions, and legal obligations.';
    } else if (fileName.includes('policy') || fileName.includes('procedure')) {
      documentType = 'Policy/Procedure Document';
      analysis = 'This appears to be a policy or procedure document containing guidelines and processes.';
    } else if (fileName.includes('report') || fileName.includes('analysis')) {
      documentType = 'Report/Analysis';
      analysis = 'This appears to be a report or analysis document containing findings and recommendations.';
    } else if (fileName.includes('manual') || fileName.includes('guide')) {
      documentType = 'Manual/Guide';
      analysis = 'This appears to be an instructional document containing procedures or guidance.';
    }
    
    return {
      metadata: {
        input_documents: [basicInfo.fileName],
        persona: persona,
        job_to_be_done: jobToBeDone,
        processing_timestamp: new Date().toISOString(),
        total_pages: "Unknown",
        processing_note: "Analysis based on filename inference"
      },
      extracted_sections: [
        {
          document: basicInfo.fileName,
          section_title: `${documentType} Overview`,
          importance_rank: 1,
          page_number: "N/A"
        },
        {
          document: basicInfo.fileName,
          section_title: "Document Analysis Limitation",
          importance_rank: 2,
          page_number: "N/A"
        },
        {
          document: basicInfo.fileName,
          section_title: "Recommended Next Steps",
          importance_rank: 3,
          page_number: "N/A"
        }
      ],
      subsection_analysis: [
        {
          page_number: "N/A",
          refined_text: analysis
        },
        {
          page_number: "N/A",
          refined_text: "Note: Full text analysis was not possible due to technical limitations. For a complete analysis, please use the 'Input Text' feature to paste the document content."
        },
        {
          page_number: "N/A",
          refined_text: `As a ${persona}, I recommend extracting the text from this document manually and using the text input feature for a more detailed analysis.`
        }
      ],
      processing_info: {
        files_processed: [basicInfo.fileName],
        total_files: 1,
        analysis_type: "Basic Document Analysis (Fallback)",
        processed_at: new Date().toISOString(),
        limitation_note: "Text extraction not available - analysis based on filename"
      }
    };
  }

  // Main processing function for PDFs when text extraction fails
  async processSimplePDF(file, persona, jobToBeDone) {
    try {
      console.log('🚀 SimplePDFProcessor - Starting simple PDF processing');
      
      // Extract basic file info
      const basicInfo = await this.extractBasicPDFInfo(file);
      
      // Analyze with Gemini based on metadata
      const analysis = await this.analyzeWithoutText(basicInfo, persona, jobToBeDone);
      
      console.log('✅ SimplePDFProcessor - Processing completed');
      
      return analysis;
    } catch (error) {
      console.error('❌ SimplePDFProcessor - Processing failed:', error);
      throw error;
    }
  }
}

export default new SimplePDFProcessor();