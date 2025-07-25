// ATS Optimization Functions

/**
 * Analyzes job description to find keyword matches with the resume
 */
function analyzeJobDescription() {
  const jobDescription = document.getElementById("jobDescription").value.trim();
  if (!jobDescription) {
    showToast("Please paste a job description to analyze", "warning");
    return;
  }
  
  // Extract keywords from job description
  const jobKeywords = extractKeywords(jobDescription);
  
  // Get resume content
  const resumeContent = document.getElementById("resumePreview").innerText;
  
  // Find matches
  const matches = [];
  const missing = [];
  
  jobKeywords.forEach(keyword => {
    if (resumeContent.toLowerCase().includes(keyword.toLowerCase())) {
      matches.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  // Calculate match percentage
  const matchPercentage = jobKeywords.length > 0 
    ? Math.round((matches.length / jobKeywords.length) * 100)
    : 0;
  
  // Display results
  document.getElementById("matchScore").textContent = matchPercentage + "%";
  
  const matchedKeywordsElement = document.getElementById("matchedKeywords");
  matchedKeywordsElement.innerHTML = matches.length > 0 
    ? matches.map(keyword => `<span class="badge bg-success me-1 mb-1">${keyword}</span>`).join('')
    : '<span class="text-muted">No matches found</span>';
  
  const missingKeywordsElement = document.getElementById("missingKeywords");
  missingKeywordsElement.innerHTML = missing.length > 0
    ? missing.map(keyword => `<span class="badge bg-secondary me-1 mb-1">${keyword}</span>`).join('')
    : '<span class="text-muted">No missing keywords</span>';
  
  // Show results
  document.getElementById("keywordResults").style.display = "block";
  
  // Highlight matching keywords in the resume
  highlightKeywords(matches);
}

/**
 * Extracts relevant keywords from text
 * @param {string} text - The job description text
 * @returns {string[]} Array of extracted keywords
 */
function extractKeywords(text) {
  // Common words to exclude
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "be", "been", "being",
    "in", "on", "at", "to", "for", "with", "by", "about", "as", "of", "from", "this", "that",
    "these", "those", "it", "its", "we", "us", "our", "they", "them", "their", "you", "your",
    "he", "him", "his", "she", "her", "hers", "will", "would", "shall", "should", "may", "might",
    "can", "could", "must", "have", "has", "had", "do", "does", "did", "not", "more", "most",
    "some", "such", "no", "nor", "too", "very", "just", "only", "than", "then", "so", "also"
  ]);
  
  // Extract words, remove punctuation, and filter out common words
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  // Count word frequency
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Get unique words sorted by frequency
  const uniqueWords = Object.keys(wordCount).sort((a, b) => wordCount[b] - wordCount[a]);
  
  // Extract technical skills and job-specific terms
  const technicalTerms = uniqueWords.filter(word => {
    return !stopWords.has(word) && (
      // Common technical terms
      word.includes("develop") || word.includes("program") || word.includes("engineer") ||
      word.includes("analy") || word.includes("design") || word.includes("manag") ||
      word.includes("data") || word.includes("software") || word.includes("web") ||
      word.includes("app") || word.includes("tech") || word.includes("code") ||
      word.includes("test") || word.includes("script") || word.includes("cloud") ||
      word.includes("agile") || word.includes("devops") || word.includes("frontend") ||
      word.includes("backend") || word.includes("fullstack") || word.includes("database") ||
      word.includes("security") || word.includes("network") || word.includes("system") ||
      word.includes("api") || word.includes("architecture") || word.includes("framework") ||
      word.includes("platform") || word.includes("solution") || word.includes("integration") ||
      word.includes("implement") || word.includes("infrastructure") || word.includes("deploy")
    );
  });
  
  // Extract programming languages and technologies
  const technologies = uniqueWords.filter(word => {
    // Common programming languages and technologies
    return !stopWords.has(word) && (
      word === "java" || word === "python" || word === "javascript" || word === "typescript" ||
      word === "react" || word === "angular" || word === "vue" || word === "node" ||
      word === "express" || word === "django" || word === "flask" || word === "spring" ||
      word === "aws" || word === "azure" || word === "gcp" || word === "docker" ||
      word === "kubernetes" || word === "jenkins" || word === "git" || word === "github" ||
      word === "gitlab" || word === "bitbucket" || word === "jira" || word === "confluence" ||
      word === "sql" || word === "nosql" || word === "mongodb" || word === "postgresql" ||
      word === "mysql" || word === "oracle" || word === "redis" || word === "kafka" ||
      word === "rabbitmq" || word === "graphql" || word === "rest" || word === "soap" ||
      word === "html" || word === "css" || word === "sass" || word === "less" ||
      word === "bootstrap" || word === "tailwind" || word === "material" || word === "webpack" ||
      word === "babel" || word === "eslint" || word === "jest" || word === "mocha" ||
      word === "chai" || word === "cypress" || word === "selenium" || word === "junit" ||
      word === "testng" || word === "maven" || word === "gradle" || word === "npm" ||
      word === "yarn" || word === "php" || word === "ruby" || word === "rails" ||
      word === "go" || word === "rust" || word === "scala" || word === "kotlin" ||
      word === "swift" || word === "objective" || word === "flutter" || word === "react-native" ||
      word === "xamarin" || word === "unity" || word === "tensorflow" || word === "pytorch" ||
      word === "pandas" || word === "numpy" || word === "scikit" || word === "hadoop" ||
      word === "spark" || word === "tableau" || word === "powerbi" || word === "excel"
    );
  });
  
  // Extract soft skills and qualities
  const softSkills = uniqueWords.filter(word => {
    return !stopWords.has(word) && (
      word.includes("communicat") || word.includes("collaborat") || word.includes("team") ||
      word.includes("lead") || word.includes("problem") || word.includes("solv") ||
      word.includes("critical") || word.includes("think") || word.includes("detail") ||
      word.includes("organiz") || word.includes("priorit") || word.includes("time") ||
      word.includes("deadline") || word.includes("adapt") || word.includes("flexible") ||
      word.includes("learn") || word.includes("innovat") || word.includes("creat") ||
      word.includes("interpersonal") || word.includes("present") || word.includes("verbal") ||
      word.includes("written") || word.includes("document") || word.includes("report")
    );
  });
  
  // Combine all keywords and limit to most relevant ones
  const allKeywords = [...new Set([...technicalTerms, ...technologies, ...softSkills])];
  return allKeywords.slice(0, 30); // Limit to top 30 keywords
}

/**
 * Highlights matching keywords in the resume preview
 * @param {string[]} keywords - Array of keywords to highlight
 */
function highlightKeywords(keywords) {
  if (!keywords || keywords.length === 0) return;
  
  const resumePreview = document.getElementById("resumePreview");
  if (!resumePreview) return;
  
  // Store original HTML content
  if (!resumePreview.dataset.originalContent) {
    resumePreview.dataset.originalContent = resumePreview.innerHTML;
  } else {
    // Reset to original content before highlighting
    resumePreview.innerHTML = resumePreview.dataset.originalContent;
  }
  
  // Get current HTML content
  let content = resumePreview.innerHTML;
  
  // Highlight each keyword
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    content = content.replace(regex, '<mark>$1</mark>');
  });
  
  // Update content with highlights
  resumePreview.innerHTML = content;
}

/**
 * Removes keyword highlighting from resume preview
 */
function clearHighlights() {
  const resumePreview = document.getElementById("resumePreview");
  if (resumePreview && resumePreview.dataset.originalContent) {
    resumePreview.innerHTML = resumePreview.dataset.originalContent;
  }
} 