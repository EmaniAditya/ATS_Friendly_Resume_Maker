// Helper: Normalize rating values (string descriptors or numbers) to 1-5 scale
function getRatingNumber(raw) {
  if (raw === undefined || raw === null) return 0;
  // If already a number or numeric string, clamp between 0-5
  const num = parseInt(raw);
  if (!isNaN(num)) {
    return Math.max(0, Math.min(5, num));
  }
  // Otherwise map common descriptors
  const mapping = {
    'novice': 1,
    'beginner': 1,
    'basic': 2,
    'intermediate': 3,
    'proficient': 4,
    'advanced': 5,
    'expert': 5,
    'master': 5
  };
  const key = String(raw).toLowerCase();
  return mapping[key] || 3; // default to mid-level if unknown
}

// Generate resume preview based on form data
function generateResume() {
  console.log('🔄 generateResume() called');
  const preview = document.getElementById("resumePreview");
  const data = collectFormData();
  
  // Debug: Log the collected data structure
  console.log('📊 Collected form data:', {
    fullName: data.fullName,
    jobTitle: data.jobTitle,
    hasProjects: !!(data.projects && data.projects.length > 0),
    projectsCount: data.projects ? data.projects.length : 0,
    hasRatedSkills: !!(data.ratedSkills && data.ratedSkills.length > 0),
    ratedSkillsCount: data.ratedSkills ? data.ratedSkills.length : 0,
    experienceCount: data.experience ? data.experience.length : 0,
    educationCount: data.education ? data.education.length : 0,
    sectionOrder: data.sectionOrder,
    projects: data.projects,
    ratedSkills: data.ratedSkills,
    experience: data.experience
  });
  
  // Debug: Check if we're getting user's sample data
  console.log('🔍 Data source check:', {
    isUserSampleData: data.fullName === 'E S AADITYA REDDY',
    actualFullName: data.fullName,
    expectedFullName: 'E S AADITYA REDDY'
  });
  
  // Save current data
  saveCurrentData();
  
  // Set template class (map default → classic for existing CSS)
  preview.className = '';
  if (data.template === 'default') {
    preview.classList.add('template-classic');
  } else if (data.template === 'custom') {
    preview.classList.add('template-custom'); // optional; mainly for future css hooks
  } else {
    preview.classList.add(`template-${data.template}`);
  }

  // ----- Dynamic color override for custom template -----
  let customStyles = '';
  if (data.template === 'custom') {
    const header = data.headerColor || '#000000';
    const sub = data.subColor || header;
    customStyles = `<style>#resumePreview h2{color:${header}} #resumePreview h4{color:${header};border-bottom:2px solid ${header}}</style>`;
  }

  
  // Start building HTML
  let html = '';
  
  // Header with name and contact info
  html += `<h2 class="text-center">${data.fullName || 'Your Name'}</h2>`;
  
  // Job title and contact info
  html += '<div class="contact-info">';
  if (data.jobTitle) {
    html += `<p class="text-center">${data.jobTitle}</p>`;
  }
  
  // Contact details in a single line
  const contactDetails = [];
  if (data.phone) contactDetails.push(data.phone);
  if (data.email) contactDetails.push(data.email);
  if (data.github) contactDetails.push(data.github);
  if (data.linkedin) contactDetails.push(data.linkedin);
  if (data.website) contactDetails.push(data.website);
  if (data.location) contactDetails.push(data.location);
  if (data.dob) contactDetails.push(`(DOB: ${data.dob})`);
  
  if (contactDetails.length > 0) {
    html += `<p class="text-center">${contactDetails.join(' | ')}</p>`;
  }
  
  html += '</div>';
  
  // Get section order
  const sectionOrder = data.sectionOrder.length > 0 ? data.sectionOrder : [
    'summary', 'skills', 'experience', 'education', 'projects', 'certifications', 'languages', 'achievements'
  ];
  
  // Generate each section based on the order
  sectionOrder.forEach(section => {
    switch (section) {
      case 'summary':
        html += '<h4>SUMMARY</h4>';
        html += `<p>${data.summary || 'Professional summary goes here...'}</p>`;
        break;
        
      case 'skills':
        html += '<h4>SKILLS</h4>';
        
        // Check if there are rated skills
        if (data.ratedSkills && data.ratedSkills.length > 0) {
          html += '<div class="rated-skills">';
          data.ratedSkills.forEach(skill => {
            if (skill.name) {
              // Generate star rating string
              const rating = getRatingNumber(skill.rating);
              const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
              html += `<div class="rated-skill"><span class="skill-name">${skill.name}</span> ${stars}</div>`;
            }
          });
          html += '</div>';
        }
        
        // Regular skills
        html += `<p>${data.skills ? data.skills.replace(/\n/g, '<br>') : 'Technical and soft skills go here...'}</p>`;
        break;
        
      case 'experience':
        html += '<h4>EXPERIENCE</h4>';
        if (data.experience && data.experience.length > 0) {
          data.experience.forEach(exp => {
            html += '<div class="experience-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${exp.title || 'Position'}</strong>`;
            if (exp.startDate || exp.endDate) {
              html += `<span>${exp.startDate || ''} - ${exp.endDate || ''}</span>`;
            }
            html += '</div>';
            html += '<div class="d-flex justify-content-between">';
            html += `<em>${exp.company || 'Company'}</em>`;
            if (exp.location) {
              html += `<span>${exp.location}</span>`;
            }
            html += '</div>';
            if (exp.description) {
              html += `<p>${exp.description.replace(/\n/g, '<br>')}</p>`;
            }
            html += '</div>';
          });
        } else {
          html += '<p>No work experience added yet.</p>';
        }
        break;
        
      case 'education':
        html += '<h4>EDUCATION</h4>';
        if (data.education && data.education.length > 0) {
          data.education.forEach(edu => {
            html += '<div class="education-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${edu.degree || 'Degree'}</strong>`;
            if (edu.educationStartDate || edu.educationEndDate) {
              html += `<span>${edu.educationStartDate || ''} - ${edu.educationEndDate || ''}</span>`;
            }
            html += '</div>';
            html += '<div class="d-flex justify-content-between">';
            html += `<em>${edu.institution || 'School'}</em>`;
            if (edu.educationLocation) {
              html += `<span>${edu.educationLocation}</span>`;
            }
            html += '</div>';
            if (edu.gpa && edu.scoreType !== 'none') {
              html += `<p>${edu.scoreType === 'percentage' ? 'Percentage' : 'GPA'}: ${edu.gpa}</p>`;
            }
            html += '</div>';
          });
        } else {
          html += '<p>No education information added yet.</p>';
        }
        break;
        
      case 'projects':
        html += '<h4>PROJECTS</h4>';
        if (data.projects && data.projects.length > 0) {
          data.projects.forEach(proj => {
            html += '<div class="project-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${proj.name || 'Project'}</strong>`;
            if (proj.technologies) {
              html += `<span>${proj.technologies}</span>`;
            }
            html += '</div>';
            
            // Project links
            if (proj.link || proj.github) {
              let links = [];
              if (proj.link) links.push(`<a href="#">${proj.link}</a>`);
              if (proj.github) links.push(`<a href="#">${proj.github}</a>`);
              html += `<p>${links.join(' | ')}</p>`;
            }
            
            if (proj.description) {
              html += `<p>${proj.description.replace(/\n/g, '<br>')}</p>`;
            }
            html += '</div>';
          });
        } else {
          html += '<p>No projects added yet.</p>';
        }
        break;
        
      case 'certifications':
        html += '<h4>CERTIFICATIONS</h4>';
        if (data.certifications && data.certifications.length > 0) {
          data.certifications.forEach(cert => {
            html += '<div class="certification-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${cert.name || 'Certification'}</strong>`;
            if (cert.date) {
              if (cert.expiration) {
                html += `<span>${cert.date} - ${cert.expiration}</span>`;
              } else {
                html += `<span>${cert.date}</span>`;
              }
            }
            html += '</div>';
            html += `<p><em>${cert.organization || ''}</em>`;
            if (cert.credentialId) {
              html += ` (ID: ${cert.credentialId})`;
            }
            html += '</p>';
            html += '</div>';
          });
        } else {
          html += '<p>No certifications added yet.</p>';
        }
        break;
        
      case 'languages':
        html += '<h4>LANGUAGES</h4>';
        if (data.languages && data.languages.length > 0) {
          html += '<div class="languages-entry">';
          const languageList = data.languages.map(lang => {
            return `${lang.language} (${lang.proficiency})`;
          }).join(', ');
          html += `<p>${languageList}</p>`;
          html += '</div>';
        } else {
          html += '<p>No languages added yet.</p>';
        }
        break;
        
      case 'achievements':
        html += '<h4>ACHIEVEMENTS & HONORS</h4>';
        if (data.achievements && data.achievements.length > 0) {
          data.achievements.forEach(achieve => {
            html += '<div class="achievement-entry">';
            html += '<div class="d-flex justify-content-between">';
            html += `<strong>${achieve.title || 'Achievement'}</strong>`;
            if (achieve.date) {
              html += `<span>${achieve.date}</span>`;
            }
            html += '</div>';
            if (achieve.description) {
              html += `<p>${achieve.description}</p>`;
            }
            html += '</div>';
          });
        } else {
          html += '<p>No achievements added yet.</p>';
        }
        break;
    }
  });
  
  // Set the HTML
  // Prepend dynamic style overrides if custom template is selected
  if (customStyles) {
    html = customStyles + html;
  }
  preview.innerHTML = html;
  
  // Check if content fits on one page
  checkPageOverflow();
}

