import React, { createContext, useContext, useState, ReactNode } from 'react';

// Language types
export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ar';

// Translation interface for DocumentViewer
interface DocumentViewerTranslations {
  header: {
    backToDashboard: string;
    download: string;
    share: string;
    bookmark: string;
    documentNotFound: string;
    loadingDocument: string;
  };
  viewer: {
    zoomIn: string;
    zoomOut: string;
    rotate: string;
    search: string;
    originalDocument: string;
    searchPlaceholder: string;
  };
  analysis: {
    aiAnalysis: string;
    summary: string;
    risks: string;
    compliance: string;
    insights: string;
    documentSummary: string;
    keyPoints: string;
    potentialRisks: string;
    complianceCheck: string;
    aiInsights: string;
    confidenceScore: string;
    overallAssessment: string;
    analyzed: string;
    processing: string;
    pending: string;
  };
  status: {
    analyzed: string;
    processing: string;
    pending: string;
  };
  common: {
    type: string;
    size: string;
    uploadDate: string;
    pages: string;
    uploaded: string;
  };
}

// Complete translations object
const translations: Record<Language, DocumentViewerTranslations> = {
  en: {
    header: {
      backToDashboard: 'Back to Dashboard',
      download: 'Download',
      share: 'Share',
      bookmark: 'Bookmark',
      documentNotFound: 'Document not found',
      loadingDocument: 'Loading document...'
    },
    viewer: {
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      rotate: 'Rotate',
      search: 'Search',
      originalDocument: 'Original Document',
      searchPlaceholder: 'Search in document...'
    },
    analysis: {
      aiAnalysis: 'AI Analysis',
      summary: 'Summary',
      risks: 'Risks',
      compliance: 'Compliance',
      insights: 'Insights',
      documentSummary: 'Document Summary',
      keyPoints: 'Key Points',
      potentialRisks: 'Potential Risks',
      complianceCheck: 'Compliance Check',
      aiInsights: 'AI Insights',
      confidenceScore: 'Confidence Score',
      overallAssessment: 'Overall Assessment',
      analyzed: 'Analyzed',
      processing: 'Processing',
      pending: 'Pending'
    },
    status: {
      analyzed: 'Analyzed',
      processing: 'Processing',
      pending: 'Pending'
    },
    common: {
      type: 'Type',
      size: 'Size',
      uploadDate: 'Upload Date',
      pages: 'pages',
      uploaded: 'Uploaded'
    }
  },
  es: {
    header: {
      backToDashboard: 'Volver al Panel',
      download: 'Descargar',
      share: 'Compartir',
      bookmark: 'Marcador',
      documentNotFound: 'Documento no encontrado',
      loadingDocument: 'Cargando documento...'
    },
    viewer: {
      zoomIn: 'Acercar',
      zoomOut: 'Alejar',
      rotate: 'Rotar',
      search: 'Buscar',
      originalDocument: 'Documento Original',
      searchPlaceholder: 'Buscar en documento...'
    },
    analysis: {
      aiAnalysis: 'Análisis IA',
      summary: 'Resumen',
      risks: 'Riesgos',
      compliance: 'Cumplimiento',
      insights: 'Perspectivas',
      documentSummary: 'Resumen del Documento',
      keyPoints: 'Puntos Clave',
      potentialRisks: 'Riesgos Potenciales',
      complianceCheck: 'Verificación de Cumplimiento',
      aiInsights: 'Perspectivas de IA',
      confidenceScore: 'Puntuación de Confianza',
      overallAssessment: 'Evaluación General',
      analyzed: 'Analizado',
      processing: 'Procesando',
      pending: 'Pendiente'
    },
    status: {
      analyzed: 'Analizado',
      processing: 'Procesando',
      pending: 'Pendiente'
    },
    common: {
      type: 'Tipo',
      size: 'Tamaño',
      uploadDate: 'Fecha de Subida',
      pages: 'páginas',
      uploaded: 'Subido'
    }
  },
  fr: {
    header: {
      backToDashboard: 'Retour au Tableau de Bord',
      download: 'Télécharger',
      share: 'Partager',
      bookmark: 'Signet',
      documentNotFound: 'Document non trouvé',
      loadingDocument: 'Chargement du document...'
    },
    viewer: {
      zoomIn: 'Zoom Avant',
      zoomOut: 'Zoom Arrière',
      rotate: 'Tourner',
      search: 'Rechercher',
      originalDocument: 'Document Original',
      searchPlaceholder: 'Rechercher dans le document...'
    },
    analysis: {
      aiAnalysis: 'Analyse IA',
      summary: 'Résumé',
      risks: 'Risques',
      compliance: 'Conformité',
      insights: 'Aperçus',
      documentSummary: 'Résumé du Document',
      keyPoints: 'Points Clés',
      potentialRisks: 'Risques Potentiels',
      complianceCheck: 'Vérification de Conformité',
      aiInsights: 'Aperçus IA',
      confidenceScore: 'Score de Confiance',
      overallAssessment: 'Évaluation Globale',
      analyzed: 'Analysé',
      processing: 'En Traitement',
      pending: 'En Attente'
    },
    status: {
      analyzed: 'Analysé',
      processing: 'En Traitement',
      pending: 'En Attente'
    },
    common: {
      type: 'Type',
      size: 'Taille',
      uploadDate: 'Date de Téléchargement',
      pages: 'pages',
      uploaded: 'Téléchargé'
    }
  },
  de: {
    header: {
      backToDashboard: 'Zurück zum Dashboard',
      download: 'Herunterladen',
      share: 'Teilen',
      bookmark: 'Lesezeichen',
      documentNotFound: 'Dokument nicht gefunden',
      loadingDocument: 'Dokument wird geladen...'
    },
    viewer: {
      zoomIn: 'Vergrößern',
      zoomOut: 'Verkleinern',
      rotate: 'Drehen',
      search: 'Suchen',
      originalDocument: 'Originaldokument',
      searchPlaceholder: 'Im Dokument suchen...'
    },
    analysis: {
      aiAnalysis: 'KI-Analyse',
      summary: 'Zusammenfassung',
      risks: 'Risiken',
      compliance: 'Compliance',
      insights: 'Einblicke',
      documentSummary: 'Dokumentzusammenfassung',
      keyPoints: 'Wichtige Punkte',
      potentialRisks: 'Potenzielle Risiken',
      complianceCheck: 'Compliance-Prüfung',
      aiInsights: 'KI-Einblicke',
      confidenceScore: 'Vertrauenswert',
      overallAssessment: 'Gesamtbewertung',
      analyzed: 'Analysiert',
      processing: 'Verarbeitung',
      pending: 'Ausstehend'
    },
    status: {
      analyzed: 'Analysiert',
      processing: 'Verarbeitung',
      pending: 'Ausstehend'
    },
    common: {
      type: 'Typ',
      size: 'Größe',
      uploadDate: 'Upload-Datum',
      pages: 'Seiten',
      uploaded: 'Hochgeladen'
    }
  },
  zh: {
    header: {
      backToDashboard: '返回仪表盘',
      download: '下载',
      share: '分享',
      bookmark: '书签',
      documentNotFound: '未找到文档',
      loadingDocument: '正在加载文档...'
    },
    viewer: {
      zoomIn: '放大',
      zoomOut: '缩小',
      rotate: '旋转',
      search: '搜索',
      originalDocument: '原始文档',
      searchPlaceholder: '在文档中搜索...'
    },
    analysis: {
      aiAnalysis: 'AI分析',
      summary: '摘要',
      risks: '风险',
      compliance: '合规',
      insights: '洞察',
      documentSummary: '文档摘要',
      keyPoints: '关键要点',
      potentialRisks: '潜在风险',
      complianceCheck: '合规检查',
      aiInsights: 'AI洞察',
      confidenceScore: '置信度分数',
      overallAssessment: '整体评估',
      analyzed: '已分析',
      processing: '处理中',
      pending: '待处理'
    },
    status: {
      analyzed: '已分析',
      processing: '处理中',
      pending: '待处理'
    },
    common: {
      type: '类型',
      size: '大小',
      uploadDate: '上传日期',
      pages: '页',
      uploaded: '已上传'
    }
  },
  ja: {
    header: {
      backToDashboard: 'ダッシュボードに戻る',
      download: 'ダウンロード',
      share: '共有',
      bookmark: 'ブックマーク',
      documentNotFound: 'ドキュメントが見つかりません',
      loadingDocument: 'ドキュメントを読み込み中...'
    },
    viewer: {
      zoomIn: 'ズームイン',
      zoomOut: 'ズームアウト',
      rotate: '回転',
      search: '検索',
      originalDocument: '元のドキュメント',
      searchPlaceholder: 'ドキュメント内を検索...'
    },
    analysis: {
      aiAnalysis: 'AI分析',
      summary: '要約',
      risks: 'リスク',
      compliance: 'コンプライアンス',
      insights: 'インサイト',
      documentSummary: 'ドキュメント要約',
      keyPoints: 'キーポイント',
      potentialRisks: '潜在的リスク',
      complianceCheck: 'コンプライアンスチェック',
      aiInsights: 'AIインサイト',
      confidenceScore: '信頼度スコア',
      overallAssessment: '総合評価',
      analyzed: '分析済み',
      processing: '処理中',
      pending: '保留中'
    },
    status: {
      analyzed: '分析済み',
      processing: '処理中',
      pending: '保留中'
    },
    common: {
      type: 'タイプ',
      size: 'サイズ',
      uploadDate: 'アップロード日',
      pages: 'ページ',
      uploaded: 'アップロード済み'
    }
  },
  ar: {
    header: {
      backToDashboard: 'العودة إلى لوحة التحكم',
      download: 'تحميل',
      share: 'مشاركة',
      bookmark: 'إشارة مرجعية',
      documentNotFound: 'لم يتم العثور على الوثيقة',
      loadingDocument: 'جاري تحميل الوثيقة...'
    },
    viewer: {
      zoomIn: 'تكبير',
      zoomOut: 'تصغير',
      rotate: 'تدوير',
      search: 'بحث',
      originalDocument: 'الوثيقة الأصلية',
      searchPlaceholder: 'البحث في الوثيقة...'
    },
    analysis: {
      aiAnalysis: 'تحليل الذكاء الاصطناعي',
      summary: 'ملخص',
      risks: 'مخاطر',
      compliance: 'امتثال',
      insights: 'رؤى',
      documentSummary: 'ملخص الوثيقة',
      keyPoints: 'النقاط الرئيسية',
      potentialRisks: 'المخاطر المحتملة',
      complianceCheck: 'فحص الامتثال',
      aiInsights: 'رؤى الذكاء الاصطناعي',
      confidenceScore: 'درجة الثقة',
      overallAssessment: 'التقييم العام',
      analyzed: 'تم التحليل',
      processing: 'قيد المعالجة',
      pending: 'معلق'
    },
    status: {
      analyzed: 'تم التحليل',
      processing: 'قيد المعالجة',
      pending: 'معلق'
    },
    common: {
      type: 'النوع',
      size: 'الحجم',
      uploadDate: 'تاريخ الرفع',
      pages: 'صفحات',
      uploaded: 'تم الرفع'
    }
  }
};

// Context interface
interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: DocumentViewerTranslations;
  availableLanguages: { code: Language; name: string; nativeName: string }[];
}

// Available languages list
export const availableLanguages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'es' as Language, name: 'Spanish', nativeName: 'Español' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français' },
  { code: 'de' as Language, name: 'German', nativeName: 'Deutsch' },
  { code: 'zh' as Language, name: 'Chinese', nativeName: '中文' },
  { code: 'ja' as Language, name: 'Japanese', nativeName: '日本語' },
  { code: 'ar' as Language, name: 'Arabic', nativeName: 'العربية' }
];

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Get saved language from localStorage or default to English
    const saved = localStorage.getItem('selectedLanguage') as Language;
    return saved && availableLanguages.find(lang => lang.code === saved) ? saved : 'en';
  });

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    
    // Update document direction for RTL languages
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t: translations[currentLanguage],
    availableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};