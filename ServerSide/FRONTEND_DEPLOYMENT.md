# Legal Document Intelligence API - Cloud Deployment Guide

## 🚀 Quick Deploy Options for Frontend Team

### Option 1: Railway (Recommended - Free Tier Available)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Deploy legal document API"
   git push origin main
   ```

2. **Deploy to Railway**:
   - Go to [Railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect the `railway.json` config
   - Your API will be deployed with a public URL like: `https://your-app-name.railway.app`

### Option 2: Render (Free Tier Available)

1. **Push to GitHub** (if not already done)

2. **Deploy to Render**:
   - Go to [Render.com](https://render.com)
   - Sign in with GitHub
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Render will use the `render.yaml` configuration
   - Your API will be deployed with a URL like: `https://your-app-name.onrender.com`

### Option 3: Heroku (Credit Card Required)

1. **Install Heroku CLI**: Download from [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. **Deploy Commands**:
   ```bash
   heroku login
   heroku create your-legal-doc-api
   git push heroku main
   ```

## 📋 API Endpoints for Frontend Team

Once deployed, your frontend team can use these endpoints:

### Base URL
- **Railway**: `https://your-app-name.railway.app`
- **Render**: `https://your-app-name.onrender.com`
- **Heroku**: `https://your-legal-doc-api.herokuapp.com`

### Main Endpoint for Legal Document Analysis
```
POST /analyze-legal-documents
```

**Usage Example for Frontend**:
```javascript
const formData = new FormData();
formData.append('files', pdfFile); // PDF file from file input

fetch('https://your-deployed-url.com/analyze-legal-documents', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Legal Analysis Result:', data);
  // data contains the legal document analysis
});
```

### Other Available Endpoints:
- `GET /` - API health check and info
- `GET /health` - Detailed health status
- `GET /docs` - Interactive API documentation (Swagger UI)

## 🔧 Frontend Integration Notes

1. **File Upload**: Use FormData with 'files' field name
2. **Response**: JSON object containing legal document analysis
3. **CORS**: Configured to allow all origins for easy integration
4. **File Types**: Only PDF files are accepted
5. **Analysis Focus**: Automatically configured for legal document analysis

## 📊 Expected Response Format
```json
{
  "analysis_results": {
    "document_title": "...",
    "key_provisions": [...],
    "obligations": [...],
    "rights": [...],
    "risks": [...],
    "important_clauses": [...]
  },
  "processing_info": {
    "files_processed": 1,
    "analysis_type": "Legal Document Analysis"
  }
}
```

## ✅ Quick Test
Once deployed, test with:
```bash
curl https://your-deployed-url.com/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-XX...",
  "active_jobs": 0,
  "total_jobs": 0
}
```

## 🔄 Deploy Now - Step by Step

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Ready for cloud deployment"
   git push origin main
   ```

2. **Choose a platform** (Railway recommended for ease)

3. **Get your public URL** to share with frontend team

4. **Test the endpoint** with `/health` first

5. **Share the deployed URL** with your frontend team