// Check if content overflows the page and apply compact mode if needed
function checkPageOverflow() {
  const preview = document.getElementById('resumePreview');
  const pageWarning = document.getElementById('pageWarning');
  const singlePageMode = document.getElementById('singlePageMode');

  if (!preview) return;

  // Remove any previous restriction
  preview.style.maxHeight = '';
  preview.style.overflowY = '';

  if (singlePageMode && singlePageMode.checked) {
    // Single-page mode: restrict to A4 height with scrolling
    preview.style.maxHeight = '1123px'; // 297mm at 96dpi
    preview.style.overflowY = 'auto';
    if (preview.scrollHeight > 1123) {
      if (pageWarning) {
        pageWarning.style.display = 'block';
        pageWarning.textContent = 'Warning: Content exceeds one page. Reduce content for single-page mode.';
      }
    } else {
      if (pageWarning) pageWarning.style.display = 'none';
    }
  } else {
    // Free flow mode: enable scrolling for full content visibility
    preview.style.maxHeight = '80vh'; // Set reasonable max height for viewport
    preview.style.overflowY = 'auto'; // Enable vertical scrolling
    if (pageWarning) pageWarning.style.display = 'none';
  }
}

// Apply density setting with visual feedback
function applyDensitySetting(densityValue) {
  // Remove existing classes
  document.body.classList.remove('compact-mode');
  document.body.classList.remove('extreme-compact-mode');
  
  // Update active button state
  const densityButtons = document.querySelectorAll('.btn-group .btn');
  densityButtons.forEach((btn, index) => {
    btn.classList.remove('active');
    if (index === densityValue - 1) {
      btn.classList.add('active');
    }
  });
  
  // Apply appropriate class based on density setting
  if (densityValue === 2) {
    document.body.classList.add('compact-mode');
  } else if (densityValue === 3) {
    document.body.classList.add('extreme-compact-mode');
  }
  
  // Save current data with the new density setting
  saveCurrentData();
  
  // Check if content fits on one page
  setTimeout(checkPageOverflow, 100);
}



