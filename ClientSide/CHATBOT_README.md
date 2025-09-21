# Legal Document Viewer with AI ChatBot

This application includes an AI-powered chatbot that can answer questions about legal documents using Google's Gemini AI.

## Setup Instructions for ChatBot

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables

1. Create a `.env` file in the root directory of your project
2. Add your Gemini API key (note the VITE_ prefix required for Vite):

```bash
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Features

- **Floating Chat Button**: Located in the bottom right corner of the document viewer
- **Document Context**: The AI has full access to the document content and can answer specific questions
- **Legal-focused**: Optimized for legal document analysis and contract interpretation
- **Real-time Responses**: Powered by Google's Gemini AI model
- **Professional UI**: Clean, modern interface that matches your legal document theme

### 4. Usage

1. Open any document in the Document Viewer
2. Click the floating chat button in the bottom right
3. Ask questions about:
   - Contract terms and clauses
   - Specific sections or requirements
   - Legal implications
   - Key takeaways and summaries
   - Comparisons between different sections

### 5. Example Questions

- "What are the key terms of this employment contract?"
- "How long is the notice period for termination?"
- "What are the compensation details?"
- "Are there any exclusivity clauses?"
- "What happens if the contract is not renewed?"

### 6. Technical Details

- Built with React and Tailwind CSS
- Uses Google's Generative AI (@google/generative-ai)
- Responsive design that works on desktop and mobile
- Smooth animations and modern UI components
- Proper error handling and loading states

## Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Make sure to add your `.env` file with the Gemini API key before running the application.
