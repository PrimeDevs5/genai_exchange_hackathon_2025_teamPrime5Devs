import { GoogleGenerativeAI } from '@google/generative-ai';

class TextProcessor {
  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDp8UDk012Fs6iAoU71MNmbx0IRE5S6_5w');
  }

  // Analyze text content with Gemini to create document structure
  async analyzeTextWithGemini(textContent, documentTitle, persona, jobToBeDone) {
    try {
      console.log('🤖 TextProcessor - Starting Gemini analysis');
      console.log('🤖 Document title:', documentTitle);
      console.log('🤖 Persona:', persona);
      console.log('🤖 Job to be done:', jobToBeDone);
      console.log('🤖 Text length:', textContent.length);
      
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `
You are an expert ${persona}. Your task is to ${jobToBeDone}.

Please analyze the following document text and provide a structured analysis in JSON format with the following structure:

{
  "metadata": {
    "input_documents": ["${documentTitle}"],
    "persona": "${persona}",
    "job_to_be_done": "${jobToBeDone}",
    "processing_timestamp": "${new Date().toISOString()}",
    "total_pages": 1
  },
  "extracted_sections": [
    {
      "document": "${documentTitle}",
      "section_title": "Section Title",
      "importance_rank": 1,
      "page_number": 1
    }
  ],
  "subsection_analysis": [
    {
      "page_number": 1,
      "refined_text": "Detailed analysis of the content"
    }
  ],
  "processing_info": {
    "files_processed": ["${documentTitle}"],
    "total_files": 1,
    "analysis_type": "Text Document Analysis",
    "processed_at": "${new Date().toISOString()}"
  }
}

Important guidelines:
1. Extract 5-12 key sections from the document, ranked by importance (1 = most important)
2. Provide refined analysis of the key content
3. Focus on legal terms, obligations, rights, risks, and important clauses if it's a legal document
4. Make sure section titles are descriptive and specific
5. Ensure the JSON is valid and properly formatted
6. Provide practical insights relevant to the persona and job to be done
7. Break down the content logically into important sections

Document Content:
${textContent}

Please respond with ONLY the JSON structure, no additional text.
`;

      console.log('🤖 TextProcessor - Sending prompt to Gemini...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('🤖 TextProcessor - Received response from Gemini');
      console.log('🤖 Response length:', text.length);
      
      // Clean up the response and parse JSON
      let cleanedResponse = text.trim();
      
      // Remove any markdown code block formatting
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      console.log('🤖 TextProcessor - Parsing JSON response...');
      
      try {
        const analysisResult = JSON.parse(cleanedResponse);
        
        console.log('✅ TextProcessor - Analysis completed successfully');
        console.log('✅ Extracted sections:', analysisResult.extracted_sections?.length || 0);
        console.log('✅ Subsection analyses:', analysisResult.subsection_analysis?.length || 0);
        
        return analysisResult;
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError);
        console.error('❌ Raw response:', cleanedResponse);
        
        // Fallback: create a basic structure if JSON parsing fails
        return this.createFallbackAnalysis(textContent, documentTitle, persona, jobToBeDone);
      }
      
    } catch (error) {
      console.error('❌ Error in Gemini analysis:', error);
      
      // Fallback: create a basic structure if Gemini fails
      return this.createFallbackAnalysis(textContent, documentTitle, persona, jobToBeDone);
    }
  }

  // Create a fallback analysis if Gemini fails
  createFallbackAnalysis(textContent, documentTitle, persona, jobToBeDone) {
    console.log('🔄 TextProcessor - Creating fallback analysis');
    
    // Split text into paragraphs for basic analysis
    const paragraphs = textContent.split('\n').filter(p => p.trim().length > 50);
    const extractedSections = [];
    const subsectionAnalysis = [];
    
    // Create basic sections from paragraphs
    paragraphs.slice(0, 8).forEach((paragraph, index) => {
      // Extract first 80 characters as section title
      const sectionTitle = paragraph.substring(0, 80).trim() + (paragraph.length > 80 ? '...' : '');
      
      extractedSections.push({
        document: documentTitle,
        section_title: sectionTitle,
        importance_rank: index + 1,
        page_number: 1
      });
      
      subsectionAnalysis.push({
        page_number: 1,
        refined_text: paragraph.length > 500 
          ? paragraph.substring(0, 500) + '...' 
          : paragraph
      });
    });
    
    // If no paragraphs, create a single section
    if (extractedSections.length === 0) {
      extractedSections.push({
        document: documentTitle,
        section_title: 'Document Content',
        importance_rank: 1,
        page_number: 1
      });
      
      subsectionAnalysis.push({
        page_number: 1,
        refined_text: textContent.length > 500 
          ? textContent.substring(0, 500) + '...' 
          : textContent
      });
    }
    
    return {
      metadata: {
        input_documents: [documentTitle],
        persona: persona,
        job_to_be_done: jobToBeDone,
        processing_timestamp: new Date().toISOString(),
        total_pages: 1
      },
      extracted_sections: extractedSections,
      subsection_analysis: subsectionAnalysis,
      processing_info: {
        files_processed: [documentTitle],
        total_files: 1,
        analysis_type: 'Text Document Analysis (Fallback)',
        processed_at: new Date().toISOString()
      }
    };
  }

  // Main processing function for text documents
  async processTextDocument(textContent, documentTitle, persona, jobToBeDone) {
    try {
      console.log('🚀 TextProcessor - Starting text document processing');
      console.log('🚀 Document title:', documentTitle);
      console.log('🚀 Text length:', textContent.length);
      
      if (!textContent || textContent.trim().length === 0) {
        throw new Error('No text content provided for processing');
      }
      
      // Analyze with Gemini
      const analysis = await this.analyzeTextWithGemini(textContent, documentTitle, persona, jobToBeDone);
      
      console.log('✅ TextProcessor - Text document processing completed');
      
      return analysis;
      
    } catch (error) {
      console.error('❌ TextProcessor - Processing failed:', error);
      throw error;
    }
  }
}

export default new TextProcessor();