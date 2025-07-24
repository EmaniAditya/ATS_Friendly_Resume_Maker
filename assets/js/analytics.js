/**
 * Simple analytics module for ATS Resume Maker
 * Tracks usage patterns without collecting personal data
 * All data is stored locally and not sent to any server
 */

// Constants for localStorage
const ANALYTICS_KEY = 'ats_resume_analytics';

// Analytics data structure
const DEFAULT_ANALYTICS = {
  // App usage
  appOpens: 0,
  lastOpened: null,
  
  // Feature usage
  pdfDownloads: 0,
  plainTextDownloads: 0,
  templateChanges: 0,
  keywordAnalysis: 0,
  
  // Section usage (which sections users add the most entries to)
  sectionUsage: {
    experience: 0,
    education: 0,
    projects: 0,
    certifications: 0,
    languages: 0,
    achievements: 0,
    skills: 0
  },
  
  // Template popularity
  templateUsage: {
    classic: 0,
    modern: 0,
    minimalist: 0,
    professional: 0
  },
  
  // Version management
  versionsSaved: 0,
  versionsLoaded: 0
};

/**
 * Initialize analytics
 */
function initAnalytics() {
  // Get existing analytics or create new ones
  let analytics = getAnalytics();
  
  // Update app opens
  analytics.appOpens += 1;
  analytics.lastOpened = new Date().toISOString();
  
  // Save analytics
  saveAnalytics(analytics);
  
  // Log initialization
  console.log('Analytics initialized');
}

/**
 * Get analytics data from localStorage
 * @returns {Object} Analytics data
 */
function getAnalytics() {
  const analyticsJson = localStorage.getItem(ANALYTICS_KEY);
  return analyticsJson ? JSON.parse(analyticsJson) : { ...DEFAULT_ANALYTICS };
}

/**
 * Save analytics data to localStorage
 * @param {Object} analytics Analytics data
 */
function saveAnalytics(analytics) {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

/**
 * Track a feature usage
 * @param {string} feature Feature name
 */
function trackFeatureUsage(feature) {
  const analytics = getAnalytics();
  
  switch (feature) {
    case 'pdfDownload':
      analytics.pdfDownloads += 1;
      break;
    case 'plainTextDownload':
      analytics.plainTextDownloads += 1;
      break;
    case 'templateChange':
      analytics.templateChanges += 1;
      break;
    case 'keywordAnalysis':
      analytics.keywordAnalysis += 1;
      break;
    case 'versionSave':
      analytics.versionsSaved += 1;
      break;
    case 'versionLoad':
      analytics.versionsLoaded += 1;
      break;
  }
  
  saveAnalytics(analytics);
}

/**
 * Track section usage
 * @param {string} section Section name
 */
function trackSectionUsage(section) {
  const analytics = getAnalytics();
  
  if (analytics.sectionUsage.hasOwnProperty(section)) {
    analytics.sectionUsage[section] += 1;
  }
  
  saveAnalytics(analytics);
}

/**
 * Track template usage
 * @param {string} template Template name
 */
function trackTemplateUsage(template) {
  const analytics = getAnalytics();
  
  if (analytics.templateUsage.hasOwnProperty(template)) {
    analytics.templateUsage[template] += 1;
  }
  
  saveAnalytics(analytics);
}

/**
 * Get usage report
 * @returns {string} Usage report in text format
 */
function getUsageReport() {
  const analytics = getAnalytics();
  
  let report = '# ATS Resume Maker Usage Report\n\n';
  
  // App usage
  report += '## App Usage\n';
  report += `- Total app opens: ${analytics.appOpens}\n`;
  report += `- Last opened: ${analytics.lastOpened ? new Date(analytics.lastOpened).toLocaleString() : 'Never'}\n\n`;
  
  // Feature usage
  report += '## Feature Usage\n';
  report += `- PDF downloads: ${analytics.pdfDownloads}\n`;
  report += `- Plain text downloads: ${analytics.plainTextDownloads}\n`;
  report += `- Template changes: ${analytics.templateChanges}\n`;
  report += `- Keyword analyses: ${analytics.keywordAnalysis}\n`;
  report += `- Versions saved: ${analytics.versionsSaved}\n`;
  report += `- Versions loaded: ${analytics.versionsLoaded}\n\n`;
  
  // Section usage
  report += '## Section Usage\n';
  Object.entries(analytics.sectionUsage).forEach(([section, count]) => {
    report += `- ${section}: ${count}\n`;
  });
  report += '\n';
  
  // Template usage
  report += '## Template Usage\n';
  Object.entries(analytics.templateUsage).forEach(([template, count]) => {
    report += `- ${template}: ${count}\n`;
  });
  
  return report;
}

/**
 * Reset analytics data
 */
function resetAnalytics() {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify({ ...DEFAULT_ANALYTICS }));
}

// Initialize analytics when the script loads
document.addEventListener('DOMContentLoaded', initAnalytics); 