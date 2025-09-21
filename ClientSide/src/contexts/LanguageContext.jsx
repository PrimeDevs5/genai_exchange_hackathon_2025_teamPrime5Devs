import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationRateLimiter } from '../utils/rateLimiter';

const translations = {
  en: {
    // Document Content
    documentContent: {
      employmentAgreementTitle: "EMPLOYMENT AGREEMENT",
      employmentAgreementIntro: "THIS EMPLOYMENT AGREEMENT (the \"Agreement\") is made and entered into as of January 15, 2023 (the \"Effective Date\"), by and between ACME CORPORATION, a Delaware corporation (the \"Company\"), and JOHN DOE, an individual (the \"Employee\").",
      whereasCompany: "WHEREAS, the Company desires to employ the Employee on the terms and conditions set forth herein; and",
      whereasEmployee: "WHEREAS, the Employee desires to be employed by the Company on such terms and conditions.",
      termOfEmploymentTitle: "1. TERM OF EMPLOYMENT",
      termOfEmploymentContent: "1.1 The term of employment under this Agreement (the \"Employment Term\") shall commence on the Effective Date and continue thereafter for a period of three (3) years, unless earlier terminated in accordance with Section 4 hereof. The Employment Term shall automatically renew for successive one (1) year periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current Employment Term.",
      positionAndDutiesTitle: "2. POSITION AND DUTIES",
      positionSubtitle: "2.1 Position.",
      positionContent: "During the Employment Term, the Employee shall serve as the Chief Technology Officer of the Company, reporting directly to the Chief Executive Officer. The Employee shall have such duties, authority, and responsibility as are commensurate with such position and as may be assigned to the Employee by the Chief Executive Officer or the Board of Directors of the Company (the \"Board\").",
      dutiesSubtitle: "2.2 Duties.",
      dutiesContent: "During the Employment Term, the Employee shall devote substantially all of his business time and attention to the performance of the Employee's duties hereunder and will not engage in any other business, profession, or occupation for compensation or otherwise which would conflict or interfere with the performance of such services either directly or indirectly without the prior written consent of the Board.",
      compensationAndBenefitsTitle: "3. COMPENSATION AND BENEFITS",
      baseSalarySubtitle: "3.1 Base Salary.",
      baseSalaryContent: "During the Employment Term, the Company shall pay the Employee a base salary at the annual rate of $225,000, payable in accordance with the Company's customary payroll practices. The Employee's base salary shall be reviewed annually by the Board and may be increased, but not decreased, at the discretion of the Board (the annual base salary, as in effect from time to time, the \"Base Salary\").",
      annualBonusSubtitle: "3.2 Annual Bonus.",
      annualBonusContent: "For each calendar year of the Employment Term, the Employee shall be eligible to earn an annual bonus (the \"Annual Bonus\") with a target amount equal to 25% of the Employee's Base Salary (the \"Target Bonus\"), based upon the achievement of performance goals established by the Board. The Annual Bonus, if any, shall be paid to the Employee within two and one-half (2.5) months after the end of the applicable calendar year."
    },
    // Summary Content
    summaryContent: {
      employmentTerm: "Employment Term",
      employmentTermDesc: "The employment is for 3 years and automatically renews for 1-year periods unless either party gives 60 days notice before the term ends.",
      positionReporting: "Position & Reporting Structure", 
      positionReportingDesc: "Position is Chief Technology Officer reporting to the CEO with duties assigned by CEO or Board.",
      exclusivityReq: "Exclusivity Requirement",
      exclusivityReqDesc: "Employee must devote substantially all business time to this role and cannot engage in other paid work without Board approval.",
      compensation: "Compensation",
      compensationDesc: "Base salary of $225,000 per year, reviewed annually, can be increased but not decreased. Annual bonus target of 25% of base salary based on performance goals.",
      documentSummary: "Document Summary",
      exportButton: "Export",
      important: "Important",
      note: "Note",
      section: "Section",
      goToSection: "Go to section",
      keyPointsNotice60: "60-day notice required for non-renewal (longer than standard 30 days)",
      keyPointsExclusivity: "Exclusivity clause prohibits outside work without board approval", 
      keyPointsSalary: "Base salary cannot be decreased during employment term"
    },
    // Document Viewer
    originalDocument: "Original Document",
    analysisResults: "Analysis Results",
    keyInsights: "Key Insights",
    riskAssessment: "Risk Assessment",
    complianceCheck: "Compliance Check",
    aiInsights: "AI Insights",
    confidenceScore: "Confidence Score",
    overallAssessment: "Overall Assessment",
    backToDashboard: "Back to Dashboard",
    downloadDocument: "Download Document",
    shareDocument: "Share Document",
    bookmarkDocument: "Bookmark Document",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    rotate: "Rotate",
    search: "Search",
    searchPlaceholder: "Search in document...",
    documentNotFound: "Document not found",
    documentNotFoundDesc: "The requested document could not be loaded.",
    loadingDocument: "Loading document...",
    
    // Chat Bot
    chatAssistant: "Chat Assistant",
    askQuestion: "Ask me about this document...",
    chatPlaceholder: "Type your question here...",
    send: "Send",
    hello: "Hello! I'm your legal document assistant.",
    analysisComplete: "I've analyzed this document and I'm here to help you understand its contents.",
    askAnything: "Ask me anything about the contract terms, clauses, or any specific sections.",
    
    // Analysis content
    keyPointsTitle: "Key Points",
    potentialRisks: "Potential Risks",
    complianceStatus: "Compliance Status",
    
    // Common
    loading: "Loading...",
    error: "Error occurred",
    tryAgain: "Please try again",
    success: "Success",
    
    // Upload Dialog UI
    ui: {
      uploadDocuments: "Upload Documents",
      selectedFiles: "Selected Files",
      persona: "Your Role/Persona",
      personaPlaceholder: "e.g., Legal professional, Student, Business owner...",
      jobToBeDone: "What do you want to accomplish?",
      jobPlaceholder: "e.g., Analyze contract terms, Extract key information, Summarize document...",
      cancel: "Cancel",
      uploadAndProcess: "Upload & Process",
      uploading: "Uploading...",
      processing: "Processing...",
      uploadSuccess: "Files uploaded successfully",
      processingComplete: "Document processing completed"
    }
  },
  hi: {
    // Document Content - Hindi
    documentContent: {
      employmentAgreementTitle: "रोजगार समझौता",
      employmentAgreementIntro: "यह रोजगार समझौता (\"समझौता\") 15 जनवरी, 2023 (\"प्रभावी तिथि\") को ACME CORPORATION, एक डेलावेयर कॉर्पोरेशन (\"कंपनी\"), और JOHN DOE, एक व्यक्ति (\"कर्मचारी\") के बीच बनाया और दर्ज किया गया है।",
      whereasCompany: "जबकि, कंपनी कर्मचारी को यहां निर्धारित नियमों और शर्तों पर नियुक्त करना चाहती है; और",
      whereasEmployee: "जबकि, कर्मचारी कंपनी द्वारा ऐसी शर्तों और नियमों पर नियुक्त होना चाहता है।",
      termOfEmploymentTitle: "1. रोजगार की अवधि",
      termOfEmploymentContent: "1.1 इस समझौते के तहत रोजगार की अवधि (\"रोजगार अवधि\") प्रभावी तिथि से शुरू होगी और तीन (3) वर्ष की अवधि के लिए जारी रहेगी, जब तक कि धारा 4 के अनुसार पहले समाप्त न हो जाए। रोजगार अवधि स्वचालित रूप से एक (1) वर्ष की लगातार अवधि के लिए नवीनीकृत होगी जब तक कि कोई भी पक्ष वर्तमान रोजगार अवधि के अंत से कम से कम साठ (60) दिन पहले गैर-नवीनीकरण की लिखित सूचना प्रदान नहीं करता।",
      positionAndDutiesTitle: "2. पद और कर्तव्य",
      positionSubtitle: "2.1 पद।",
      positionContent: "रोजगार अवधि के दौरान, कर्मचारी कंपनी के मुख्य प्रौद्योगिकी अधिकारी के रूप में काम करेगा, मुख्य कार्यकारी अधिकारी को सीधे रिपोर्ट करेगा। कर्मचारी के पास ऐसे कर्तव्य, अधिकार और जिम्मेदारी होगी जो ऐसे पद के अनुकूल हों और जो मुख्य कार्यकारी अधिकारी या कंपनी के निदेशक मंडल (\"बोर्ड\") द्वारा कर्मचारी को सौंपे जा सकते हैं।",
      dutiesSubtitle: "2.2 कर्तव्य।",
      dutiesContent: "रोजगार अवधि के दौरान, कर्मचारी अपना वास्तविक रूप से सभी व्यावसायिक समय और ध्यान इसके तहत कर्मचारी के कर्तव्यों के प्रदर्शन में लगाएगा और बोर्ड की पूर्व लिखित सहमति के बिना प्रत्यक्ष या अप्रत्यक्ष रूप से ऐसी सेवाओं के प्रदर्शन के साथ संघर्ष या हस्तक्षेप करने वाले मुआवजे या अन्यथा किसी भी अन्य व्यवसाय, पेशे या व्यवसाय में संलग्न नहीं होगा।",
      compensationAndBenefitsTitle: "3. मुआवजा और लाभ",
      baseSalarySubtitle: "3.1 आधार वेतन।",
      baseSalaryContent: "रोजगार अवधि के दौरान, कंपनी कर्मचारी को $225,000 की वार्षिक दर से आधार वेतन का भुगतान करेगी, जो कंपनी की प्रथागत पेरोल प्रथाओं के अनुसार देय होगा। कर्मचारी का आधार वेतन बोर्ड द्वारा वार्षिक रूप से समीक्षा की जाएगी और बोर्ड के विवेक पर बढ़ाया जा सकता है, लेकिन घटाया नहीं जाएगा (वार्षिक आधार वेतन, समय-समय पर प्रभावी, \"आधार वेतन\")।",
      annualBonusSubtitle: "3.2 वार्षिक बोनस।",
      annualBonusContent: "रोजगार अवधि के प्रत्येक कैलेंडर वर्ष के लिए, कर्मचारी एक वार्षिक बोनस (\"वार्षिक बोनस\") अर्जित करने के लिए पात्र होगा जिसकी लक्ष्य राशि कर्मचारी के आधार वेतन के 25% के बराबर होगी (\"लक्ष्य बोनस\"), बोर्ड द्वारा स्थापित प्रदर्शन लक्ष्यों की प्राप्ति के आधार पर। वार्षिक बोनस, यदि कोई हो, कर्मचारी को लागू कैलेंडर वर्ष के अंत के दो और एक-आधे (2.5) महीने के भीतर भुगतान किया जाएगा।"
    },
    // Summary Content - Hindi
    summaryContent: {
      employmentTerm: "रोजगार अवधि",
      employmentTermDesc: "रोजगार 3 वर्षों के लिए है और 1-वर्षीय अवधि के लिए स्वचालित रूप से नवीनीकृत होता है जब तक कि कोई भी पक्ष अवधि समाप्त होने से पहले 60 दिन की सूचना नहीं देता।",
      positionReporting: "पद और रिपोर्टिंग संरचना",
      positionReportingDesc: "पद मुख्य प्रौद्योगिकी अधिकारी है जो CEO को रिपोर्ट करता है और CEO या बोर्ड द्वारा सौंपे गए कर्तव्यों के साथ।",
      exclusivityReq: "विशिष्टता आवश्यकता",
      exclusivityReqDesc: "कर्मचारी को इस भूमिका के लिए वास्तविक रूप से सभी व्यावसायिक समय समर्पित करना चाहिए और बोर्ड की अनुमति के बिना अन्य भुगतान कार्य में संलग्न नहीं हो सकता।",
      compensation: "मुआवजा",
      compensationDesc: "प्रति वर्ष $225,000 का आधार वेतन, वार्षिक समीक्षा, बढ़ाया जा सकता है लेकिन घटाया नहीं जा सकता। प्रदर्शन लक्ष्यों के आधार पर आधार वेतन का 25% वार्षिक बोनस लक्ष्य।",
      documentSummary: "दस्तावेज़ सारांश",
      exportButton: "निर्यात",
      important: "महत्वपूर्ण",
      note: "नोट",
      section: "खंड",
      goToSection: "खंड पर जाएं",
      keyPointsNotice60: "गैर-नवीनीकरण के लिए 60-दिन की सूचना आवश्यक (मानक 30 दिनों से अधिक)",
      keyPointsExclusivity: "विशिष्टता खंड बोर्ड की अनुमति के बिना बाहरी काम को प्रतिबंधित करता है",
      keyPointsSalary: "रोजगार अवधि के दौरान आधार वेतन घटाया नहीं जा सकता"
    },
    // Document Viewer - Hindi
    originalDocument: "मूल दस्तावेज़",
    analysisResults: "विश्लेषण परिणाम",
    keyInsights: "मुख्य अंतर्दृष्टि",
    riskAssessment: "जोखिम मूल्यांकन",
    complianceCheck: "अनुपालन जांच",
    aiInsights: "एआई अंतर्दृष्टि",
    confidenceScore: "विश्वास स्कोर",
    overallAssessment: "समग्र मूल्यांकन",
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    downloadDocument: "दस्तावेज़ डाउनलोड करें",
    shareDocument: "दस्तावेज़ साझा करें",
    bookmarkDocument: "दस्तावेज़ बुकमार्क करें",
    zoomIn: "ज़ूम इन",
    zoomOut: "ज़ूम आउट",
    rotate: "घुमाएं",
    search: "खोजें",
    searchPlaceholder: "दस्तावेज़ में खोजें...",
    documentNotFound: "दस्तावेज़ नहीं मिला",
    documentNotFoundDesc: "अनुरोधित दस्तावेज़ लोड नहीं किया जा सका।",
    loadingDocument: "दस्तावेज़ लोड हो रहा है...",
    
    // Chat Bot - Hindi
    chatAssistant: "चैट सहायक",
    askQuestion: "इस दस्तावेज़ के बारे में मुझसे पूछें...",
    chatPlaceholder: "अपना प्रश्न यहाँ टाइप करें...",
    send: "भेजें",
    hello: "नमस्ते! मैं आपका कानूनी दस्तावेज़ सहायक हूँ।",
    analysisComplete: "मैंने इस दस्तावेज़ का विश्लेषण किया है और इसकी सामग्री को समझने में आपकी सहायता के लिए यहाँ हूँ।",
    askAnything: "अनुबंध की शर्तों, खंडों, या किसी विशिष्ट अनुभाग के बारे में मुझसे कुछ भी पूछें।",
    
    keyPointsTitle: "मुख्य बिंदु",
    potentialRisks: "संभावित जोखिम",
    complianceStatus: "अनुपालन स्थिति",
    
    loading: "लोड हो रहा है...",
    error: "त्रुटि हुई",
    tryAgain: "कृपया फिर से कोशिश करें",
    success: "सफलता",
    
    // Upload Dialog UI - Hindi
    ui: {
      uploadDocuments: "दस्तावेज़ अपलोड करें",
      selectedFiles: "चुनी गई फ़ाइलें",
      persona: "आपकी भूमिका/व्यक्तित्व",
      personaPlaceholder: "उदा., कानूनी पेशेवर, छात्र, व्यापारी...",
      jobToBeDone: "आप क्या हासिल करना चाहते हैं?",
      jobPlaceholder: "उदा., अनुबंध की शर्तों का विश्लेषण, मुख्य जानकारी निकालना, दस्तावेज़ का सारांश...",
      cancel: "रद्द करें",
      uploadAndProcess: "अपलोड और प्रक्रिया",
      uploading: "अपलोड हो रहा है...",
      processing: "प्रसंस्करण...",
      uploadSuccess: "फ़ाइलें सफलतापूर्वक अपलोड हुईं",
      processingComplete: "दस्तावेज़ प्रसंस्करण पूर्ण"
    }
  },
  
  // Tamil translations
  ta: {
    // Document Content - Tamil
    documentContent: {
      employmentAgreementTitle: "வேலை ஒப்பந்தம்",
      employmentAgreementIntro: "இந்த வேலை ஒப்பந்தம் ஜனவரி 15, 2023 அன்று ACME கார்ப்பரேஷன் மற்றும் JOHN DOE இடையே கையெழுத்திடப்பட்டது.",
      whereasCompany: "நிறுவனம் பணியாளரை பணியமர்த்த விரும்புகிறது;",
      whereasEmployee: "பணியாளர் நிறுவனத்தில் பணியாற்ற விரும்புகிறார்.",
      termOfEmploymentTitle: "1. வேலை காலம்",
      termOfEmploymentContent: "வேலை காலம் மூன்று (3) ஆண்டுகள். 60 நாட்கள் முன் அறிவிப்பு இல்லாவிட்டால் தானாகவே ஒரு வருடம் புதுப்பிக்கப்படும்.",
      positionAndDutiesTitle: "2. பதவி மற்றும் கடமைகள்",
      positionSubtitle: "2.1 பதவி.",
      positionContent: "பணியாளர் தலைமை தொழில்நுட்ப அதிகாரியாக பணியாற்றுவார்.",
      dutiesSubtitle: "2.2 கடமைகள்.",
      dutiesContent: "பணியாளர் தனது முழு நேரத்தையும் இந்த பணிக்கு அர்ப்பணிக்க வேண்டும்.",
      compensationAndBenefitsTitle: "3. ஊதியம் மற்றும் பலன்கள்",
      baseSalarySubtitle: "3.1 அடிப்படை ஊதியம்.",
      baseSalaryContent: "வருடாந்திர அடிப்படை ஊதியம் $225,000.",
      annualBonusSubtitle: "3.2 வருடாந்திர போனஸ்.",
      annualBonusContent: "அடிப்படை ஊதியத்தின் 25% போனஸ் இலக்கு."
    },
    summaryContent: {
      employmentTerm: "வேலை காலம்",
      employmentTermDesc: "3 ஆண்டு வேலை, 60 நாட்கள் அறிவிப்புடன் புதுப்பிப்பு",
      positionReporting: "பதவி மற்றும் அறிக்கை",
      positionReportingDesc: "CTO பதவி, CEO க்கு அறிக்கை",
      exclusivityReq: "பிரத்யேக தேவை",
      exclusivityReqDesc: "முழு நேர அர்ப்பணிப்பு தேவை",
      compensation: "ஊதியம்",
      compensationDesc: "$225,000 அடிப்படை ஊதியம் + 25% போனஸ்"
    },
    originalDocument: "அசல் ஆவணம்",
    backToDashboard: "டாஷ்போர்டுக்கு திரும்பு",
    downloadDocument: "ஆவணத்தை பதிவிறக்கு",
    shareDocument: "ஆவணத்தை பகிர்",
    search: "தேடு",
    searchPlaceholder: "ஆவணத்தில் தேடு...",
    chatAssistant: "அரட்டை உதவியாளர்",
    askQuestion: "இந்த ஆவணத்தைப் பற்றி கேளுங்கள்...",
    chatPlaceholder: "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்...",
    hello: "வணக்கம்! நான் உங்கள் சட்ட ஆவண உதவியாளர்.",
    loading: "ஏற்றுகிறது...",
    error: "பிழை ஏற்பட்டது",
    tryAgain: "மீண்டும் முயற்சி செய்யுங்கள்"
  },

  // Telugu translations
  te: {
    documentContent: {
      employmentAgreementTitle: "ఉపాధి ఒప్పందం",
      employmentAgreementIntro: "ఈ ఉపాధి ఒప్పందం జనవరి 15, 2023న ACME కార్పొరేషన్ మరియు JOHN DOE మధ్య కుదుర్చబడింది.",
      whereasCompany: "కంపెనీ ఉద్యోగిని నియమించాలని అనుకుంటుంది;",
      whereasEmployee: "ఉద్యోగి కంపెనీలో పని చేయాలని అనుకుంటున్నారు.",
      termOfEmploymentTitle: "1. ఉపాధి కాలం",
      termOfEmploymentContent: "ఉపాధి కాలం మూడు (3) సంవత్సరాలు. 60 రోజుల ముందస్తు నోటీసు లేకుంటే స్వయంచాలకంగా పునరుద్ధరించబడుతుంది.",
      positionAndDutiesTitle: "2. స్థానం మరియు విధులు",
      positionSubtitle: "2.1 స్థానం.",
      positionContent: "ఉద్యోగి చీఫ్ టెక్నాలజీ ఆఫీసర్‌గా పని చేస్తారు.",
      dutiesSubtitle: "2.2 విధులు.",
      dutiesContent: "ఉద్యోగి తమ పూర్తి సమయాన్ని ఈ పనికి అంకితం చేయాలి.",
      compensationAndBenefitsTitle: "3. పరిహారం మరియు ప్రయోజనాలు",
      baseSalarySubtitle: "3.1 ప్రాథమిక జీతం.",
      baseSalaryContent: "వార్షిక ప్రాథమిక జీతం $225,000.",
      annualBonusSubtitle: "3.2 వార్షిక బోనస్.",
      annualBonusContent: "ప్రాథమిక జీతంలో 25% బోనస్ లక్ష్యం."
    },
    summaryContent: {
      employmentTerm: "ఉపాధి కాలం",
      employmentTermDesc: "3 సంవత్సరాల ఉపాధి, 60 రోజుల నోటీసుతో పునరుద్ధరణ",
      positionReporting: "స్థానం మరియు రిపోర్టింగ్",
      positionReportingDesc: "CTO స్థానం, CEO కి రిపోర్ట్",
      exclusivityReq: "ప్రత్యేకత అవసరం",
      exclusivityReqDesc: "పూర్తి సమయ అంకితభావం అవసరం",
      compensation: "పరిహారం",
      compensationDesc: "$225,000 ప్రాథమిక జీతం + 25% బోనస్"
    },
    originalDocument: "అసలు పత్రం",
    backToDashboard: "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్ళండి",
    downloadDocument: "పత్రాన్ని డౌన్‌లోడ్ చేయండి",
    shareDocument: "పత్రాన్ని భాగస్వామ్యం చేయండి",
    search: "వెతకండి",
    searchPlaceholder: "పత్రంలో వెతకండి...",
    chatAssistant: "చాట్ అసిస్టెంట్",
    askQuestion: "ఈ పత్రం గురించి అడగండి...",
    chatPlaceholder: "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...",
    hello: "నమస్కారం! నేను మీ చట్టపరమైన పత్ర సహాయకుడిని.",
    loading: "లోడ్ అవుతోంది...",
    error: "లోపం సంభవించింది",
    tryAgain: "దయచేసి మళ్లీ ప్రయత్నించండి"
  },

  // Bengali translations
  bn: {
    documentContent: {
      employmentAgreementTitle: "চাকরির চুক্তি",
      employmentAgreementIntro: "এই চাকরির চুক্তিটি জানুয়ারি 15, 2023 তারিখে ACME কর্পোরেশন এবং JOHN DOE এর মধ্যে স্বাক্ষরিত হয়েছে।",
      whereasCompany: "কোম্পানি কর্মচারী নিয়োগ করতে চায়;",
      whereasEmployee: "কর্মচারী কোম্পানিতে কাজ করতে চায়।",
      termOfEmploymentTitle: "1. চাকরির মেয়াদ",
      termOfEmploymentContent: "চাকরির মেয়াদ তিন (3) বছর। 60 দিনের পূর্ব নোটিশ ছাড়া স্বয়ংক্রিয়ভাবে নবায়ন হবে।",
      positionAndDutiesTitle: "2. পদ এবং দায়িত্ব",
      positionSubtitle: "2.1 পদ।",
      positionContent: "কর্মচারী প্রধান প্রযুক্তি কর্মকর্তা হিসেবে কাজ করবেন।",
      dutiesSubtitle: "2.2 দায়িত্ব।",
      dutiesContent: "কর্মচারী তার পূর্ণ সময় এই কাজে নিবেদিত করবেন।",
      compensationAndBenefitsTitle: "3. ক্ষতিপূরণ এবং সুবিধা",
      baseSalarySubtitle: "3.1 মূল বেতন।",
      baseSalaryContent: "বার্ষিক মূল বেতন $225,000।",
      annualBonusSubtitle: "3.2 বার্ষিক বোনাস।",
      annualBonusContent: "মূল বেতনের 25% বোনাস লক্ষ্য।"
    },
    summaryContent: {
      employmentTerm: "চাকরির মেয়াদ",
      employmentTermDesc: "3 বছরের চাকরি, 60 দিনের নোটিশে নবায়ন",
      positionReporting: "পদ এবং রিপোর্টিং",
      positionReportingDesc: "CTO পদ, CEO কে রিপোর্ট",
      exclusivityReq: "এক্সক্লুসিভিটি প্রয়োজন",
      exclusivityReqDesc: "পূর্ণ সময়ের নিবেদন প্রয়োজন",
      compensation: "ক্ষতিপূরণ",
      compensationDesc: "$225,000 মূল বেতন + 25% বোনাস"
    },
    originalDocument: "মূল নথি",
    backToDashboard: "ড্যাশবোর্ডে ফিরে যান",
    downloadDocument: "নথি ডাউনলোড করুন",
    shareDocument: "নথি শেয়ার করুন",
    search: "খুঁজুন",
    searchPlaceholder: "নথিতে খুঁজুন...",
    chatAssistant: "চ্যাট সহায়ক",
    askQuestion: "এই নথি সম্পর্কে জিজ্ঞাসা করুন...",
    chatPlaceholder: "এখানে আপনার প্রশ্ন টাইপ করুন...",
    hello: "হ্যালো! আমি আপনার আইনি নথি সহায়ক।",
    loading: "লোড হচ্ছে...",
    error: "ত্রুটি ঘটেছে",
    tryAgain: "আবার চেষ্টা করুন"
  },

  // Gujarati translations
  gu: {
    documentContent: {
      employmentAgreementTitle: "રોજગાર કરાર",
      employmentAgreementIntro: "આ રોજગાર કરાર 15 જાન્યુઆરી, 2023 ના રોજ ACME કોર્પોરેશન અને JOHN DOE વચ્ચે કરવામાં આવ્યો છે.",
      whereasCompany: "કંપની કર્મચારીને નોકરીએ રાખવા માંગે છે;",
      whereasEmployee: "કર્મચારી કંપનીમાં કામ કરવા માંગે છે.",
      termOfEmploymentTitle: "1. રોજગારની અવધિ",
      termOfEmploymentContent: "રોજગારની અવધિ ત્રણ (3) વર્ષ છે. 60 દિવસની પૂર્વ સૂચના વિના આપોઆપ નવીકરણ થશે.",
      positionAndDutiesTitle: "2. હોદ્દો અને ફરજો",
      positionSubtitle: "2.1 હોદ્દો.",
      positionContent: "કર્મચારી ચીફ ટેકનોલોજી ઓફિસર તરીકે કામ કરશે.",
      dutiesSubtitle: "2.2 ફરજો.",
      dutiesContent: "કર્મચારી તેમનો સંપૂર્ણ સમય આ કામમાં સમર્પિત કરશે.",
      compensationAndBenefitsTitle: "3. વળતર અને લાભો",
      baseSalarySubtitle: "3.1 મૂળ પગાર.",
      baseSalaryContent: "વાર્ષિક મૂળ પગાર $225,000.",
      annualBonusSubtitle: "3.2 વાર્ષિક બોનસ.",
      annualBonusContent: "મૂળ પગારના 25% બોનસ લક્ષ્ય."
    },
    summaryContent: {
      employmentTerm: "રોજગારની અવધિ",
      employmentTermDesc: "3 વર્ષનો રોજગાર, 60 દિવસની સૂચના સાથે નવીકરણ",
      positionReporting: "હોદ્દો અને રિપોર્ટિંગ",
      positionReportingDesc: "CTO હોદ્દો, CEO ને રિપોર્ટ",
      exclusivityReq: "વિશિષ્ટતાની જરૂરિયાત",
      exclusivityReqDesc: "પૂર્ણકાલિક સમર્પણ જરૂરી",
      compensation: "વળતર",
      compensationDesc: "$225,000 મૂળ પગાર + 25% બોનસ"
    },
    originalDocument: "મૂળ દસ્તાવેજ",
    backToDashboard: "ડેશબોર્ડ પર પાછા જાઓ",
    downloadDocument: "દસ્તાવેજ ડાઉનલોડ કરો",
    shareDocument: "દસ્તાવેજ શેર કરો",
    search: "શોધો",
    searchPlaceholder: "દસ્તાવેજમાં શોધો...",
    chatAssistant: "ચેટ સહાયક",
    askQuestion: "આ દસ્તાવેજ વિશે પૂછો...",
    chatPlaceholder: "તમારો પ્રશ્ન અહીં ટાઈપ કરો...",
    hello: "નમસ્તે! હું તમારો કાનૂની દસ્તાવેજ સહાયક છું.",
    loading: "લોડ થઈ રહ્યું છે...",
    error: "ભૂલ થઈ",
    tryAgain: "મહેરબાની કરીને ફરી પ્રયાસ કરો"
  },

  // Marathi translations
  mr: {
    documentContent: {
      employmentAgreementTitle: "नोकरी करार",
      employmentAgreementIntro: "हा नोकरी करार 15 जानेवारी, 2023 रोजी ACME कॉर्पोरेशन आणि JOHN DOE यांच्यात करण्यात आला आहे.",
      whereasCompany: "कंपनी कर्मचाऱ्याला नोकरीवर घेऊ इच्छिते;",
      whereasEmployee: "कर्मचारी कंपनीत काम करू इच्छितो.",
      termOfEmploymentTitle: "1. नोकरीचा कालावधी",
      termOfEmploymentContent: "नोकरीचा कालावधी तीन (3) वर्षे आहे. 60 दिवसांची पूर्व सूचना न दिल्यास आपोआप नूतनीकरण होईल.",
      positionAndDutiesTitle: "2. पद आणि कर्तव्ये",
      positionSubtitle: "2.1 पद.",
      positionContent: "कर्मचारी मुख्य तंत्रज्ञान अधिकारी म्हणून काम करेल.",
      dutiesSubtitle: "2.2 कर्तव्ये.",
      dutiesContent: "कर्मचाऱ्याने त्यांचा संपूर्ण वेळ या कामासाठी समर्पित करावा.",
      compensationAndBenefitsTitle: "3. नुकसानभरपाई आणि फायदे",
      baseSalarySubtitle: "3.1 मूळ पगार.",
      baseSalaryContent: "वार्षिक मूळ पगार $225,000.",
      annualBonusSubtitle: "3.2 वार्षिक बोनस.",
      annualBonusContent: "मूळ पगाराच्या 25% बोनसचे लक्ष्य."
    },
    summaryContent: {
      employmentTerm: "नोकरीचा कालावधी",
      employmentTermDesc: "3 वर्षांची नोकरी, 60 दिवसांच्या सूचनेने नूतनीकरण",
      positionReporting: "पद आणि अहवाल",
      positionReportingDesc: "CTO पद, CEO ला अहवाल",
      exclusivityReq: "विशेषता आवश्यकता",
      exclusivityReqDesc: "पूर्णवेळ समर्पण आवश्यक",
      compensation: "नुकसानभरपाई",
      compensationDesc: "$225,000 मूळ पगार + 25% बोनस"
    },
    originalDocument: "मूळ दस्तऐवज",
    backToDashboard: "डॅशबोर्डवर परत या",
    downloadDocument: "दस्तऐवज डाउनलोड करा",
    shareDocument: "दस्तऐवज शेअर करा",
    search: "शोध",
    searchPlaceholder: "दस्तऐवजात शोधा...",
    chatAssistant: "चॅट सहाय्यक",
    askQuestion: "या दस्तऐवजाविषयी विचारा...",
    chatPlaceholder: "तुमचा प्रश्न इथे टाइप करा...",
    hello: "नमस्कार! मी तुमचा कायदेशीर दस्तऐवज सहाय्यक आहे.",
    loading: "लोड होत आहे...",
    error: "त्रुटी घडली",
    tryAgain: "कृपया पुन्हा प्रयत्न करा"
  },

  // Kannada translations
  kn: {
    documentContent: {
      employmentAgreementTitle: "ಉದ್ಯೋಗ ಒಪ್ಪಂದ",
      employmentAgreementIntro: "ಈ ಉದ್ಯೋಗ ಒಪ್ಪಂದವು ಜನವರಿ 15, 2023 ರಂದು ACME ಕಾರ್ಪೊರೇಷನ್ ಮತ್ತು JOHN DOE ನಡುವೆ ಮಾಡಲಾಗಿದೆ.",
      whereasCompany: "ಕಂಪನಿಯು ಉದ್ಯೋಗಿಯನ್ನು ನೇಮಿಸಿಕೊಳ್ಳಲು ಬಯಸುತ್ತದೆ;",
      whereasEmployee: "ಉದ್ಯೋಗಿಯು ಕಂಪನಿಯಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ಬಯಸುತ್ತಾರೆ.",
      termOfEmploymentTitle: "1. ಉದ್ಯೋಗದ ಅವಧಿ",
      termOfEmploymentContent: "ಉದ್ಯೋಗದ ಅವಧಿ ಮೂರು (3) ವರ್ಷಗಳು. 60 ದಿನಗಳ ಮುಂಚಿನ ಸೂಚನೆ ಇಲ್ಲದಿದ್ದರೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನವೀಕರಣವಾಗುತ್ತದೆ.",
      positionAndDutiesTitle: "2. ಸ್ಥಾನ ಮತ್ತು ಕರ್ತವ್ಯಗಳು",
      positionSubtitle: "2.1 ಸ್ಥಾನ.",
      positionContent: "ಉದ್ಯೋಗಿಯು ಮುಖ್ಯ ತಂತ್ರಜ್ಞಾನ ಅಧಿಕಾರಿಯಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತಾರೆ.",
      dutiesSubtitle: "2.2 ಕರ್ತವ್ಯಗಳು.",
      dutiesContent: "ಉದ್ಯೋಗಿಯು ತಮ್ಮ ಸಂಪೂರ್ಣ ಸಮಯವನ್ನು ಈ ಕೆಲಸಕ್ಕೆ ಸಮರ್ಪಿಸಬೇಕು.",
      compensationAndBenefitsTitle: "3. ಪರಿಹಾರ ಮತ್ತು ಪ್ರಯೋಜನಗಳು",
      baseSalarySubtitle: "3.1 ಮೂಲ ಸಂಬಳ.",
      baseSalaryContent: "ವಾರ್ಷಿಕ ಮೂಲ ಸಂಬಳ $225,000.",
      annualBonusSubtitle: "3.2 ವಾರ್ಷಿಕ ಬೋನಸ್.",
      annualBonusContent: "ಮೂಲ ಸಂಬಳದ 25% ಬೋನಸ್ ಗುರಿ."
    },
    summaryContent: {
      employmentTerm: "ಉದ್ಯೋಗದ ಅವಧಿ",
      employmentTermDesc: "3 ವರ್ಷಗಳ ಉದ್ಯೋಗ, 60 ದಿನಗಳ ಸೂಚನೆಯೊಂದಿಗೆ ನವೀಕರಣ",
      positionReporting: "ಸ್ಥಾನ ಮತ್ತು ವರದಿ",
      positionReportingDesc: "CTO ಸ್ಥಾನ, CEO ಗೆ ವರದಿ",
      exclusivityReq: "ವಿಶೇಷತೆಯ ಅವಶ್ಯಕತೆ",
      exclusivityReqDesc: "ಪೂರ್ಣಾವಧಿ ಸಮರ್ಪಣೆ ಅವಶ್ಯಕ",
      compensation: "ಪರಿಹಾರ",
      compensationDesc: "$225,000 ಮೂಲ ಸಂಬಳ + 25% ಬೋನಸ್"
    },
    originalDocument: "ಮೂಲ ಡಾಕ್ಯುಮೆಂಟ್",
    backToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    downloadDocument: "ಡಾಕ್ಯುಮೆಂಟ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    shareDocument: "ಡಾಕ್ಯುಮೆಂಟ್ ಹಂಚಿಕೊಳ್ಳಿ",
    search: "ಹುಡುಕಿ",
    searchPlaceholder: "ಡಾಕ್ಯುಮೆಂಟ್‌ನಲ್ಲಿ ಹುಡುಕಿ...",
    chatAssistant: "ಚಾಟ್ ಸಹಾಯಕ",
    askQuestion: "ಈ ಡಾಕ್ಯುಮೆಂಟ್ ಬಗ್ಗೆ ಕೇಳಿ...",
    chatPlaceholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
    hello: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕಾನೂನು ಡಾಕ್ಯುಮೆಂಟ್ ಸಹಾಯಕ.",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    error: "ದೋಷ ಸಂಭವಿಸಿದೆ",
    tryAgain: "ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ"
  }
};

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' }
];

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
    }
  };

  const translate = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const translateResponse = async (text, targetLanguage) => {
    if (targetLanguage === 'en') return text;
    
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDp8UDk012Fs6iAoU71MNmbx0IRE5S6_5w');
      
      const languageNames = {
        'hi': 'Hindi (हिन्दी)',
        'ta': 'Tamil (தமிழ்)',
        'te': 'Telugu (తెలుగు)',
        'bn': 'Bengali (বাংলা)',
        'gu': 'Gujarati (ગુજરાતી)',
        'mr': 'Marathi (मराठी)',
        'kn': 'Kannada (ಕನ್ನಡ)'
      };

      const targetLanguageName = languageNames[targetLanguage] || targetLanguage;
      
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const translationPrompt = `Translate the following text to ${targetLanguageName}. Provide only the translation:

${text}`;

        const result = await model.generateContent(translationPrompt);
        const response = await result.response;
        return response.text().trim();
      } catch (apiError) {
        return `[${languageNames[targetLanguage] || targetLanguage}] ${text}`;
      }
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    translate,
    translateResponse,
    languages,
    t: translations[currentLanguage] || translations.en
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;