// Download resume as text-based PDF using pdfmake
function downloadTextBasedPDF() {
  // Check which export mode is selected
  const singlePageMode = document.getElementById('singlePageMode');
  const freeFlowMode = document.getElementById('freeFlowMode');
  
  const isSinglePage = singlePageMode && singlePageMode.checked;
  // (legacy toast removed – feature now implemented)
  
  showLoading();
  
  try {
    // Use existing data collection function
    const data = collectFormData();
    
    if (!data.fullName.trim()) {
      showToast('Please enter your name before generating PDF', 'warning');
      hideLoading();
      return;
    }
    
    const docDefinition = createPDFDocumentDefinition(data, isSinglePage);
    
    // Generate filename
    const fileName = (data.fullName || 'Resume').replace(/\s+/g, '_') + '_Resume.pdf';
    
    // Generate and download PDF
    pdfMake.createPdf(docDefinition).download(fileName);
    
    hideLoading();
    showToast('Text-based PDF downloaded successfully!');
    
  } catch (error) {
    console.error('Error generating text-based PDF:', error);
    hideLoading();
    showToast('Error generating PDF. Please try again.', 'error');
  }
}

// Limit content to fit within a single page for strict single-page mode
function limitContentForSinglePage(content) {
  // Estimate content height and reduce if necessary
  const maxItemsPerSection = {
    experience: 1,
    education: 1,
    projects: 1,
    certifications: 2,
    achievements: 1,
    languages: 4
  };
  
  const limitedContent = [];
  let currentSection = null;
  let sectionItemCount = 0;
  
  content.forEach(item => {
    if (item.text && typeof item.text === 'string' && item.text.match(/^[A-Z\s&]+$/)) {
      // This is likely a section header
      currentSection = item.text.toLowerCase().replace(/\s+/g, '');
      sectionItemCount = 0;
      limitedContent.push(item);
    } else if (currentSection && maxItemsPerSection[currentSection]) {
      // This is content within a section that has limits
      if (sectionItemCount < maxItemsPerSection[currentSection]) {
        limitedContent.push(item);
        if (item.text && item.text.trim() !== '') {
          sectionItemCount++;
        }
      }
      // Skip items that exceed the limit
    } else {
      // This is either header content or unlimited section content
      limitedContent.push(item);
    }
  });
  
  return limitedContent;
}

