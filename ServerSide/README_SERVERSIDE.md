# Legal Document Intelligence API - Server Side

## 🚀 **URGENT: Deploy for Frontend Team**

This is the backend API for GenAI Exchange Hackathon 2025 Team Prime5Devs.

### Quick Deploy Steps:

1. **Push to GitHub** (from your main repository):
   ```bash
   git add .
   git commit -m "Add legal document API to ServerSide"
   git push origin main
   ```

2. **Deploy to Railway** (Recommended - Free):
   - Go to [Railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select: `PrimeDevs5/genai_exchange_hackathon_2025_teamPrime5Devs`
   - Set **Root Directory**: `/ServerSide`
   - Railway will auto-detect the config and deploy
   - **You'll get a public URL**: `https://your-app-name.railway.app`

### Alternative: Deploy to Render
- Go to [Render.com](https://render.com) 
- Create Web Service from GitHub
- **Root Directory**: `/ServerSide`
- **You'll get a public URL**: `https://your-app-name.onrender.com`

## 📋 **API for Frontend Team**

### Main Endpoint
```
POST {your-deployed-url}/analyze-legal-documents
```

### Frontend Integration Code
```javascript
const formData = new FormData();
formData.append('files', pdfFile); // From file input

fetch('https://your-deployed-url.com/analyze-legal-documents', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Legal Analysis:', data);
  // Use data.analysis_results for legal document insights
});
```

### Response Format
```json
{
  "analysis_results": {
    "document_title": "Contract Name",
    "key_provisions": ["..."],
    "obligations": ["..."],
    "rights": ["..."],
    "risks": ["..."],
    "important_clauses": ["..."]
  },
  "processing_info": {
    "files_processed": 1,
    "analysis_type": "Legal Document Analysis"
  }
}
```

## ✅ **Test Your Deployment**

Once deployed, test with:
```bash
curl https://your-deployed-url.com/health
```

Should return:
```json
{"status": "healthy", "timestamp": "..."}
```

## 🎯 **What This API Does**

- **Analyzes legal documents** (contracts, agreements, etc.)
- **Extracts key provisions** and important clauses
- **Identifies obligations** and rights
- **Highlights potential risks**
- **Returns structured JSON** for frontend consumption

---

**🔥 DEPLOY NOW TO GET YOUR PUBLIC URL! 🔥**

See `FRONTEND_DEPLOYMENT.md` for detailed deployment guide.
