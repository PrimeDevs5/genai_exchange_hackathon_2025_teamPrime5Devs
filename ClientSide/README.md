# Legal Document Intelligence - Frontend

A modern React-based web application for AI-powered legal document analysis and processing. This application allows users to upload legal documents, analyze them using AI, and interact with an intelligent chatbot for document-related queries.

## Features

### 🔐 Authentication & Security
- Firebase Authentication integration
- Google OAuth sign-in
- Protected routes and user sessions
- Password reset functionality

### 📄 Document Processing
- PDF document upload and processing
- AI-powered legal document analysis
- Multi-language support
- Document viewer with enhanced features
- Risk analysis and insights

### 🤖 AI-Powered Chatbot
- Integrated chatbot using Google's Gemini AI
- Context-aware responses about uploaded documents
- Natural language queries about legal content

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Dark/light theme support
- Mobile-first responsive layout
- Modern component architecture

### 🌐 Multi-language Support
- Language context and selector
- Internationalization ready
- Localized user interface

## Technology Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 5.2.0
- **Routing**: React Router DOM 6.26.2
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 12.23.16
- **PDF Processing**: PDF.js 5.4.149
- **Authentication**: Firebase (latest)
- **AI Integration**: Google Generative AI 0.24.1
- **Icons**: Heroicons, Lucide React
- **Language**: JavaScript/TypeScript

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Navbar, Footer)
│   ├── profile/        # User profile components
│   └── ui/            # Reusable UI components
├── contexts/          # React contexts for state management
├── pages/             # Main application pages
├── services/          # API and processing services
└── utils/             # Utility functions and helpers
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Firebase project for authentication
- Google AI Studio API key for Gemini AI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory and add the following variables:
   
   ```bash
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # Google Gemini AI
   VITE_GEMINI_API_KEY=your_gemini_api_key
   
   # Backend API (if applicable)
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password and Google providers
   - Copy your Firebase configuration to the `.env` file

5. **Google AI Setup**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add it to your `.env` file as `VITE_GEMINI_API_KEY`

### Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Preview production build**
   ```bash
   npm run preview
   ```

4. **Lint code**
   ```bash
   npm run lint
   ```

## Usage

### Authentication
1. Navigate to the application
2. Sign up or sign in using email/password or Google OAuth
3. Access protected features after authentication

### Document Analysis
1. Log in to your account
2. Navigate to the Dashboard
3. Upload PDF documents using the upload button
4. View analysis results and insights
5. Use the chatbot to ask questions about your documents

### Document Viewer
- View uploaded documents with enhanced PDF viewer
- Navigate through pages
- Zoom and search functionality
- Multi-language document support

## API Integration

The frontend integrates with a backend API for document processing:

- **POST** `/analyze-legal-documents` - Upload and analyze legal documents
- **GET** `/health` - Health check endpoint
- **POST** `/test-processor` - Test processor functionality

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Considerations

- All API keys and sensitive information are stored in environment variables
- Firebase security rules should be properly configured
- User authentication is required for document processing features
- Rate limiting is implemented for API calls

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is proprietary. All rights reserved.

## Support

For support and questions, please contact the development team or create an issue in the repository.