// Create PDF document definition for pdfmake
function createPDFDocumentDefinition(data, isSinglePageMode = false) {
  let content = [];
  
  // Header with name
  if (data.fullName) {
    content.push({
      text: data.fullName,
      style: 'name',
      alignment: 'center',
      margin: [0, 0, 0, 10]
    });
  }
  
  // Contact information
  const contactInfo = [];
  if (data.email) contactInfo.push(data.email);
  if (data.phone) contactInfo.push(data.phone);
  if (data.location) contactInfo.push(data.location);
  if (data.linkedin) contactInfo.push(data.linkedin);
  if (data.github) contactInfo.push(data.github);
  if (data.website) contactInfo.push(data.website);
  
  if (contactInfo.length > 0) {
    content.push({
      text: contactInfo.join(' | '),
      style: 'contact',
      alignment: 'center',
      margin: [0, 0, 0, 15]
    });
  }
  
  // ----- DYNAMIC SECTION ORDERING -----
  // Insert job title (if any) beneath the name before contact details
  if (data.jobTitle) {
    content.push({
      text: data.jobTitle,
      style: 'jobTitle',
      alignment: 'center',
      margin: [0, 0, 0, 5]
    });
  }

  // Determine the order from the same array the preview uses
  const sectionOrder = (Array.isArray(data.sectionOrder) && data.sectionOrder.length)
    ? data.sectionOrder
    : ['summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements', 'languages'];

  // ----- Dynamic spacing for single-page mode -----
  const includedSectionsArr = sectionOrder.filter(sec => {
    switch (sec) {
      case 'summary': return !!data.summary;
      case 'experience': return data.experience && data.experience.length;
      case 'projects': return data.projects && data.projects.length;
      case 'skills':
        return (data.ratedSkills && data.ratedSkills.length) || (data.skills && data.skills.trim());
      case 'education': return data.education && data.education.length;
      case 'certifications': return data.certifications && data.certifications.length;
      case 'achievements': return data.achievements && data.achievements.length;
      case 'languages': return data.languages && data.languages.length;
      default: return false;
    }
  });
  const includedSections = includedSectionsArr.length;

  let spacerSize = 10;
  if (isSinglePageMode) {
    if (includedSections <= 2) spacerSize = 60;
    else if (includedSections <= 4) spacerSize = 40;
    else if (includedSections <= 6) spacerSize = 25;
    else spacerSize = 15;
  }

  // Helper adds divider + spacer in single-page mode, or just spacer otherwise
  const divider = { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, color: '#cccccc' }], margin: [0, 4, 0, 8] };
  const addSpacer = () => {
    if (isSinglePageMode) content.push(divider);
    content.push({ text: '', margin: [0, 0, 0, spacerSize] });
  };

  sectionOrder.forEach(section => {
    switch (section) {
      case 'summary':
        if (data.summary) {
          content.push({ text: 'PROFESSIONAL SUMMARY', style: 'sectionHeader' });
          content.push({ text: data.summary, style: 'body', margin: [0, 0, 0, 10] });
        }
        break;

      case 'experience':
        if (data.experience && data.experience.length) {
          content.push({ text: 'PROFESSIONAL EXPERIENCE', style: 'sectionHeader' });
          data.experience.forEach(exp => {
            if (exp.title && exp.company) {
              content.push({ text: `${exp.title} | ${exp.company}`, style: 'jobTitle', margin: [0, 0, 0, 2] });
            }
            if (exp.startDate || exp.endDate) {
              const range = `${exp.startDate || ''}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate || 'Present'}`;
              content.push({ text: range, style: 'duration', margin: [0, 0, 0, 5] });
            }
            if (exp.location) {
              content.push({ text: exp.location, style: 'duration', margin: [0, 0, 0, 5] });
            }
            if (exp.description) {
               const bulletLines = exp.description.split('\n').filter(Boolean);
               const maxLines = isSinglePageMode ? 3 : bulletLines.length;
               bulletLines.slice(0, maxLines).forEach(bullet => {
                 content.push({ text: `• ${bullet.replace(/^[•\-*]\s*/, '')}`, style: 'body', margin: [10, 0, 0, 3] });
               });
               if (isSinglePageMode && bulletLines.length > maxLines) {
                 content.push({ text: '…', style: 'body', margin: [10, 0, 0, 3] });
               }
             }
            addSpacer();
          });
        }
        break;

      case 'projects':
        if (data.projects && data.projects.length) {
          content.push({ text: 'PROJECTS', style: 'sectionHeader' });
          data.projects.forEach(project => {
            if (project.name) {
              content.push({ text: project.name, style: 'jobTitle', margin: [0, 0, 0, 2] });
            }
            if (project.technologies) {
              content.push({ text: `Technologies: ${project.technologies}`, style: 'duration', margin: [0, 0, 0, 5] });
            }
            if (project.link || project.github) {
              const links = [];
              if (project.link) links.push(`Link: ${project.link}`);
              if (project.github) links.push(`GitHub: ${project.github}`);
              content.push({ text: links.join(' | '), style: 'duration', margin: [0, 0, 0, 5] });
            }
            if (project.description) {
               const bulletLines = project.description.split('\n').filter(Boolean);
               const maxLines = isSinglePageMode ? 3 : bulletLines.length;
               bulletLines.slice(0, maxLines).forEach(bullet => {
                 content.push({ text: `• ${bullet.replace(/^[•\-*]\s*/, '')}`, style: 'body', margin: [10, 0, 0, 3] });
               });
               if (isSinglePageMode && bulletLines.length > maxLines) {
                 content.push({ text: '…', style: 'body', margin: [10, 0, 0, 3] });
               }
             }
            addSpacer();
          });
        }
        break;

      case 'skills':
        if ((data.ratedSkills && data.ratedSkills.length) || (data.skills && data.skills.trim())) {
          content.push({ text: 'SKILLS', style: 'sectionHeader' });

          // Build combined bullet list
          const bullets = [];
          if (data.ratedSkills && data.ratedSkills.length) {
            data.ratedSkills.forEach(skill => {
              if (skill.name) {
                const ratingNum = getRatingNumber(skill.rating);
                const stars = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
                bullets.push(`${skill.name} ${stars}`);
              }
            });
          }
          if (data.skills) {
            data.skills.split('\n').filter(Boolean).forEach(line => bullets.push(line));
          }

          if (isSinglePageMode && bullets.length > 4) {
            const half = Math.ceil(bullets.length / 2);
            const col1 = bullets.slice(0, half).map(b => ({ text: `• ${b}`, style: 'body', margin: [0, 0, 0, 2] }));
            const col2 = bullets.slice(half).map(b => ({ text: `• ${b}`, style: 'body', margin: [0, 0, 0, 2] }));
            content.push({ columns: [{ width: '50%', stack: col1 }, { width: '50%', stack: col2 }] });
          } else {
            bullets.forEach(b => content.push({ text: `• ${b}`, style: 'body', margin: [0, 0, 0, 2] }));
          }
          addSpacer();
        }
        break;

      case 'education':
        if (data.education && data.education.length) {
          content.push({ text: 'EDUCATION', style: 'sectionHeader' });
          data.education.forEach(edu => {
            if (edu.degree && edu.institution) {
              content.push({ text: `${edu.degree} | ${edu.institution}`, style: 'jobTitle', margin: [0, 0, 0, 2] });
            }
            if (edu.educationStartDate || edu.educationEndDate) {
              const range = `${edu.educationStartDate || ''}${edu.educationStartDate && edu.educationEndDate ? ' - ' : ''}${edu.educationEndDate || 'Present'}`;
              content.push({ text: range, style: 'duration', margin: [0, 0, 0, 5] });
            }
            if (edu.educationLocation) {
              content.push({ text: edu.educationLocation, style: 'duration', margin: [0, 0, 0, 5] });
            }
            if (edu.gpa && edu.scoreType) {
              content.push({ text: `${edu.scoreType.toUpperCase()}: ${edu.gpa}`, style: 'body', margin: [0, 0, 0, 8] });
            }
            addSpacer();
          });
        }
        break;

      case 'certifications':
        if (data.certifications && data.certifications.length) {
          content.push({ text: 'CERTIFICATIONS', style: 'sectionHeader' });
          data.certifications.forEach(cert => {
            const header = `${cert.name || 'Certification'}${cert.organization ? ' | ' + cert.organization : ''}`;
            content.push({ text: header, style: 'jobTitle', margin: [0, 0, 0, 2] });
            if (cert.date) {
              const dateLine = cert.expiration ? `${cert.date} - ${cert.expiration}` : cert.date;
              content.push({ text: dateLine, style: 'duration', margin: [0, 0, 0, 5] });
            }
            if (cert.credentialId) {
              content.push({ text: `Credential ID: ${cert.credentialId}`, style: 'body', margin: [0, 0, 0, 8] });
            }
            addSpacer();
          });
        }
        break;

      case 'achievements':
        if (data.achievements && data.achievements.length) {
          content.push({ text: 'ACHIEVEMENTS', style: 'sectionHeader' });
          data.achievements.forEach(a => {
            if (a.title) content.push({ text: a.title, style: 'jobTitle', margin: [0, 0, 0, 2] });
            if (a.date) content.push({ text: a.date, style: 'duration', margin: [0, 0, 0, 5] });
            if (a.description) content.push({ text: a.description, style: 'body', margin: [0, 0, 0, 8] });
            addSpacer();
          });
        }
        break;

      case 'languages':
        if (data.languages && data.languages.length > 0) {
          content.push({ text: 'LANGUAGES', style: 'sectionHeader' });

          const langStrings = data.languages.map(l => l.proficiency ? `${l.language} (${l.proficiency})` : l.language);

          if (isSinglePageMode && langStrings.length > 4) {
            const half = Math.ceil(langStrings.length / 2);
            const col1 = langStrings.slice(0, half).map(l => ({ text: `• ${l}`, style: 'body', margin: [0, 0, 0, 2] }));
            const col2 = langStrings.slice(half).map(l => ({ text: `• ${l}`, style: 'body', margin: [0, 0, 0, 2] }));
            content.push({ columns: [{ width: '50%', stack: col1 }, { width: '50%', stack: col2 }] });
          } else {
            langStrings.forEach(l => content.push({ text: `• ${l}`, style: 'body', margin: [0, 0, 0, 2] }));
          }
          addSpacer();
        }
        break;
    }
  });

  // ----- END DYNAMIC SECTION ORDERING -----

  // ----- PDF STYLE MAPPING BASED ON SELECTED TEMPLATE -----
  const stylePalettes = {
    default:      { primary: '#000000', secondary: '#000000', headerFill: null },
    custom:       { primary: data.headerColor || '#000000', secondary: data.subColor || (data.headerColor || '#000000'), headerFill: null },
    classic:      { primary: '#000000', secondary: '#000000', headerFill: null },
    professional: { primary: '#2c3e50', secondary: '#34495e', headerFill: '#f8f9fa' },
    modern:       { primary: '#1a5276', secondary: '#1a5276', headerFill: '#e8f6f3' },
    minimalist:   { primary: '#222222', secondary: '#222222', headerFill: null }
  };
  const palette = stylePalettes[data.template] || stylePalettes.classic;

  return {
    content: content,
    styles: {
      name: { fontSize: 20, bold: true, color: palette.primary },
      contact: { fontSize: 10, color: '#5a6c7d' },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        color: palette.primary,
        margin: [0, 15, 0, 8],
        decoration: data.template === 'professional' ? 'underline' : undefined,
        fillColor: palette.headerFill || undefined,
        alignment: 'left'
      },
      jobTitle: { fontSize: 11, bold: true, color: palette.secondary },
      duration: { fontSize: 9, color: '#7f8c8d', italics: true },
      body: { fontSize: 10, color: palette.primary, lineHeight: 1.3 }
    },
    pageMargins: [40, 40, 40, 40]
  };

