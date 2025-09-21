import { GoogleGenerativeAI } from '@google/generative-ai';
import { configurePDFWorker } from './pdfWorkerHelper.js';

// Configure PDF.js worker with fallbacks
let pdfjsLib = null;
let isConfigured = false;

const initializePDFJS = async () => {
  if (!isConfigured) {
    try {
      pdfjsLib = await configurePDFWorker();
      isConfigured = true;
      console.log('✅ PDF.js initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize PDF.js:', error);
      throw error;
    }
  }
  return pdfjsLib;
};

class PDFProcessor {
  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDp8UDk012Fs6iAoU71MNmbx0IRE5S6_5w');
  }

  // Extract text from PDF file
  async extractTextFromPDF(file) {
    try {
      console.log('📄 PDFProcessor - Starting text extraction from:', file.name);
      
      // Initialize PDF.js with robust worker configuration
      const pdfjs = await initializePDFJS();
      console.log('📄 PDFProcessor - Worker src:', pdfjs.GlobalWorkerOptions.workerSrc);
      
      const arrayBuffer = await file.arrayBuffer();
      
      console.log('📄 PDFProcessor - File loaded as ArrayBuffer, size:', arrayBuffer.byteLength);
      
      // Configure loading parameters with error handling
      const loadingTask = pdfjs.getDocument({ 
        data: arrayBuffer,
        useSystemFonts: true,
        disableFontFace: true, // Disable font loading to avoid issues
        verbosity: 0 // Reduce PDF.js console output
      });
      
      const pdf = await loadingTask.promise;
      
      console.log('📄 PDFProcessor - PDF loaded successfully, pages:', pdf.numPages);
      
      let fullText = '';
      const pageTexts = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          
          pageTexts.push({
            page: i,
            text: pageText,
            length: pageText.length
          });
          
          fullText += `\n\n--- Page ${i} ---\n${pageText}`;
          
          console.log(`📄 PDFProcessor - Extracted page ${i}: ${pageText.length} characters`);
        } catch (pageError) {
          console.warn(`⚠️ PDFProcessor - Failed to extract page ${i}:`, pageError.message);
          // Continue with next page
          pageTexts.push({
            page: i,
            text: `[Page ${i} - Text extraction failed: ${pageError.message}]`,
            length: 0
          });
        }
      }
      
      console.log('📄 PDFProcessor - Total text extracted:', fullText.length, 'characters');
      
      if (fullText.trim().length === 0) {
        throw new Error('No text content could be extracted from the PDF. The PDF might be image-based or encrypted.');
      }
      
      return {
        fullText: fullText.trim(),
        pageTexts,
        totalPages: pdf.numPages,
        fileName: file.name
      };
    } catch (error) {
      console.error('❌ Error extracting text from PDF:', error);
      
      // If PDF.js fails, provide a meaningful fallback
      if (error.message.includes('version') || error.message.includes('Worker')) {
        throw new Error(`PDF processing failed due to library version mismatch. Please try uploading the document as text instead, or contact support. Technical details: ${error.message}`);
      } else if (error.message.includes('password') || error.message.includes('encrypted')) {
        throw new Error('This PDF appears to be password protected or encrypted. Please provide an unprotected version or extract the text manually.');
      } else if (error.message.includes('No text content')) {
        throw new Error('This PDF appears to be image-based or contains no extractable text. Please use OCR software to convert it to text format first.');
      } else {
        throw new Error(`Failed to process PDF: ${error.message}. Please try converting the document to text format instead.`);
      }
    }
  }

  // Analyze PDF content with Gemini to create document structure
  async analyzeWithGemini(extractedData, persona, jobToBeDone) {
    try {
      console.log('🤖 PDFProcessor - Starting Gemini analysis');
      console.log('🤖 Persona:', persona);
      console.log('🤖 Job to be done:', jobToBeDone);
      
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `
You are an expert ${persona}. Your task is to ${jobToBeDone}.

Please analyze the following PDF document content and provide a structured analysis in JSON format with the following structure:

{
  "metadata": {
    "input_documents": ["${extractedData.fileName}"],
    "persona": "${persona}",
    "job_to_be_done": "${jobToBeDone}",
    "processing_timestamp": "${new Date().toISOString()}",
    "total_pages": ${extractedData.totalPages}
  },
  "extracted_sections": [
    {
      "document": "${extractedData.fileName}",
      "section_title": "Section Title",
      "importance_rank": 1,
      "page_number": 1
    }
  ],
  "subsection_analysis": [
    {
      "page_number": 1,
      "refined_text": "Detailed analysis of the content on this page"
    }
  ],
  "processing_info": {
    "files_processed": ["${extractedData.fileName}"],
    "total_files": 1,
    "analysis_type": "Legal Document Analysis",
    "processed_at": "${new Date().toISOString()}"
  }
}

Important guidelines:
1. Extract 8-15 key sections from the document, ranked by importance (1 = most important)
2. For each page, provide refined analysis of the key content
3. Focus on legal terms, obligations, rights, risks, and important clauses
4. Make sure section titles are descriptive and specific
5. Ensure the JSON is valid and properly formatted
6. Provide practical insights relevant to the persona and job to be done

Document Content:
${extractedData.fullText.length > 50000 ? extractedData.fullText.substring(0, 50000) + '...\n[Content truncated due to length]' : extractedData.fullText}

Please respond with ONLY the JSON structure, no additional text.
`;

      console.log('🤖 PDFProcessor - Sending prompt to Gemini...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('🤖 PDFProcessor - Received response from Gemini');
      console.log('🤖 Response length:', text.length);
      
      // Clean up the response and parse JSON
      let cleanedResponse = text.trim();
      
      // Remove any markdown code block formatting
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      console.log('🤖 PDFProcessor - Parsing JSON response...');
      
      try {
        const analysisResult = JSON.parse(cleanedResponse);
        
        console.log('✅ PDFProcessor - Analysis completed successfully');
        console.log('✅ Extracted sections:', analysisResult.extracted_sections?.length || 0);
        console.log('✅ Subsection analyses:', analysisResult.subsection_analysis?.length || 0);
        
        return analysisResult;
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError);
        console.error('❌ Raw response:', cleanedResponse);
        
        // Fallback: create a basic structure if JSON parsing fails
        return this.createFallbackAnalysis(extractedData, persona, jobToBeDone);
      }
      
    } catch (error) {
      console.error('❌ Error in Gemini analysis:', error);
      
      // Fallback: create a basic structure if Gemini fails
      return this.createFallbackAnalysis(extractedData, persona, jobToBeDone);
    }
  }

  // Create a fallback analysis if Gemini fails
  createFallbackAnalysis(extractedData, persona, jobToBeDone) {
    console.log('🔄 PDFProcessor - Creating fallback analysis');
    
    const extractedSections = [];
    const subsectionAnalysis = [];
    
    // Create basic sections from page content
    extractedData.pageTexts.forEach((pageData, index) => {
      if (pageData.text.length > 100) {
        // Extract first sentence or first 100 characters as section title
        const firstSentence = pageData.text.split('.')[0].substring(0, 80);
        
        extractedSections.push({
          document: extractedData.fileName,
          section_title: firstSentence || `Page ${pageData.page} Content`,
          importance_rank: index + 1,
          page_number: pageData.page
        });
        
        subsectionAnalysis.push({
          page_number: pageData.page,
          refined_text: pageData.text.length > 500 
            ? pageData.text.substring(0, 500) + '...' 
            : pageData.text
        });
      }
    });
    
    return {
      metadata: {
        input_documents: [extractedData.fileName],
        persona: persona,
        job_to_be_done: jobToBeDone,
        processing_timestamp: new Date().toISOString(),
        total_pages: extractedData.totalPages
      },
      extracted_sections: extractedSections.slice(0, 10), // Limit to 10 sections
      subsection_analysis: subsectionAnalysis,
      processing_info: {
        files_processed: [extractedData.fileName],
        total_files: 1,
        analysis_type: 'Document Analysis (Fallback)',
        processed_at: new Date().toISOString()
      }
    };
  }

  // Main processing function
  async processDocuments(files, persona, jobToBeDone) {
    try {
      console.log('🚀 PDFProcessor - Starting document processing');
      console.log('🚀 Files:', files.map(f => f.name));
      
      if (files.length === 0) {
        throw new Error('No files provided for processing');
      }
      
      // For now, process only the first file
      const file = files[0];
      
      // Extract text from PDF
      const extractedData = await this.extractTextFromPDF(file);
      
      // Analyze with Gemini
      const analysis = await this.analyzeWithGemini(extractedData, persona, jobToBeDone);
      
      console.log('✅ PDFProcessor - Document processing completed');
      
      return analysis;
      
    } catch (error) {
      console.error('❌ PDFProcessor - Processing failed:', error);
      throw error;
    }
  }
}

export default new PDFProcessor();