// Professional Summary
  if (data.summary) {
    content.push({ text: 'PROFESSIONAL SUMMARY', style: 'sectionHeader' });
    content.push({ text: data.summary, style: 'body', margin: [0, 0, 0, 10] });
  }
  
  // Skills
  if (data.skills) {
    content.push({ text: 'SKILLS', style: 'sectionHeader' });
    // Handle skills as a formatted string
    const skillLines = data.skills.split('\n').filter(line => line.trim());
    skillLines.forEach(line => {
      content.push({
        text: line,
        style: 'body',
        margin: [0, 0, 0, 3]
      });
    });
    content.push({ text: '', margin: [0, 0, 0, 10] });
  }
  
  // Rated Skills
  if (data.ratedSkills && data.ratedSkills.length > 0) {
    content.push({ text: 'TECHNICAL PROFICIENCY', style: 'sectionHeader' });
    data.ratedSkills.forEach(skill => {
      if (skill.name) {
        const rating = skill.rating ? ` (${skill.rating}/5)` : '';
        content.push({
          text: `${skill.name}${rating}`,
          style: 'body',
          margin: [0, 0, 0, 3]
        });
      }
    });
    content.push({ text: '', margin: [0, 0, 0, 10] });
  }
  
  // Experience
  if (data.experience && data.experience.length > 0) {
    content.push({ text: 'PROFESSIONAL EXPERIENCE', style: 'sectionHeader' });
    data.experience.forEach(exp => {
      if (exp.title && exp.company) {
        content.push({
          text: `${exp.title} | ${exp.company}`,
          style: 'jobTitle',
          margin: [0, 0, 0, 2]
        });
      }
      // Format date range
      if (exp.startDate || exp.endDate) {
        const startDate = exp.startDate || '';
        const endDate = exp.endDate || 'Present';
        const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : (startDate || endDate);
        content.push({
          text: dateRange,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (exp.location) {
        content.push({
          text: exp.location,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (exp.description) {
        const bullets = exp.description.split('\n').filter(line => line.trim());
        bullets.forEach(bullet => {
          content.push({
            text: `• ${bullet.replace(/^[•\-\*]\s*/, '')}`,
            style: 'body',
            margin: [10, 0, 0, 3]
          });
        });
      }
      content.push({ text: '', margin: [0, 0, 0, 8] });
    });
  }
  
  // Education
  if (data.education && data.education.length > 0) {
    content.push({ text: 'EDUCATION', style: 'sectionHeader' });
    data.education.forEach(edu => {
      if (edu.degree && edu.institution) {
        content.push({
          text: `${edu.degree} | ${edu.institution}`,
          style: 'jobTitle',
          margin: [0, 0, 0, 2]
        });
      }
      // Format education date range
      if (edu.educationStartDate || edu.educationEndDate) {
        const startDate = edu.educationStartDate || '';
        const endDate = edu.educationEndDate || 'Present';
        const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : (startDate || endDate);
        content.push({
          text: dateRange,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (edu.educationLocation) {
        content.push({
          text: edu.educationLocation,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (edu.gpa && edu.scoreType) {
        content.push({
          text: `${edu.scoreType}: ${edu.gpa}`,
          style: 'body',
          margin: [0, 0, 0, 8]
        });
      }
    });
  }
  
  // Projects
  if (data.projects && data.projects.length > 0) {
    content.push({ text: 'PROJECTS', style: 'sectionHeader' });
    data.projects.forEach(project => {
      if (project.name) {
        content.push({
          text: project.name,
          style: 'jobTitle',
          margin: [0, 0, 0, 2]
        });
      }
      if (project.technologies) {
        content.push({
          text: `Technologies: ${project.technologies}`,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (project.link || project.github) {
        const links = [];
        if (project.link) links.push(`Link: ${project.link}`);
        if (project.github) links.push(`GitHub: ${project.github}`);
        content.push({
          text: links.join(' | '),
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (project.description) {
        const bullets = project.description.split('\n').filter(line => line.trim());
        bullets.forEach(bullet => {
          content.push({
            text: `• ${bullet.replace(/^[•\-\*]\s*/, '')}`,
            style: 'body',
            margin: [10, 0, 0, 3]
          });
        });
      }
      content.push({ text: '', margin: [0, 0, 0, 8] });
    });
  }
  
  // Languages
  if (data.languages && data.languages.length > 0) {
    content.push({ text: 'LANGUAGES', style: 'sectionHeader' });
    const langText = data.languages.map(lang => 
      `${lang.language}${lang.proficiency ? ` (${lang.proficiency})` : ''}`
    ).join(', ');
    content.push({ text: langText, style: 'body', margin: [0, 0, 0, 10] });
  }
  
  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    content.push({ text: 'CERTIFICATIONS', style: 'sectionHeader' });
    data.certifications.forEach(cert => {
      if (cert.name) {
        let certText = cert.name;
        if (cert.organization) {
          certText += ` | ${cert.organization}`;
        }
        content.push({
          text: certText,
          style: 'jobTitle',
          margin: [0, 0, 0, 2]
        });
      }
      if (cert.date) {
        content.push({
          text: cert.date,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (cert.credentialId) {
        content.push({
          text: `Credential ID: ${cert.credentialId}`,
          style: 'body',
          margin: [0, 0, 0, 8]
        });
      }
    });
  }
  
  // Achievements
  if (data.achievements && data.achievements.length > 0) {
    content.push({ text: 'ACHIEVEMENTS', style: 'sectionHeader' });
    data.achievements.forEach(achievement => {
      if (achievement.title) {
        content.push({
          text: achievement.title,
          style: 'jobTitle',
          margin: [0, 0, 0, 2]
        });
      }
      if (achievement.date) {
        content.push({
          text: achievement.date,
          style: 'duration',
          margin: [0, 0, 0, 5]
        });
      }
      if (achievement.description) {
        content.push({
          text: achievement.description,
          style: 'body',
          margin: [0, 0, 0, 8]
        });
      }
    });
  }
  
  // Configure document based on single-page mode
  const docDefinition = {
    content: content,
    styles: {
      name: {
        fontSize: isSinglePageMode ? 16 : 20, // Slightly smaller in single-page mode
        bold: true,
        color: '#2c3e50'
      },
      contact: {
        fontSize: isSinglePageMode ? 8 : 10, // Smaller contact info in single-page mode
        color: '#5a6c7d'
      },
      sectionHeader: {
        fontSize: isSinglePageMode ? 10 : 12, // Smaller headers in single-page mode
        bold: true,
        color: '#2c3e50',
        margin: isSinglePageMode ? [0, 8, 0, 4] : [0, 12, 0, 6], // Further reduced margins for single-page
        decoration: 'underline'
      },
      jobTitle: {
        fontSize: isSinglePageMode ? 9 : 11,
        bold: true,
        color: '#34495e'
      },
      duration: {
        fontSize: isSinglePageMode ? 7 : 9,
        color: '#7f8c8d',
        italics: true
      },
      body: {
        fontSize: isSinglePageMode ? 8 : 10, // Smaller body text in single-page mode
        color: '#2c3e50',
        lineHeight: isSinglePageMode ? 1.15 : 1.3 // Tighter line height
      }
    },
    pageMargins: isSinglePageMode ? [25, 25, 25, 25] : [40, 40, 40, 40] // Smaller margins
  };
  
  // Add single-page mode specific settings
  if (isSinglePageMode) {
    // Strict single-page enforcement: limit content and prevent page breaks
    docDefinition.pageBreakBefore = function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
      // Prevent page breaks in single-page mode
      return false;
    };
    
    // Remove trailing blank lines/dividers to save space
    while (content.length && ((content[content.length - 1].text === '') || content[content.length - 1].canvas)) {
      content.pop();
    }

    // Apply aggressive content reduction for single-page mode
    content = limitContentForSinglePage(content);
    docDefinition.content = content;

    // Set page size and restrict to one page
    docDefinition.pageSize = 'A4';
    docDefinition.pageOrientation = 'portrait';
    docDefinition.maxPagesNumber = 1;

    // Slightly smaller default style for extra room
    docDefinition.defaultStyle = {
      fontSize: 8,
      lineHeight: 1.1
    };
  }
  
  return docDefinition;
}

// Generate plain text version of the resume
function generatePlainText() {
  const data = collectFormData();
  let plainText = '';
  
  // Header with name and contact info
  plainText += `${data.fullName || 'Your Name'}\n`;
  if (data.jobTitle) {
    plainText += `${data.jobTitle}\n`;
  }
  
  // Contact details
  const contactDetails = [];
  if (data.phone) contactDetails.push(data.phone);
  if (data.email) contactDetails.push(data.email);
  if (data.github) contactDetails.push(data.github);
  if (data.linkedin) contactDetails.push(data.linkedin);
  if (data.website) contactDetails.push(data.website);
  if (data.location) contactDetails.push(data.location);
  if (data.dob) contactDetails.push(`DOB: ${data.dob}`);
  
  if (contactDetails.length > 0) {
    plainText += `${contactDetails.join(' | ')}\n\n`;
  }
  
  // Get section order
  const sectionOrder = data.sectionOrder.length > 0 ? data.sectionOrder : [
    'summary', 'skills', 'experience', 'education', 'projects', 'certifications', 'languages', 'achievements'
  ];
  
  // Generate each section based on the order
  sectionOrder.forEach(section => {
    switch (section) {
      case 'summary':
        if (data.summary) {
          plainText += 'SUMMARY\n';
          plainText += '=======\n';
          plainText += `${data.summary}\n\n`;
        }
        break;
        
      case 'skills':
        if (data.skills) {
          plainText += 'SKILLS\n';
          plainText += '======\n';
          
          // Check if there are rated skills
          if (data.ratedSkills && data.ratedSkills.length > 0) {
            data.ratedSkills.forEach(skill => {
              if (skill.name) {
                const rating = getRatingNumber(skill.rating);
                const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
                plainText += `${skill.name} ${stars}\n`;
              }
            });
            plainText += '\n';
          }
          
          // Regular skills
          plainText += `${data.skills}\n\n`;
        }
        break;
        
      case 'experience':
        if (data.experience && data.experience.length > 0) {
          plainText += 'EXPERIENCE\n';
          plainText += '==========\n';
          data.experience.forEach(exp => {
            plainText += `${exp.title || 'Position'}\n`;
            plainText += `${exp.company || 'Company'}`;
            if (exp.startDate || exp.endDate) {
              plainText += ` | ${exp.startDate || ''} - ${exp.endDate || ''}`;
            }
            if (exp.location) {
              plainText += ` | ${exp.location}`;
            }
            plainText += '\n';
            if (exp.description) {
              plainText += `${exp.description}\n`;
            }
            plainText += '\n';
          });
        }
        break;
        
      case 'education':
        if (data.education && data.education.length > 0) {
          plainText += 'EDUCATION\n';
          plainText += '=========\n';
          data.education.forEach(edu => {
            plainText += `${edu.degree || 'Degree'}\n`;
            plainText += `${edu.institution || 'School'}`;
            if (edu.educationStartDate || edu.educationEndDate) {
              plainText += ` | ${edu.educationStartDate || ''} - ${edu.educationEndDate || ''}`;
            }
            if (edu.educationLocation) {
              plainText += ` | ${edu.educationLocation}`;
            }
            plainText += '\n';
            if (edu.gpa && edu.scoreType !== 'none') {
              plainText += `${edu.scoreType === 'percentage' ? 'Percentage' : 'GPA'}: ${edu.gpa}\n`;
            }
            plainText += '\n';
          });
        }
        break;
        
      case 'projects':
        if (data.projects && data.projects.length > 0) {
          plainText += 'PROJECTS\n';
          plainText += '========\n';
          data.projects.forEach(proj => {
            plainText += `${proj.name || 'Project'}`;
            if (proj.technologies) {
              plainText += ` | ${proj.technologies}`;
            }
            plainText += '\n';
            
            // Project links
            if (proj.link || proj.github) {
              let links = [];
              if (proj.link) links.push(proj.link);
              if (proj.github) links.push(proj.github);
              plainText += `${links.join(' | ')}\n`;
            }
            
            if (proj.description) {
              plainText += `${proj.description}\n`;
            }
            plainText += '\n';
          });
        }
        break;
        
      case 'certifications':
        if (data.certifications && data.certifications.length > 0) {
          plainText += 'CERTIFICATIONS\n';
          plainText += '==============\n';
          data.certifications.forEach(cert => {
            plainText += `${cert.name || 'Certification'}`;
            if (cert.date) {
              if (cert.expiration) {
                plainText += ` | ${cert.date} - ${cert.expiration}`;
              } else {
                plainText += ` | ${cert.date}`;
              }
            }
            plainText += '\n';
            plainText += `${cert.organization || ''}`;
            if (cert.credentialId) {
              plainText += ` (ID: ${cert.credentialId})`;
            }
            plainText += '\n\n';
          });
        }
        break;
        
      case 'languages':
        if (data.languages && data.languages.length > 0) {
          plainText += 'LANGUAGES\n';
          plainText += '=========\n';
          const languageList = data.languages.map(lang => {
            if (lang.proficiency) {
              return `${lang.language} (${lang.proficiency})`;
            } else {
              return lang.language;
            }
          }).filter(Boolean);
          
          plainText += `${languageList.join(' • ')}\n\n`;
        }
        break;
        
      case 'achievements':
        if (data.achievements && data.achievements.length > 0) {
          plainText += 'ACHIEVEMENTS & HONORS\n';
          plainText += '=====================\n';
          data.achievements.forEach(achieve => {
            plainText += `${achieve.title || 'Achievement'}`;
            if (achieve.date) {
              plainText += ` | ${achieve.date}`;
            }
            plainText += '\n';
            if (achieve.description) {
              plainText += `${achieve.description}\n`;
            }
            plainText += '\n';
          });
        }
        break;
    }
  });
  
  return plainText;
}

// View plain text version
function viewPlainText() {
  // Generate latest text every time the button is clicked
  const plainText = generatePlainText();
  const modalEl = document.getElementById('plainTextModal');
  if (!modalEl) {
    showToast('Plain-text modal not found', 'error');
    return;
  }
  // When the modal is fully shown, populate content (ensures the element is in the DOM)
  const handler = () => {
    const pre = document.getElementById('plainTextContent');
    if (pre) {
      pre.textContent = plainText;
    }
    modalEl.removeEventListener('shown.bs.modal', handler);
  };
  modalEl.addEventListener('shown.bs.modal', handler);
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

// Download plain text version
function downloadPlainText() {
  const plainText = generatePlainText();
  const blob = new Blob([plainText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ATS_Friendly_Resume.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Track plain text download
  if (typeof trackFeatureUsage === 'function') {
    trackFeatureUsage('plainTextDownload');
  }
  
  showToast('Plain text resume downloaded successfully');
}

// Copy plain text to clipboard
function copyPlainText() {
  const plainTextContent = document.getElementById('plainTextContent');
  if (!plainTextContent) {
    showToast('Error copying text. Please try again.', 'error');
    return;
  }
  
  const text = plainTextContent.textContent;
  
  // Use modern Clipboard API if available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast('Plain text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback to older method
        fallbackCopyTextToClipboard(plainTextContent);
      });
  } else {
    // Fallback for browsers that don't support Clipboard API
    fallbackCopyTextToClipboard(plainTextContent);
  }
}

// Fallback method for copying text
function fallbackCopyTextToClipboard(element) {
  try {
    // Create a range and selection
    const range = document.createRange();
    range.selectNode(element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    // Execute copy command
    const successful = document.execCommand('copy');
    window.getSelection().removeAllRanges();
    
    if (successful) {
      showToast('Plain text copied to clipboard');
    } else {
      showToast('Failed to copy text. Please try manually.', 'warning');
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    showToast('Failed to copy text. Please try manually.', 'warning');
  }
} 